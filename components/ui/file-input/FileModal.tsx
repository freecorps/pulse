import { useState, useEffect } from "react";
import { storage, ID } from "@/app/appwrite";
import { Permission, Role } from "appwrite";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Image from "next/image";
import { FileUp, Trash2, Clock, FileIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface FileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (url: string) => void;
}

interface FileItem {
  $id: string;
  name: string;
  url: string;
  mimeType: string;
  sizeOriginal: number;
  $createdAt: string;
}

export function FileModal({ open, onOpenChange, onSelect }: FileModalProps) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("browse");
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    if (open) {
      loadFiles();
    }
  }, [open]);

  const loadFiles = async () => {
    try {
      const fileList = await storage.listFiles("userFiles");
      const filesWithUrls = fileList.files.map((file) => ({
        $id: file.$id,
        name: file.name,
        url: storage.getFileView("userFiles", file.$id),
        mimeType: file.mimeType,
        sizeOriginal: file.sizeOriginal,
        $createdAt: file.$createdAt,
      }));
      setFiles(filesWithUrls);
    } catch (error) {
      console.error("Erro ao carregar arquivos:", error);
      toast.error("Erro ao carregar arquivos");
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith("image/") && file.type !== "image/gif") {
      toast.error("Apenas imagens e GIFs são permitidos");
      return;
    }

    setIsUploading(true);
    const fileId = ID.unique();

    toast.promise(
      storage
        .createFile("userFiles", fileId, file, [
          Permission.read(Role.any()),
          Permission.write(Role.team("editor")),
          Permission.update(Role.team("editor")),
          Permission.delete(Role.team("editor")),
        ])
        .then(() => loadFiles()),
      {
        loading: "Enviando arquivo...",
        success: "Arquivo enviado com sucesso!",
        error: "Erro ao enviar arquivo",
      }
    );

    setIsUploading(false);
    setActiveTab("browse");
  };

  const handleDelete = async (fileId: string) => {
    toast.promise(
      storage.deleteFile("userFiles", fileId).then(() => {
        setFiles(files.filter((file) => file.$id !== fileId));
      }),
      {
        loading: "Excluindo arquivo...",
        success: "Arquivo excluído com sucesso!",
        error: "Erro ao excluir arquivo",
      }
    );
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ["Bytes", "KB", "MB", "GB"];
    if (bytes === 0) return "0 Byte";
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString());
    return Math.round(bytes / Math.pow(1024, i)) + " " + sizes[i];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gerenciador de Arquivos</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="browse">Biblioteca</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="min-h-[400px]">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
              {files.map((file) => (
                <div
                  key={file.$id}
                  className="group relative bg-card rounded-lg overflow-hidden border border-border hover:border-primary transition-colors"
                >
                  <div className="aspect-square relative">
                    <Image
                      src={file.url}
                      alt={file.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center gap-2 p-4">
                      <Button
                        onClick={() => {
                          onSelect(file.url);
                          onOpenChange(false);
                        }}
                      >
                        Selecionar
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(file.$id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-3 space-y-1">
                    <p className="font-medium truncate" title={file.name}>
                      {file.name}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <FileIcon className="h-3 w-3" />
                        {formatFileSize(file.sizeOriginal)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(file.$createdAt), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {files.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <FileIcon className="h-12 w-12 mb-4" />
                  <p>Nenhum arquivo encontrado</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="upload" className="min-h-[400px]">
            <div
              className={`h-64 relative rounded-lg border-2 border-dashed transition-colors ${
                dragActive
                  ? "border-primary bg-primary/10"
                  : "border-muted-foreground/25"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept="image/*,.gif"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isUploading}
              />
              <div className="h-full flex flex-col items-center justify-center gap-4 p-4">
                <FileUp className="h-10 w-10 text-muted-foreground" />
                <div className="text-center">
                  <p className="text-lg font-medium">
                    Arraste e solte sua imagem aqui
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ou clique para selecionar
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  Suporta imagens e GIFs até 10MB
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
