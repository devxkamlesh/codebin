import { Timestamp } from 'firebase/firestore';

export interface Snippet {
  id: string;
  title: string;
  description: string;
  code: string;
  language: string;
  category: string;
  tags: string[];
  isPublic: boolean;
  authorId: string;
  authorName: string;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
  viewCount: number;
  likeCount: number;
  forkCount: number;
} 