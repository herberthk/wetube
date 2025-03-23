import { getComments } from '@/lib/actions/getMovies.action'
import React, { FC } from 'react'
import CommentActions from './CommentActions'

type Props ={
    id:string
    Plot:string
    Title:string
}
const MovieComments: FC<Props> = async({ id, Plot, Title }) => {
  const comments = await getComments(id)
  
  return (
    <section role='article' aria-label="Movie comments section">
      <CommentActions Plot={Plot} Title={Title} _id={id} comments={comments}/>
      <div className='flex flex-col gap-4 !mt-4 shadow-md !p-3' role="list">
        {comments.length === 0 ? (
          <p className="text-gray-500">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((c) => (
            <div 
              key={c.id} 
              className='flex flex-row gap-2'
              role="listitem"
            >
              <div 
                className='w-10 h-10 rounded-full bg-gray-300'
                aria-hidden="true"
              />
              <div>
                <span className="sr-only">Comment:</span>
                <p className='text-gray-800 movie-comment'>{c.content}</p>
                <time 
                  className="text-sm text-gray-500"
                  dateTime={c.createdAt.toISOString()}
                >
                  {new Date(c.createdAt).toLocaleDateString()}
                </time>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}

export default MovieComments
