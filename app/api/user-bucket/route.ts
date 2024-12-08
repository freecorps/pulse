import { storage } from "@/app/appwrite-server";
import { NextResponse } from "next/server";
import { Permission, Role } from "node-appwrite";

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "ID do usuário não fornecido" },
        { status: 400 }
      );
    }

    const bucketId = `user_${userId}_files`;

    try {
      // Tenta obter o bucket para verificar se já existe
      await storage.getBucket(bucketId);

      return NextResponse.json({
        message: "Bucket já existe",
        bucketId,
        exists: true,
      });
    } catch {
      // Se o bucket não existir, cria um novo
      try {
        await storage.createBucket(
          bucketId,
          `User ${userId} Files`,
          [
            Permission.read(Role.any()),
            Permission.write(Role.user(userId)),
            Permission.create(Role.user(userId)),
            Permission.update(Role.user(userId)),
            Permission.delete(Role.user(userId)),
          ],
          true, // fileSecurity
          true, // enabled
          10485760, // maximumFileSize (10MB em bytes)
          ["jpg", "jpeg", "png", "gif", "webp"], // allowedFileExtensions
          "gzip", // compression
          true, // encryption
          true // antivirus
        );
      } catch (error) {
        console.error("Erro ao criar bucket:", error);
        return NextResponse.json(
          { error: "Erro ao criar bucket do usuário" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        message: "Bucket criado com sucesso",
        bucketId,
        exists: false,
      });
    }
  } catch (error) {
    console.error("Erro ao gerenciar bucket:", error);
    return NextResponse.json(
      { error: "Erro ao gerenciar bucket do usuário" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "ID do usuário não fornecido" },
        { status: 400 }
      );
    }

    const bucketId = `user_${userId}_files`;

    try {
      const bucket = await storage.getBucket(bucketId);
      return NextResponse.json({
        exists: true,
        bucketId,
        bucket,
      });
    } catch {
      return NextResponse.json({
        exists: false,
        bucketId,
      });
    }
  } catch (error) {
    console.error("Erro ao verificar bucket:", error);
    return NextResponse.json(
      { error: "Erro ao verificar bucket do usuário" },
      { status: 500 }
    );
  }
}
