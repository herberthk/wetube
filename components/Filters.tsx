'use client'
import { filterButtons } from '@/constants'
import { getMovies, searchMovies } from '@/lib/actions/getMovies.action';
import { useVideoStore } from '@/store';
import { Button } from '@progress/kendo-react-buttons'
import React from 'react'

const Filters = () => {
 
  const activeFilter = useVideoStore((state) => state.currentFilter);
  const updatedFilter = useVideoStore((state) => state.updateCurrentFilter);
  const setIsLoading = useVideoStore((state) => state.updatedLoading);
  const setMovieResults = useVideoStore((state) => state.setMovieResults);
  const handleButtonClick = async(title: Filters) => {
    updatedFilter(title);
    try {
        setIsLoading(true)
        setMovieResults({ movies: [], pageInfo: { hasNext: false, nextCursor: null } });
         const result = title === 'All' 
                ? await getMovies({})
                : await searchMovies({ searchTerm: title });
        
        setMovieResults(title==='All' ? result : {
            movies: result.movies,
            pageInfo: {
                hasNext: false,
                nextCursor: null
            }
        });
        setIsLoading(false)
        
    } catch (error) {
        setIsLoading(false)
        console.error('Error loading more movies:', error);
    }
   
  }
  
  return (
    <div className='w-full px-4 py-2 flex flex-row gap-2 flex-wrap !mb-4 !mt-2'>
      {filterButtons.map((button) => (
        <Button 
          type="button" 
          rounded='large' 
          themeColor={activeFilter === button.title ? 'primary' : 'base'} 
          key={button.id}
          onClick={() => handleButtonClick(button.title)}
        >
          {button.title}
        </Button>
      ))}
    </div>
  )
}

export default Filters
