import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileIcon } from "lucide-react";
import { useAuthStore } from "@/app/stores/AuthStore";
import { checkUserBucket } from "@/app/utils/user-bucket";
import { FileModal } from "./FileModal";

interface FileInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function FileInput({ value, onChange, placeholder }: FileInputProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bucketId, setBucketId] = useState<string | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    async function initializeBucket() {
      if (user) {
        try {
          const userBucketId = await checkUserBucket(user.$id);
          setBucketId(userBucketId);
        } catch (error) {
          console.error("Erro ao inicializar bucket:", error);
        }
      }
    }

    initializeBucket();
  }, [user]);

  if (!user || !bucketId) {
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
