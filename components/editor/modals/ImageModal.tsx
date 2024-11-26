import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Editor } from "@tiptap/react";

interface ImageModalProps {
  editor: Editor;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImageModal({ editor, open, onOpenChange }: ImageModalProps) {
  const [url, setUrl] = useState("");

  const addImage = () => {
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
      setUrl("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Imagem</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Input
              id="url"
              placeholder="Cole o link da imagem aqui..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addImage();
                }
              }}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={addImage}>Adicionar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
