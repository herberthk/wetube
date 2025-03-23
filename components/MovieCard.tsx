'use client'
import { Card, CardFooter } from '@progress/kendo-react-layout'
import React, { FC, useState } from 'react'
import Image from 'next/image'
import fallback from '@/public/fallback.jpg'
import { useRouter } from 'next/navigation'

const MovieCard: FC<Partial<Movie>> = ({ Poster, Title, Language, Country }) => {
  const [error, setError] = useState(false)
  const router = useRouter()

  const handleClick = () => {
    if (Title) {
      router.push(`/movie/${encodeURIComponent(Title)}`)
    }
  }

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleClick();
    }
  }

  return (
    <Card 
      role="article"
      tabIndex={0}
      onKeyPress={handleKeyPress}
      onClick={handleClick}
      className="transition-all duration-300 ease-in-out shadow-lg hover:scale-110 focus:scale-110 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 cursor-pointer w-full md:w-[275px] h-auto"
    >
      <div className="relative">
        <Image 
          className='h-[300px] md:h-[230px] w-full'
          src={error ? fallback : Poster!} 
          alt={`Movie poster for ${Title}`}
          width={275}
          height={230}
          role='img'
          aria-label='Movie poster'
          onError={() => setError(true)}
        />
        <div className="sr-only">Movie poster for {Title}</div>
      </div>
      <CardFooter className='flex flex-col gap-2'>
        <h2 className="font-bold text-lg">{Title}</h2>
        <div className="flex justify-between text-sm text-gray-600">
          <span>{Language}</span>
          <span>{Country}</span>
        </div>
      </CardFooter>
    </Card>
  )
}

export default MovieCard
