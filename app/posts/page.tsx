"use client";

import React, { useState, useRef } from "react";
import DynamicMDXEditor from "@/components/dynamicmdxEditor";
import { MDXEditorMethods } from "@mdxeditor/editor";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";

const AddPostPage: React.FC = () => {
  const [mdxContent, setMdxContent] = useState<string>("");
  const editorRef = useRef<MDXEditorMethods>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [gameType, setGameType] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);

  const handlePublish = () => {
    if (editorRef.current) {
      const content = editorRef.current.getMarkdown();
      console.log("Título:", title);
      console.log("Descrição:", description);
      console.log("Tipo de Jogo:", gameType);
      console.log("Imagem da Capa:", coverImage);
      console.log("Conteúdo MDX:", content);
    }
  };

  const handleCoverImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      setCoverImage(event.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="w-full max-w-6xl mx-auto space-y-8 px-4 mt-16">
        <h1 className="text-2xl font-bold mb-4">Adicionar Postagem</h1>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título da postagem"
            />
          </div>

          {/* Campo Descrição */}
          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Digite uma breve descrição"
            />
          </div>

          {/* Campo Tipo de Jogo */}
          <div>
            <Label htmlFor="gameType">Tipo de Jogo</Label>
            <Select value={gameType} onValueChange={setGameType}>
              <SelectTrigger id="gameType">
                <SelectValue placeholder="Selecione um jogo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lol">League of Legends</SelectItem>
                <SelectItem value="valorant">Valorant</SelectItem>
                <SelectItem value="csgo">CS:GO</SelectItem>
                {/* Adicione outros tipos de jogos conforme necessário */}
              </SelectContent>
            </Select>
          </div>

          {/* Campo Imagem da Capa */}
          <div>
            <Label htmlFor="coverImage">Imagem da Capa</Label>
            <Input
              id="coverImage"
              type="file"
              accept="image/*"
              onChange={handleCoverImageChange}
            />
            {coverImage && (
              <p className="text-sm text-gray-500">
                Imagem selecionada: {coverImage.name}
              </p>
            )}
          </div>

          {/* Editor MDX */}
          <div className="mt-4">
            <Label>Conteúdo</Label>
            <DynamicMDXEditor
              ref={editorRef}
              markdown={mdxContent}
              onChange={(markdown) => setMdxContent(markdown)}
              placeholder="Escreva aqui sua postagem em MDX..."
            />
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-end mt-4">
            <Button variant="secondary" className="mr-2">
              Cancelar
            </Button>
            <Button onClick={handlePublish}>Publicar</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPostPage;
