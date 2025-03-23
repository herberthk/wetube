import Filters from '@/components/Filters';
import MovieList from '@/components/MoviewList';
import PlaceHolders from '@/components/PlaceHolder';
import { getMovies } from '@/lib/actions/getMovies.action';
import { Suspense } from 'react';

const Parent = async()=> {
  const result =  await getMovies({})
  return (
    <MovieList moviesResult={result} />
  )
}

const Home = () => {
  return (
    <main className="min-h-screen container">
      <Filters />
      <h1 className="sr-only">Movie Catalog</h1>
      <Suspense fallback={<PlaceHolders />}>
         <Parent />
      </Suspense>
    </main>
  );
};

export default Home;
