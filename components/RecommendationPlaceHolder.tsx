import { Skeleton } from '@progress/kendo-react-indicators'
import React from 'react'

const RecommendationPlaceHolder =()=> {
  return (
    <div className="container mx-auto px-4 py-8">
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Main Content - Left Side (2/3 on desktop) */}
      <div className="w-full md:w-2/3">
        {/* Movie Poster */}
        <div className="relative pt-[56.25%] rounded-xl overflow-hidden">
          <Skeleton shape='rectangle' style={{ width: '100%', height: 500 }} />
        </div>

        {/* Movie Info */}
        <div className="!mt-6">
          <Skeleton shape='rectangle' style={{ width: '100%', height: 25, marginBottom: 10 }} />
          <Skeleton shape='rectangle' style={{ width: '100%', height: 20, marginBottom: 5 }} />
          <Skeleton shape='rectangle' style={{ width: '100%', height: 20, marginBottom: 5 }} />
          </div>
      </div>

      {/* Recommendations - Right Side (1/3 on desktop) */}
      <div className="w-full md:w-1/3">
        <Skeleton shape='rectangle' style={{ width: 200, height: 25, marginBottom: 10 }} />
        <div className="flex flex-col gap-4">
          {
            [...Array(5)].map((_, i) => ( 
                <Skeleton key={i} shape='rectangle' style={{ width: 200, height: 100 }} />
            ))
          }
          
        </div>
      </div>
    </div>
  </div>
  )
}

export default RecommendationPlaceHolder