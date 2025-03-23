'use client'
import React, { FC, useState } from 'react'
import fallback from '@/public/fallback.jpg'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const Recommendation:FC<Movie> =({_id,Poster,Title,Released,Genre,Director})=> {
    const [error, setError] = useState(false)
      const router = useRouter()
    
      const handleClick = () => {
        if (Title) {
          router.push(`/movie/${encodeURIComponent(Title)}`)
        }
      }
  return (
    <div key={_id} 
    className="flex gap-4 shadow-lg cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-colors recommendation" onClick={handleClick}
    >
                    
         <div className="w-40 h-24 flex-shrink-0 relative rounded-lg overflow-hidden">
            {
                !error ? (
                    <Image
                        fill 
                        src={Poster} 
                        alt={Title}
                        onError={() => setError(true)}
                        className="absolute top-0 left-0 w-full h-full object-cover"
                    />
                ) : (
                    <Image
                        fill 
                        src={fallback} 
                        alt={Title}
                        className="absolute top-0 left-0 w-full h-full object-cover"
                    />
                )
            }
                     
            </div>
    
                    {/* Movie Info */}
                    <div className="flex-grow min-w-0">
                      <h3 className="font-medium text-sm mb-1 truncate">{Title}</h3>
                      <div className="text-xs text-gray-600 space-y-1">
                        <p>{Released}</p>
                        <p className="truncate">{Genre}</p>
                        <p className="truncate">{Director}</p>
                      </div>
                    </div>
    </div>
  )
}

export default Recommendation