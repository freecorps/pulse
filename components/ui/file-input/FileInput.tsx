import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileIcon } from "lucide-react";
import { useAuthStore } from "@/app/stores/AuthStore";
import { teams } from "@/app/appwrite";
import { Query } from "appwrite";
import { FileModal } from "./FileModal";

interface FileInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  bucketId?: string;
}

export function FileInput({
  value,
  onChange,
  placeholder,
  bucketId = "userFiles",
}: FileInputProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditor, setIsEditor] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    async function checkEditorPermission() {
      if (!user) return;

      try {
        const membershipList = await teams.listMemberships("editor", [
          Query.equal("userId", user.$id),
        ]);
        setIsEditor(membershipList.total > 0);
      } catch (error) {
        console.error("Erro ao verificar permissões:", error);
        setIsEditor(false);
      }
    }

    checkEditorPermission();
  }, [user]);

  if (!isEditor) {
    return (
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    );
  }

  return (
    <div className="relative flex w-full">
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pr-10"
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-0 top-0 h-full"
        onClick={() => setIsModalOpen(true)}
      >
        <FileIcon className="h-4 w-4" />
      </Button>
      <FileModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSelect={onChange}
        bucketId={bucketId}
      />
    </div>
  );
}
