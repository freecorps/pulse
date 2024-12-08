import { Client, Storage } from "node-appwrite";

const client = new Client()
  .setEndpoint("https://appwrite.freecorps.xyz/v1")
  .setProject("pulse")
  .setKey(process.env.APPWRITE_API_KEY as string); // Chave API secreta do servidor

export const storage = new Storage(client);
