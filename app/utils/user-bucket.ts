export async function checkUserBucket(userId: string) {
  try {
    // Verifica se o bucket existe
    const response = await fetch(`/api/user-bucket?userId=${userId}`);
    const data = await response.json();

    if (!data.exists) {
      // Se não existir, cria o bucket
      const createResponse = await fetch("/api/user-bucket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const createData = await createResponse.json();
      return createData.bucketId;
    }

    return data.bucketId;
  } catch (error) {
    console.error("Erro ao verificar/criar bucket do usuário:", error);
    throw error;
  }
}

export function getUserBucketId(userId: string) {
  return `user_${userId}_files`;
}
