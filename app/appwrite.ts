import { Client, Account, Storage, Databases, Avatars, Teams } from "appwrite";

export const client = new Client();
export const teams = new Teams(client);

client.setEndpoint("https://appwrite.freecorps.xyz/v1").setProject("pulse");

export const storage = new Storage(client);
export const databases = new Databases(client);
export const account = new Account(client);
export const avatars = new Avatars(client);
export { ID } from "appwrite";
