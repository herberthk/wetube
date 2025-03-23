import { Skeleton } from '@progress/kendo-react-indicators'
import React from 'react'

const CommentsPlaceholder =()=> {
  return (
    <div className='flex flex-col gap-4 !mt-4 shadow-md !p-3'>
            {
              [...Array(5)].map((_, i) => ( 
                <div key={i} className='flex flex-row gap-2'>
                    <Skeleton shape='circle' style={{ width: 50, height: 50 }} />
                    <Skeleton shape='rectangle' style={{ width: '100%', height: 25 }} />
                </div>
              ))
            }
    </div>
  )
}

export default CommentsPlaceholder