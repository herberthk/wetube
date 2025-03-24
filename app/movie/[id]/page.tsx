import CommentsPlaceholder from "@/components/CommentsPlaceholder"
import MovieComments from "@/components/MovieComments"
import Recommendation from "@/components/Recommenation"
import RecommendationPlaceHolder from "@/components/RecommendationPlaceHolder"
import SingleMovieCard from "@/components/SingleMovie"
import { getRecommendedMovies } from "@/lib/actions/getMovies.action"
import { Metadata } from "next"
import { Suspense } from "react"

interface Props {
  params: {
    id: string
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { id } = await params
    const title = decodeURIComponent(id)
    const movie = await getRecommendedMovies(title)
    
    if (!movie) {
      return {
        title: 'Movie Not Found',
      }
    }

    return {
      title: `${movie[0].Title} | Your Movie App`,
      description: movie[0].Plot,
      openGraph: {
        title: movie[0].Title,
        description: movie[0].Plot,
        images: [movie[0].Poster],
      },
    }
  } catch (err) {
    console.error('Error generating metadata:', err)
    return {
      title: 'Movie Not Found',
    }
  }
}

const MovieWithRecommendations = async ({ params }: Props) => {
  const { id } = await params
  const title = decodeURIComponent(id)
  const starTimer = performance.now()
  const movie = await getRecommendedMovies(title)
  const endTimer = performance.now()
  console.log(`Time taken to get movie: ${(endTimer - starTimer)/1000}s`)

  if (!movie || movie.length === 0) {
    return (
      <main className="container" aria-label="Movie not found">
        <h1 className="text-2xl font-bold">Movie not found</h1>
      </main>
    )
  }

  const [mainMovie, ...recommendedMovies] = movie

  return (
      <div className="flex flex-col md:flex-row gap-8">
        {/* Main Content - Left Side (2/3 on desktop) */}
         <div className="lg:w-2/3">
              
            <SingleMovieCard {...mainMovie}/>
            <div className="hidden md:block">
              <Suspense fallback={<CommentsPlaceholder/>}>
                <MovieComments id={mainMovie._id} Plot={mainMovie.Plot} Title={mainMovie.Title}/>
              </Suspense>
            </div>
          </div>
       

        {/* Recommendations - Right Side (1/3 on desktop) */}
        <div className="w-full md:w-1/3">
          <h2 className="text-xl font-semibold !mb-6" aria-label="Recommended Movies">Recommended Movies</h2>
          <div className="flex w-full flex-col gap-4">
            {recommendedMovies.map((rec) => (
              <Recommendation key={rec._id} {...rec} />
            ))}
          </div>
        </div>
      </div>
  )
}

export default async function Page({ params }: Props) {
 return(
  <main className="container mx-auto px-4 py-8 !mt-3" aria-label="Movie page">
  <Suspense fallback={<RecommendationPlaceHolder/>}>
    <MovieWithRecommendations params={params}/>
  </Suspense>
  </main>
 )
}
