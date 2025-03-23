import { connectToDatabase } from '@/lib/mongodb';
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import * as dotenv from 'dotenv';
import movies from './movies.json';
import { addComments, searchMovies } from './lib/actions/getMovies.action';
type Movie = typeof movies
const movieData = movies;
dotenv.config();
const API_KEY = process.env.GEMINI_API_KEY; // Store in environment variable
const COLLECTION_NAME = 'recommendation';

type MovieItem = Movie[number];
type ModifiedMovie = Pick<MovieItem, "Title" | "Released" | "Genre" | "Director" | "Writer" | "Actors" | "Plot" | "Language" | "Country" | "Awards" | "Poster"> &{
    plot_embedding: number[];
    Plot: string;
};

const main = async () => {
    const startTime = Date.now();
    try {
        const { db } = await connectToDatabase();
        console.log('Connected successfully to MongoDB server');
        
        const collection = db.collection(COLLECTION_NAME);
        const embeddings = new GoogleGenerativeAIEmbeddings({
            modelName: "text-embedding-004",
            apiKey: API_KEY,
        });

        const data: ModifiedMovie[] = [];
        // Generate data
        for (const movie of movieData) {
            const text_to_embed = `In ${movie.Genre} movie ${movie.Title}, ${movie.Actors} as the main characters, written by ${movie.Writer}, and directed by ${movie.Director}, the movie tells a story of ${movie.Plot}`;
            data.push({ 
                Title: movie.Title, 
                Released: movie.Released, 
                Genre: movie.Genre, 
                Director: movie.Director, 
                Writer: movie.Writer, 
                Actors: movie.Actors, 
                Language: movie.Language, 
                Country: movie.Country, 
                Awards: movie.Awards, 
                Poster: movie.Poster,
                Plot: text_to_embed, 
                plot_embedding: [] 
            });
        }
        const plots = data.map(doc => doc.Plot);
        const plotEmbeddings = await embeddings.embedDocuments(plots);
        console.log('Embedded all documents');
         // Update data with embeddings
        data.forEach((doc, index) => {
            doc.plot_embedding = plotEmbeddings[index];
        });
        
        // Delete all data in collection in case it exist
        await collection.deleteMany({});
        //Check if index exist then delete it
        const indexExists = await collection.indexExists("movie_plot_vector_index");
        if (indexExists) {
            await collection.dropIndex("movie_plot_vector_index");
        }
        // Create a search index on the plot_embedding field if it doesn't exist
        console.log('Index exists',indexExists);
        if (!indexExists) {
                await collection.createSearchIndex({
                    name: "movie_plot_vector_index",
                    type: "vectorSearch",
                    definition: {
                        fields: [
                            {
                                type: "vector",
                                numDimensions: plotEmbeddings[0].length,
                                path: "plot_embedding",
                                similarity: "cosine"
                            }
                        ]
                    }
                });
        }
        console.log('Vector index created successfully');
        // Insert data into collection
        await collection.insertMany(data);
        // End timer and log time taken
        const endTime = Date.now();
        const timeTaken = endTime - startTime;
        console.log(`Time taken to seed data: ${timeTaken}ms`);
        console.log('Inserted documents into the collection successfully');
    } catch (error) {
        console.log("could not seed data", error);
    }
}

const search = async (queryText: string) => {
    try {
        const startTime = Date.now();
        const { db } = await connectToDatabase();
        console.log('Connected successfully to MongoDB server');
        
        const collection = db.collection(COLLECTION_NAME);
        // Generate the embedding for the query text
        const embeddings = new GoogleGenerativeAIEmbeddings({
            modelName: "text-embedding-004",
            apiKey: API_KEY,
        });
        const queryEmbedding = await embeddings.embedDocuments([queryText]);
        const queryVector = queryEmbedding[0];
        // Define the vector search pipeline
        const pipeline = [
            {
                '$vectorSearch': {
                    'index': 'movie_plot_vector_index',
                    'path': 'plot_embedding',
                    'queryVector': queryVector,
                    'numCandidates': 100, // Number of candidate documents to consider
                    'limit': 5 // Number of documents to return
                }
            },
            {
                '$project': {
                    '_id': 0,
                    'Title': 1,
                    'Plot': 1,
                    'Actors': 1,
                    'Released': 1,
                    'Director': 1,
                    'Poster': 1,
                    'Awards': 1,
                    'Writer': 1,
                    'score': { '$meta': 'vectorSearchScore' }
                }
            }
        ];
        // Run the aggregation pipeline
        const results = await collection.aggregate(pipeline).toArray();
         // End timer and log time taken
         const endTime = Date.now();
         const timeTaken = endTime - startTime;
         console.log(`Time taken to seed data: ${timeTaken/1000}s`);
        return results
    } catch (error) {
        console.error('Error during vector search:', error);
    }
};

(async()=>{
//   const results =  await searchMovies("Crime");
  const startTime = Date.now();
//   const results =  await searchMovies({searchTerm: "Crime"});
  const results = await addComments({id:"67d9954c051d0276a543c378"});
  console.log('results:', results)
  const endTime = Date.now();
  const timeTaken = endTime - startTime;
  console.log(`Time taken to search: ${timeTaken/1000}s`);
//   console.log(`Returned videos: ${results.length}`);
    // await main();
})()
