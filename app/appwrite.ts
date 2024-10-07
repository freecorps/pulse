import { Client, Account } from "appwrite";

export const client = new Client();

client.setEndpoint("https://appwrite.freecorps.xyz/v1").setProject("pulse");

export const account = new Account(client);
export { ID } from "appwrite";
