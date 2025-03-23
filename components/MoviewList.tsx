'use client'
import MovieCard from '@/components/MovieCard';
import PlaceHolders from '@/components/PlaceHolder';
import { getMovies } from '@/lib/actions/getMovies.action';
import { useVideoStore } from '@/store';
import React, { FC, useCallback, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

type Props = {
    moviesResult: Results
}

const MovieList:FC<Props> = ({moviesResult}) => {
    const movieResults = useVideoStore((state) => state.results);
    const setMovieResults = useVideoStore((state) => state.setMovieResults);
    const updateMovieResults = useVideoStore((state) => state.updateMovieResults);
    const isLoading = useVideoStore((state) => state.loading);
    const isLoadingMore = useVideoStore((state) => state.isLoadingMore);
    // const setIsLoading = useVideoStore((state) => state.updatedLoading);
    const setIsLoadingMore = useVideoStore((state) => state.updatedLoadingMore);
  
    const loadMoreMovies = useCallback(async () => {
      if (isLoadingMore) return;
      
      try {
        setIsLoadingMore(true);
        const result = 
           await getMovies({ cursor: movieResults.pageInfo.nextCursor, limit: 8 })
         
  
        updateMovieResults(result.movies, result.pageInfo);;
        setIsLoadingMore(false)
      } catch (error) {
        console.error('Error loading more movies:', error);
      } finally {
        setIsLoadingMore(false);
      }
    }, [isLoadingMore, setIsLoadingMore, movieResults.pageInfo.nextCursor, updateMovieResults]);

  
    useEffect(() => {
      setMovieResults(moviesResult)
    }, [moviesResult, setMovieResults])
    console.log('loading:', isLoading); 
    return (
      <InfiniteScroll
        dataLength={movieResults.movies.length}
        next={loadMoreMovies}
        hasMore={movieResults.pageInfo.hasNext && !isLoadingMore}
        loader={<PlaceHolders />}
        // endMessage={
        //   <p className="text-center text-gray-500 text-xl !my-8 font-bold italic">
        //     You&apos;ve reached the end of the list.
        //   </p>
        // }
        className="w-full !overflow-x-hidden"
      >
        {isLoading && movieResults.movies.length === 0 && <PlaceHolders />}
        {!isLoading && movieResults.movies.length > 0 && <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4' aria-label="Movie list">
          {movieResults.movies.map(({_id, ...movie}) => (
            <li key={_id}>
              <MovieCard {...movie}/>
            </li>
          ))}
        </ul>}
        {
          !isLoading && movieResults.movies.length === 0 && <div className="flex h-[300px] w-full mt-4 text-center justify-center items-center">
            <p className='text-gray-500 text-xl font-bold italic'>No movies found</p> 
          </div>
        }
      </InfiniteScroll>
    );
  };

  export default MovieList
