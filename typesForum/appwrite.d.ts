import type { Models } from "appwrite";

export interface Posts extends Models.Document {
  title: string;
  content: string;
  description?: string;
  userId?: string;
  comments?: Comments[];
  perfil?: Perfil[];
}

export interface Comments extends Models.Document {
  content: string;
  userId: string;
  posts?: Posts[];
  perfil?: Perfil[];
}

export interface Perfil extends Models.Document {
  handler: string;
  imgURL: string;
  userId: string;
  posts?: Posts[];
  comments?: Comments[];
}
