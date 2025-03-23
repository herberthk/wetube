'use client'
import React, { useState } from 'react'
import { TextArea } from '@progress/kendo-react-inputs'
import { Button } from '@progress/kendo-react-buttons'
import { processComments,addComment } from '@/lib/actions/getMovies.action'
import { parseLLMInsightsResponse } from '@/lib/utils'
import CommentAnalysis from './CommentAnalysis'
import { Notification, NotificationGroup } from '@progress/kendo-react-notification';
import { Fade } from '@progress/kendo-react-animation';

type Props = {
    Title: string;
    Plot: string;
    _id: string;
    comments: {
        content: string;
        id: string;
    }[];
}

interface State {
    type: "none" | "success" | "error" | "warning" | "info";
    message: string;
    show: boolean;
}

const CommentActions:React.FC<Props> =({Title,Plot,_id,comments})=> {
    const [state, setState] = useState<State>({ type: 'none', message: '', show: false });
    const [content, setContent] = useState('')
     const [loadingSummary, setLoadingSummary] = useState(false)
    const [showModal, setShowModal] = useState<boolean>(false);
    const [commentsSummary, setCommentsSummary] = useState<InsightsArray>([])
    const [loading, setLoading] = useState(false)
      
        const summarizeComments = async () => {
          setLoadingSummary(true)
          try {
            const result = await processComments({desc: Plot,id:_id})
            console.log(result)
            setLoadingSummary(false)
            const rawResult = result?.toString()
            const parsedResult = parseLLMInsightsResponse(rawResult)
            setCommentsSummary(parsedResult)
            setShowModal(true)
            console.log(_id)
          } catch (error) {
            setLoadingSummary(false)
            console.log('Could not process comments', error);
          }
        } 

        const handleSubmit = async () => {
            if (!content) {
                setState({ type: 'error', message: 'Please enter a comment', show: true });
                setTimeout(() => {
                  setState({ ...state, show: false });
                }, 3000);
               return 
            }
            setLoading(true)
          try {
            const result = await addComment({id:_id,content,title:Title})
            console.log(result)
            setState({ type: 'success', message: 'Comment added successfully', show: true });
            setTimeout(() => {
              setState({ ...state, show: false });
            }, 3000);
            setContent('')
            setLoading(false)
          } catch (error) {
            setLoading(false)
            console.log('Could not process comments', error);
          }
        }
  return (
    <>
     <NotificationGroup
        style={{
          right: 4,
          bottom: 20,
          alignItems: 'flex-start',
          flexWrap: 'wrap-reverse'
        }}
      >
        <Fade>
            { state.show && (
                 <Notification closable={true} onClose={() => setState({ ...state,show:false })} 
                 type={{ style: state.type, icon: true }}  className="custom-notification">
             
                 <span className="notification-text">{state.message}</span>
             </Notification>
             )
            }
           
        </Fade>
      </NotificationGroup>
   
    
    {showModal && (<CommentAnalysis setShowModal={setShowModal} commentsSummary={commentsSummary} Title={Title}/>)}
      <div className='w-full !p-3'>
        <h2 className='text-base font-bold !px-3'>
          {comments.length} Comment{comments.length !== 1 ? 's' : ''}
        </h2>
        {comments.length > 0 && (
          <Button 
            title='Summarize comments with AI' 
            className="uppercase !my-4 !rounded-full" 
            themeColor='primary' 
            onClick={!loadingSummary ? summarizeComments : undefined}
            disabled={loadingSummary}
            aria-busy={loadingSummary}
          >
            {!loadingSummary ? "Summarize comments with AI" : "Summarizing please wait..."}
            {loadingSummary && (
              <span 
                className="k-icon k-i-loading k-i-loading-lg !ml-2 !text-white"
                aria-hidden="true"
              />
            )}
          </Button>
        )}
        <div className="flex flex-col !gap-3">
          <TextArea
            id="comment-input"
            name="comment"
            value={content}
            onChange={(e) => setContent(e.value)}
            placeholder="Add a comment..."
            aria-label="Add your comment"
            required
          />
          <Button
            type="submit"
            themeColor="primary"
            aria-label='Post Comment'
            disabled={loading}
            aria-busy={loading}
            onClick={!loading ? handleSubmit : ()=>{}}
          >
            {loading ? 'Posting please wait...' : 'Post Comment'}
          </Button>
        </div>
      </div>
    </>
  )
}

export default CommentActions
