'use client'
import React, { FC, useState } from 'react'
import Image from 'next/image'
import fallback from '@/public/fallback.jpg'
const SingleMovieCard:FC<Movie> =({Poster,Title,Released,Genre,Director,Actors,Plot,Language,Awards})=> {
  const [showMore, setShowMore] = useState(false)
 
  const [error, setError] = useState(false)
 
  return (
     <>
        <div className="relative pt-[56.25%] rounded-xl overflow-hidden">
            {
                !error ? (
                    <Image
                        width={400}
                        height={500} 
                        src={Poster} 
                        alt={Title}
                        className="w-full h-[500px]"
                        onError={() => setError(true)}
                        aria-label={`Movie poster for ${Title}`}
                    />
                ) : (
                    <Image
                        width={400}
                        height={500} 
                        src={fallback} 
                        alt={Title}
                        className="w-full h-[500px]"
                        aria-label={`Movie poster for ${Title}`}
                    />
                )
            }
        </div>

    {/* Movie Info */}
    <div className="!mt-6 shadow-md !p-3">
        <h1 aria-label={Title} className="text-2xl font-bold mb-2">{Title}</h1>
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <span>{Released}</span>
          <span>•</span>
          <span>•</span>
          <span>{Genre}</span>
        </div>
        
        <p className="text-gray-800">
          {
            showMore ? Plot : Plot.slice(0, 200)+"..."
          }
          </p>
          {/* Additional Details */}
        {showMore && <div className="mt-6 space-y-2">
          <p><span className="font-semibold">Director:</span> {Director}</p>
          <p><span className="font-semibold">Cast:</span> {Actors}</p>
          <p><span className="font-semibold">Language:</span> {Language}</p>
          {Awards && (
            <p><span className="font-semibold">Awards:</span> {Awards}</p>
          )}
        </div>}
        <p className="text-blue-500 cursor-pointer" onClick={() => setShowMore(!showMore)}>
              {showMore ? "Read less" : "Read more"}
        </p>
    </div>
      
  </>
  )
}

export default SingleMovieCard