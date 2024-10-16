"use client";
import React from "react";
import { OAuthProvider } from "appwrite";
import { useAuthStore } from "../stores/AuthStore";
import { z } from "zod";
import AutoForm, { AutoFormSubmit } from "@/components/ui/auto-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
  CardHeader,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaDiscord, FaGoogle } from "react-icons/fa";

const Separator: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex items-center my-4">
    <div className="flex-grow border-t bg-primary"></div>
    <span className="flex-shrink mx-4 text-sm">{children}</span>
    <div className="flex-grow border-t bg-primary"></div>
  </div>
);

export default function AuthPage() {
  const { login, register, loading, user, loginWithOAuth, logout } =
    useAuthStore();

  const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string(),
  });

  if (user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-[340px]">
          <CardHeader>
            <CardTitle>Olá, {user.name}</CardTitle>
            <CardDescription>Seja bem-vindo de volta!</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4 justify-between">
            <Button
              onClick={() => {
                logout();
                toast.success("Logout realizado com sucesso!");
              }}
            >
              Fazer Logout
            </Button>
            <Button variant="secondary">
              <Link href={"./dashboard"}>Ir para a Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Registro</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>Entre com seus dados de login.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <AutoForm
                className="flex flex-col gap-1"
                formSchema={loginSchema}
                fieldConfig={{
                  password: {
                    inputProps: {
                      type: "password",
                      placeholder: "••••••••",
                    },
                  },
                }}
                onSubmit={({ email, password }) => {
                  try {
                    login(email, password);
                  } catch (error) {
                    toast.error(String(error));
                  }
                }}
              >
                <AutoFormSubmit>Login</AutoFormSubmit>
                <div>
                  <Link href="/reset-password">
                    <Button variant="secondary" className="w-full">
                      Esqueci minha senha
                    </Button>
                  </Link>
                </div>
                <Separator>ou entre com</Separator>
                <div className="flex gap-4 h-full justify-center mr-16 ml-16">
                  <Button
                    className="flex-grow"
                    onClick={() => {
                      loginWithOAuth(
                        OAuthProvider.Discord,
                        window.location.href
                      );
                    }}
                  >
                    <FaDiscord />
                  </Button>
                  <Button
                    className="flex-grow"
                    onClick={() => {
                      loginWithOAuth(
                        OAuthProvider.Google,
                        window.location.href
                      );
                    }}
                  >
                    <FaGoogle />
                  </Button>
                </div>
                <div className="text-sm">
                  Ao clicar em &ldquo;Login&ldquo; você concorda com nossos{" "}
                  <Link href="/terms" className="text-purple-500">
                    Termos de Serviço
                  </Link>{" "}
                  e{" "}
                  <Link href="/privacy" className="text-purple-500">
                    Política de Privacidade
                  </Link>
                </div>
              </AutoForm>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="register">
          <Card>
            <CardHeader>
              <CardTitle>Registro</CardTitle>
              <CardDescription>
                Crie sua conta preenchendo o formulário.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <AutoForm
                fieldConfig={{
                  password: {
                    inputProps: {
                      type: "password",
                      placeholder: "••••••••",
                    },
                  },
                }}
                className="flex flex-col gap-1"
                formSchema={registerSchema}
                onSubmit={({ email, password, name }) => {
                  try {
                    register(email, password, name);
                  } catch (error) {
                    toast.error(String(error));
                  }
                }}
              >
                <AutoFormSubmit>Registrar</AutoFormSubmit>
                <Separator>ou entre com</Separator>
                <div className="flex gap-4 h-full justify-center mr-16 ml-16">
                  <Button
                    className="flex-grow"
                    onClick={() => {
                      loginWithOAuth(
                        OAuthProvider.Discord,
                        window.location.href
                      );
                    }}
                  >
                    <FaDiscord />
                  </Button>
                  <Button
                    className="flex-grow"
                    onClick={() => {
                      loginWithOAuth(
                        OAuthProvider.Google,
                        window.location.href
                      );
                    }}
                  >
                    <FaGoogle />
                  </Button>
                </div>
                <div className="text-sm">
                  Ao clicar em &ldquo;Registrar&ldquo; você concorda com nossos{" "}
                  <Link href="/terms" className="text-purple-500">
                    Termos de Serviço
                  </Link>{" "}
                  e{" "}
                  <Link href="/privacy" className="text-purple-500">
                    Política de Privacidade
                  </Link>
                </div>
              </AutoForm>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
