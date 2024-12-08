"use client";
import React, { useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileInput } from "@/components/ui/file-input/FileInput";
import { Models } from "appwrite";

interface ProfilePictureUploadProps {
  profilePicture?: string;
  userId: string;
  onUpdateProfilePicture: (fileUrl: string, fileId: string) => Promise<void>;
  userPrefs?: Models.Preferences;
}

export default function ProfilePictureUpload({
  profilePicture,
  onUpdateProfilePicture,
  userPrefs,
}: ProfilePictureUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleImageSelect = async (fileUrl: string) => {
    try {
      setIsUploading(true);
      // Extrai o fileId da URL
      const fileId = fileUrl.split("/").pop() || "";
      await onUpdateProfilePicture(fileUrl, fileId);
      toast.success("Foto de perfil atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar foto de perfil:", error);
      toast.error("Erro ao atualizar foto de perfil");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className="w-32 h-32">
        <AvatarImage src={profilePicture} alt="Foto de perfil" />
        <AvatarFallback>
          {userPrefs?.name?.[0]?.toUpperCase() || "U"}
        </AvatarFallback>
      </Avatar>

      <div className="w-full max-w-sm">
        <FileInput
          value={profilePicture || ""}
          onChange={handleImageSelect}
          placeholder="Selecione ou cole o link da sua foto de perfil"
        />
      </div>

      {isUploading && (
        <div className="text-sm text-muted-foreground">
          Atualizando foto de perfil...
        </div>
      )}
    </div>
  );
}
