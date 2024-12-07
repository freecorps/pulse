import { databases } from "@/app/appwrite";
import { Query } from "appwrite";
import { Perfil } from "@/typesForum/appwrite";

export async function getUserProfile(userId: string): Promise<Perfil | null> {
  try {
    const response = await databases.listDocuments("forum", "perfil", [
      Query.equal("userId", userId),
    ]);

    if (response.total === 0) {
      return null;
    }

    return response.documents[0] as Perfil;
  } catch (error) {
    console.error("Erro ao buscar perfil:", error);
    return null;
  }
}
