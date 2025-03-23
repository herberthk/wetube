import React, { FC } from 'react'
import { Skeleton } from '@progress/kendo-react-indicators';
import { Card, CardFooter } from '@progress/kendo-react-layout';

type Props = {
  showFilters?: boolean;
}

const PlaceHolders:FC<Props> = ({showFilters = false}) => {
  return (
    <div className='flex flex-col gap-4'>
        {showFilters && <div className='flex flex-row gap-4 flex-wrap'>
          {
            [...Array(8)].map((_, i) => ( 
              <Skeleton key={i} shape='rectangle' style={{ width: 70, height: 40 }} />
            ))
          }
        </div> }
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4' role="status" aria-label="Loading content">
            {
                [...Array(8)].map((_, i) => ( 
                <Card 
                key={i} 
                className="w-full md:w-[275px] h-auto"
                // style={{ width: 280, height: 'auto' }} 
                aria-hidden="true">
                    <Skeleton shape='rectangle' style={{ width: '100%', height: 230 }} />
                    <CardFooter>
                        <Skeleton shape='text' style={{ width: '100%' }} />
                        <Skeleton shape='text' style={{ width: '40%' }} />
                    </CardFooter>
                </Card> 
                ))
            }
        </div>
    </div>
  )
}

export default PlaceHolders