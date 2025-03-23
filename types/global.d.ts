 
import { ObjectId } from 'mongodb';

declare global {   
  interface Movie{
    Title: string
    Released: string
    Genre: string
    Director: string
    Writer: string
    Actors: string
    Language: string
    Country: string 
    Awards: string
    Poster: string
    Plot: string
    plot_embedding: number[]
    _id: string
    }

    type MoviesProps = {
        cursor?: string | null;
        limit?: number;
    }
    type MovieResponse = {
        movies: Partial<Movie>[];
        pageInfo: {
            hasNext: boolean;
            nextCursor: string | null;
        };
    }

    type SearchMoviesProps = {
        searchTerm: string;
        cursor?: string | null;
        limit?: number;
    }
    
    interface MongoQuery {
        $text?: { $search: string };
        _id?: { $gt: ObjectId };
    }

    type Results = {
        movies: Partial<Movie>[];
        pageInfo: {
          hasNext: boolean;
          nextCursor: string | null;
        },
    }

    type InsightItem = {
      title: string;
      items: string[];
    };

    type MovieComment = {
        id: string;
        content: string;
        createdAt: Date;
        updatedAt: Date;
    }

    type InsightsArray = InsightItem[];

    type Filters = 'All' | 'Action' | 'Comedy' | 'Drama' | 'Horror' | 'Romance' | 'Sci-Fi' | 'Thriller';
 }
