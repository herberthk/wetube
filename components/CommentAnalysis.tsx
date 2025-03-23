import { Dialog } from '@progress/kendo-react-dialogs'
import React, { FC } from 'react'

type Props ={
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    commentsSummary: InsightsArray;
    Title: string;
}

// Function to determine sentiment color
const getSentimentColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-green-300';
    if (score >= 40) return 'bg-yellow-300';
    if (score >= 20) return 'bg-orange-400';
    return 'bg-red-500';
  };

const removeLeadingUnderscore = (str: string) => {
    return str.replace(/^-+/, '');
  };

const CommentAnalysis:FC<Props> =({setShowModal, commentsSummary, Title})=> {
    const sentimentScore = commentsSummary.find((item) => item.title === "Sentiment Score")?.items[0];
    console.log('sentmentScore', sentimentScore);
  return (
            <Dialog className='max-h-[95vh] overflow-y-auto' title={Title} onClose={() => setShowModal(false)}>
                <div className="p-4 max-w-2xl mx-auto max-h-[95vh] overflow-y-auto">
                        {(sentimentScore && sentimentScore?.length < 4)?
                            <div className="mb-6 flex items-center gap-2">
                            <h1 className="text-2xl font-bold mr-4">Comment Analysis</h1>
                            <div className="flex items-center gap-2">
                                <div className={`${getSentimentColor(+sentimentScore!)} w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xl`}>
                                    {sentimentScore}
                                </div>
                                <span className="ml-2 text-gray-600">Sentiment Score</span>
                            </div>
                        </div>:<h2 className="text-base font-semibold !mb-3 !text-gray-800">{sentimentScore?.replace(/^50+/, '')}</h2>}
                            {
                                commentsSummary.filter((item) => item.title !== "Sentiment Score").map((item, index) => (
                                    <div key={index} className='mb-6 shadow !py-3 !pl-2 rounded'>
                                        <h2 className="text-base font-semibold !mb-3 !text-gray-800">{removeLeadingUnderscore(item.title)}</h2>
                                        <ul className="!list-decimal pl-5 text-gray-700 flex flex-col gap-2">
                                            {item.items.map((subItem, subIndex) => (
                                                <li className='flex text-gray-800' key={subIndex}>{subItem}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ))
                            }
                </div>
            </Dialog>
      
  )
}

export default CommentAnalysis