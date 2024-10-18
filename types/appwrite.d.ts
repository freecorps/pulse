import type { Models } from "appwrite";

export interface Posts extends Models.Document {
    title: string;
    imageURL: string;
    type: string;
    description: string;
    editor?: Editor;
    games?: Games;
};

export interface Editor extends Models.Document {
    name: string;
    imageURL?: string;
    description?: string;
};

export interface Games extends Models.Document {
    name: string;
    imageURL: string;
};
