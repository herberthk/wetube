import { create } from "zustand";
import { devtools } from "zustand/middleware";

type State = {
  results: Results;
  setMovieResults:(result: Results) => void;
  loading: boolean;
  isLoadingMore: boolean;
  updatedLoading:(isLoadingMore:boolean)=>void;
  updatedLoadingMore:(loading:boolean)=>void;
  updateMovieResults:(movies: Results['movies'], pageInfo: Results['pageInfo']) => void;
  currentFilter: Filters;
  updateCurrentFilter:(filter:Filters)=>void;
};

export const useVideoStore = create<State>()(
  devtools(
    
      (set) => ({
        // initial state
        results: {
            movies: [],
            pageInfo: {
                hasNext: false,
                nextCursor: null,
            },
        },
        loading: false,
        loadingMore: false,
        currentFilter: 'All',
      
        setMovieResults: (results: Results) => {
          set(() => ({
            results
          }));
        },
        updatedLoading: (loading:boolean) => {
          set(() => ({
            loading
          }));
        },
        updatedLoadingMore: (isLoadingMore:boolean) => {
          set(() => ({
            isLoadingMore
          }));
        },
        updateMovieResults(movies, pageInfo) {
            set((state) => ({
              results: {
                // Update movies and remove possible duplicates
                movies: [...state.results.movies, ...movies].filter((movie, index, self) =>
                    index === self.findIndex((t) => t._id === movie._id)
                  ),
                pageInfo,
              },
            }));
        },
        updateCurrentFilter(filter:Filters) {
          set(() => ({
            currentFilter: filter
          }));
        },
      }),
  ),
);
