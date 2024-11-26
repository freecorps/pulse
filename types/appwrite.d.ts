import type { Models } from "appwrite";

export interface Posts extends Models.Document {
  title: string;
  imageURL: string;
  type: string;
  description: string;
  games?: Games;
  editors?: Editors;
  content?: string;
}

export interface Editors extends Models.Document {
  name: string;
  imageURL?: string;
  description?: string;
  posts?: Posts;
}

export interface Games extends Models.Document {
  name: string;
  imageURL: string;
  abbreviation?: string;
  posts?: Posts;
  IamgeURLUpper?: string;
}

export interface Comment extends Models.Document {
  content: string;
  postId: string;
  userId: string;
  user?: {
    name: string;
  };
}

export interface ForumPost extends Models.Document {
  title: string;
  description?: string;
  content: string;
  userId: string;
  comments?: Comment[];
  commentCount?: number;
}
