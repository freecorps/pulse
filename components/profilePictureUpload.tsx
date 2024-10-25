"use client";
import React, { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CircleUserRound } from "lucide-react";
import { storage } from "@/app/appwrite";
import { ID } from "appwrite";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader } from "./ui/card";

interface ProfilePictureUploadProps {
  profilePicture?: string;
  userId?: string;
  onUpdateProfilePicture: (fileUrl: string, fileId: string) => Promise<void>;
  userPrefs?: {
    profilePictureId?: string;
  };
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
  profilePicture,
  userId,
  onUpdateProfilePicture,
  userPrefs,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    profilePicture || null
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [tempPreviewUrl, setTempPreviewUrl] = useState<string | null>(null);

  const handleButtonClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const uploadProfilePicture = async (file: File) => {
    if (!userId) return;

    toast.promise(
      (async () => {
        const newFileId = ID.unique();
        await storage.createFile("profilePicture", newFileId, file);
        const fileUrl = storage.getFileView("profilePicture", newFileId);

        if (userPrefs?.profilePictureId) {
          try {
            await storage.deleteFile(
              "profilePicture",
              userPrefs.profilePictureId
            );
          } catch (error) {
            console.error("Erro ao deletar a foto de perfil antiga:", error);
          }
        }

        await onUpdateProfilePicture(fileUrl, newFileId);
        setPreviewUrl(fileUrl);
        return fileUrl;
      })(),
      {
        loading: "Enviando foto de perfil...",
        success: "Foto de perfil atualizada com sucesso!",
        error:
          "Falha ao atualizar a foto de perfil. Por favor, tente novamente.",
      }
    );
  };

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        setFileName(file.name);
        const localPreviewUrl = URL.createObjectURL(file);
        setTempPreviewUrl(localPreviewUrl);
        setSelectedFile(file);
        setShowConfirmDialog(true);
      }
    },
    []
  );

  const handleConfirmUpload = useCallback(() => {
    if (selectedFile) {
      uploadProfilePicture(selectedFile);
      setShowConfirmDialog(false);
      if (tempPreviewUrl) {
        URL.revokeObjectURL(tempPreviewUrl);
      }
    }
  }, [selectedFile, tempPreviewUrl]);

  const handleCancelUpload = useCallback(() => {
    setShowConfirmDialog(false);
    setFileName(null);
    setSelectedFile(null);
    if (tempPreviewUrl) {
      URL.revokeObjectURL(tempPreviewUrl);
      setTempPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [tempPreviewUrl]);

  const handleRemove = useCallback(async () => {
    if (userPrefs?.profilePictureId) {
      try {
        await storage.deleteFile("profilePicture", userPrefs.profilePictureId);
        await onUpdateProfilePicture("", "");
        setFileName(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } catch (error) {
        console.error("Erro ao remover a foto de perfil:", error);
        toast.error("Falha ao remover a foto de perfil.");
      }
    }
  }, [userPrefs?.profilePictureId, onUpdateProfilePicture]);

  return (
    <>
      <Card className="w-full flex flex-col items-center">
        <div>
          <CardHeader>
            <h3 className="text-lg font-medium">Foto de perfil</h3>
            <p className="text-sm text-muted-foreground">
              Adicione ou altere a foto de perfil da sua conta.
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <div className="text-sm font-medium text-muted-foreground">
                Foto de perfil
              </div>
              <div className="inline-flex items-center space-x-2 rtl:space-x-reverse">
                <div
                  className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-input"
                  role="img"
                  aria-label={
                    previewUrl
                      ? "Preview of uploaded image"
                      : "Default user avatar"
                  }
                >
                  {previewUrl ? (
                    <Image
                      className="h-full w-full object-cover"
                      src={previewUrl}
                      alt="Preview of uploaded image"
                      width={32}
                      height={32}
                    />
                  ) : (
                    <div aria-hidden="true">
                      <CircleUserRound
                        className="opacity-60"
                        size={16}
                        strokeWidth={2}
                      />
                    </div>
                  )}
                </div>
                <div className="relative inline-block">
                  <Button onClick={handleButtonClick} aria-haspopup="dialog">
                    {previewUrl ? "Alterar imagem" : "Upload imagem"}
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                    aria-label="Upload image file"
                  />
                </div>
              </div>
              {fileName && (
                <div className="mt-2 inline-flex gap-2 text-xs">
                  <p
                    className="truncate text-muted-foreground"
                    aria-live="polite"
                  >
                    {fileName}
                  </p>{" "}
                  <button
                    onClick={handleRemove}
                    className="font-medium text-red-500 hover:underline"
                    aria-label={`Remove ${fileName}`}
                  >
                    Remover
                  </button>
                </div>
              )}
              <div className="sr-only" aria-live="polite" role="status">
                {previewUrl
                  ? "Imagem enviada e preview disponível"
                  : "Nenhuma imagem enviada"}
              </div>
            </div>
          </CardContent>
        </div>
      </Card>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar alteração de foto</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="mt-4 flex justify-between gap-4">
                <div className="text-center">
                  <p className="mb-2">Atual</p>
                  <div className="relative h-32 w-32 overflow-hidden rounded-lg border border-input">
                    {previewUrl ? (
                      <Image
                        src={previewUrl}
                        alt="Foto atual"
                        className="h-full w-full object-cover"
                        width={128}
                        height={128}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <CircleUserRound className="opacity-60" size={48} />
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-center">
                  <p className="mb-2">Nova</p>
                  <div className="relative h-32 w-32 overflow-hidden rounded-lg border border-input">
                    {tempPreviewUrl && (
                      <Image
                        src={tempPreviewUrl}
                        alt="Nova foto"
                        className="h-full w-full object-cover"
                        width={128}
                        height={128}
                      />
                    )}
                  </div>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelUpload}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmUpload}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ProfilePictureUpload;
