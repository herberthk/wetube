'use server';
import { API_KEY, MOVIE_COLLECTION_NAME, MOVIE_COMMENTS_COLLECTION, summaryPrompt } from '@/constants';
import { connectToDatabase } from '../mongodb';
import { ObjectId } from 'mongodb';
import { GoogleGenerativeAIEmbeddings,ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { revalidatePath } from 'next/cache';

interface MongoQuery {
    $text?: { $search: string };
    _id?: { $gt: ObjectId };
    genre?: { $regex: string; $options: string };
}

export const getMovies = async ({cursor = null, limit = 12}: MoviesProps): Promise<MovieResponse> => {
    try {
        const { db } = await connectToDatabase();
        console.log('Connected successfully to MongoDB server');
        const collection = db.collection(MOVIE_COLLECTION_NAME);

        let query = {};
        if (cursor) {
            query = { _id: { $gt: new ObjectId(cursor) } };
        }
        const movies = await collection.find(query, {
            projection: { Title: 1, Poster: 1, Language: 1, Country: 1 }
        }).limit(limit + 1).toArray() as unknown as Movie[];

        let nextCursor: string | null = null;
        let hasNext = false;

        if (movies.length > limit) {
            const nextMovie = movies.pop();
            nextCursor = nextMovie?._id.toString() || null;
            hasNext = true;
        }

        const modifiedMovies = movies.map(movie => ({
            ...movie,
            _id: movie._id.toString(),
        }));
        return {
            movies: modifiedMovies,
            pageInfo: {
                hasNext,
                nextCursor,
            },
        };
    } catch (error) {
        console.error('error getting movies', error);
        return { 
            movies: [], 
            pageInfo: {
                hasNext: false,
                nextCursor: null,
            },
         };
    }
}

const recommendationCache = new Map<string, { timestamp: number; data: Movie[] }>();
const searchCache = new Map<string, { timestamp: number; data: MovieResponse }>();
// check and clear expired cache
// setInterval(() => {
//     const now = Date.now();
//     for (const [key, { timestamp }] of actionCache.entries()) {
//       if (now - timestamp >= 30 * 60 * 1000) {
//         actionCache.delete(key);
//       }
//     }
//   }, 60 * 1000); // Runs every 1 minute
/**
 * Pro Tip
 * If your app scales or needs robust caching, consider using something like `lru-cache` or `node-cache` which handles expiry automatically.
 */
export const getRecommendedMovies = async(queryText: string): Promise<Movie[]> => { 
    try {
        // Check if the data is already in the cache
        if (recommendationCache.has(queryText)) {
            const { timestamp, data } = recommendationCache.get(queryText)!;
            if (Date.now() - timestamp < 30 * 60 * 1000) {
              return data;
            }
          }
        const { db } = await connectToDatabase();
         
        const collection = db.collection(MOVIE_COLLECTION_NAME);
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
                    'limit': 6 // Number of documents to return
                }
            },
            {
                '$project': {
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
        const results = await collection.aggregate(pipeline).toArray() as Movie[];
        const modifiedMovies = results.map(movie => ({
            ...movie,
            _id: movie._id.toString(),
        }));

        recommendationCache.set(queryText, {
            timestamp: Date.now(),
            data: modifiedMovies,
          });
        return modifiedMovies
    } catch (error) {
        console.log('Could not get recommended movies', error);
        return [];
    }
 }

export const searchMovies = async ({ searchTerm, cursor = null, limit = 12 }: SearchMoviesProps): Promise<MovieResponse> => {
    try {
        // Check cache first
        if (searchCache.has(searchTerm)) {
            const { timestamp, data } = searchCache.get(searchTerm)!;
            if (Date.now() - timestamp < 30 * 60 * 1000) {
                return data;
            }
        }

        const { db } = await connectToDatabase();
        const collection = db.collection(MOVIE_COLLECTION_NAME);

        // Create a query that searches both plot and genre
        const query: MongoQuery = {
            $text: { $search: searchTerm },
            // genre: { $regex: searchTerm, $options: 'i' }
        };

        if (cursor) {
            query._id = { $gt: new ObjectId(cursor) };
        }

        const movies = await collection.find(
            query,
            {
                projection: {
                    Title: 1,
                    Poster: 1,
                    Language: 1,
                    Country: 1,
                    Plot: 1,
                    genre: 1,
                    score: { $meta: "textScore" }
                },
                sort: { score: { $meta: "textScore" } }
            }
        ).limit(limit + 1).toArray() as unknown as Movie[];

        // Process results...
        const result = processMovieResults(movies, limit);
        
        // Cache the results
        searchCache.set(searchTerm, {
            timestamp: Date.now(),
            data: result
        });

        return result;
    } catch (error) {
        console.error('Error searching movies:', error);
        return {
            movies: [],
            pageInfo: {
                hasNext: false,
                nextCursor: null,
            },
        };
    }
}

// Helper function to process movie results
function processMovieResults(movies: Movie[], limit: number): MovieResponse {
    let nextCursor: string | null = null;
    let hasNext = false;

    if (movies.length > limit) {
        const nextMovie = movies.pop();
        nextCursor = nextMovie?._id.toString() || null;
        hasNext = true;
    }

    const modifiedMovies = movies.map(movie => ({
        ...movie,
        _id: movie._id.toString(),
    }));

    return {
        movies: modifiedMovies,
        pageInfo: {
            hasNext,
            nextCursor,
        },
    };
}

type Props ={
    desc: string
    id: string
}

export const processComments = async ({desc,id}:Props) => {
    try {

        const comments = await getComments(id)
        const commentsContent = comments.map(comment => comment.content);
        const commentString = commentsContent.join('\n');
        const chat = new ChatGoogleGenerativeAI({
            model: "gemini-2.0-flash",
            temperature: 0.3,
            maxRetries: 2,
            apiKey: API_KEY,
            });

        // Build prompt
        const prompt = await summaryPrompt.format({
            comments: commentString,
            movie_description: desc,
        });

        // Send to LLM via Langchain
        const result = await chat.invoke([
            new SystemMessage("You are a helpful assistant."),
            new HumanMessage(prompt),
        ]);
        // console.log('LLM result',result.content)
        return result.content
    } catch (error) {
        console.log('Could not process comments', error);
    }

}

type AddCommentProps = {
    id: string;
    content: string;
    title: string;
}

export const addComment = async ({id,content,title}: AddCommentProps) => {
    try {
        const { db } = await connectToDatabase();
        const collection = db.collection(MOVIE_COMMENTS_COLLECTION);
        
        // Convert string ID back to ObjectId
        const movieId = new ObjectId(id);
        // Insert comments
         await collection.insertOne({movieId,content,createdAt:new Date(),updatedAt:new Date()});
        // console.log(`Successfully added ${result.insertedCount} comments`);
        revalidatePath(`/movie/${encodeURIComponent(title)}`);
        return {
            success: true,
        };

    } catch (error) {
        console.error('Error adding initial comments:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        };
    }
}

export const getComments = async (movieId: string) => {
    try {
        const { db } = await connectToDatabase();
        const collection = db.collection(MOVIE_COMMENTS_COLLECTION);
        
        // Convert string ID to ObjectId
        const objectId = new ObjectId(movieId);
        
        // Ensure index on movieId and createdAt for faster queries and sorting
        await collection.createIndex({ movieId: 1, createdAt: -1 });
        
        // Find comments for the given movie ID, sorted by createdAt descending
        const comments = await collection.find({ movieId: objectId })
            .sort({ createdAt: -1 })
            .toArray();
        const modifiedComments = comments.map(comment => ({
            content: comment.content,
            id: comment._id.toString(),
            createdAt: comment.createdAt,
        }))
        return modifiedComments;
    } catch (error) {
        console.error('Error fetching comments:', error);
        return [];
    }
}
