import MovieCard from "@/components/MovieCard"
import PlaceHolders from "@/components/PlaceHolder"
import { searchMovies } from "@/lib/actions/getMovies.action"
import { Suspense } from "react"

interface Props {
    params: {
      query: string
    }
  }

const Parent = async({params }: Props)=> {
    const { query } = await params
    const searchTerm = decodeURIComponent(query)
    const results = await searchMovies({ searchTerm });
    if (!results || results.movies.length === 0) {
      return (
        <main className="container mx-auto px-4 py-8 !mt-3 shadow-md text-center justify-center min-h-24" aria-label="Movie not found">
          <h1 className="text-2xl font-bold">Movie not found</h1>
        </main>
      )
    }
    return (
        <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4' aria-label="Movie list">
            {results.movies.map(({_id, ...movie}) => (
            <li key={_id}>
                <MovieCard {...movie}/>
            </li>
            ))}
        </ul>
    )
}
const Page = async ({params }: Props)=> {
   
 return(
  <main className="container mx-auto px-4 py-8 !mt-3" aria-label="Movie page">
    <Suspense fallback={<PlaceHolders />}>
         <Parent params={params} />
      </Suspense>
  </main>
 )
}

export default Page  
