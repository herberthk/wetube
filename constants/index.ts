
import { PromptTemplate } from "@langchain/core/prompts";

export const API_KEY = process.env.GEMINI_API_KEY; // Store in environment variable
export const MOVIE_COLLECTION_NAME = 'recommendation';
export const MOVIE_COMMENTS_COLLECTION = 'comments';

type FilterButton = {
  id: number;
  title: Filters;
};

export const filterButtons: FilterButton[] = [
  {
    id: 1,
    title: 'All',
  },
  {
    id: 2,
    title: 'Action',
  },
  {
    id: 3,
    title: 'Comedy',
  },
  {
    id: 4,
    title: 'Drama',
  },
  {
    id: 5,
    title: 'Horror',
  },
  {
    id: 6,
    title: 'Romance',
  },
  {
    id: 7,
    title: 'Sci-Fi',
  },
  {
    id: 8,
    title: 'Thriller',
  },
];

export const comments:string[] = [
  'Amélie is a whimsical masterpiece that captures the magic of Paris!',
  'The film is a heartwarming tale of love and redemption.',
  'The cinematography in Amélie is absolutely stunning.',
  'This film never fails to put a smile on my face, no matter how many times I watch it.',
  'Amelia\'s journey of self-discovery is both heartwarming and inspiring.',
  'I love how this movie celebrates the small joys in life.',
  'The soundtrack by Yann Tiersen perfectly complements the dreamy atmosphere.',
  'Audrey Tautou\'s performance as Amélie is simply enchanting.',
  'The vibrant colors and quirky characters make this film an absolute delight.',
  'The film\'s exploration of love and relationships is both touching and thought-provoking.',
  'The attention to detail in every scene is remarkable.',
  'Poor graphics I disliked it, it is mot worth my money',
  'It is not favorable for my children',
] 

export const summaryPrompt = new PromptTemplate({
  template: `
You are an assistant analyzing user feedback for a movie.

This is the movie description:
{movie_description}

Here are user comments:
{comments}

Tasks:
1. Summarize common themes in bullet points.
2. Point out what people liked and disliked.
3. Suggest improvements for future productions.
4. Give an overall sentiment score (0-100).

Respond in this format:
- Themes:
- Likes:
- Dislikes:
- Suggestions:
- Sentiment Score:
`,
  inputVariables: ["comments", "movie_description"],
});
