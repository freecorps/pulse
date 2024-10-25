"use client";
import React, { useEffect, useState } from "react";
import { Models, OAuthProvider } from "appwrite";
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
import MFAChallenge from "@/components/mfaChallenge";

const Separator: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex items-center my-4">
    <div className="flex-grow border-t bg-primary"></div>
    <span className="flex-shrink mx-4 text-sm">{children}</span>
    <div className="flex-grow border-t bg-primary"></div>
  </div>
);

export default function AuthPage() {
  const {
    login,
    register,
    loading,
    user,
    loginWithOAuth,
    logout,
    isMFAChallengeRequired,
    listMfaFactors,
    verifyChallenge,
  } = useAuthStore();

  const [mfaFactors, setMfaFactors] = useState<Models.MfaFactors | null>(null);

  useEffect(() => {
    if (isMFAChallengeRequired) {
      listMfaFactors().then((factors) => {
        if (Object.keys(factors).length > 0) {
          setMfaFactors(factors as Models.MfaFactors);
        } else {
          toast.error("Nenhum fator MFA disponível para esta conta.");
        }
      });
    }
  }, [isMFAChallengeRequired, listMfaFactors]);

  const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().describe("Senha").min(6),
  });

  const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().describe("Senha").min(6),
    name: z.string().describe("Nome"),
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
              <Link href={"/"}>Ir para a Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (isMFAChallengeRequired && mfaFactors) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <MFAChallenge
          factors={mfaFactors}
          onVerify={async (factor, token) => {
            try {
              await verifyChallenge(factor, token);
              toast.success("Verificação MFA bem-sucedida!");
            } catch (error) {
              toast.error("Falha na verificação MFA: " + String(error));
            }
          }}
        />
      </div>
    );
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
            <CardContent>
              <AutoForm
                className="flex flex-col"
                formSchema={loginSchema}
                fieldConfig={{
                  password: {
                    fieldType: "password",
                    inputProps: {
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
                <div className="flex">
                  <Link href="/reset-password">
                    <Button variant="link" className="w-full p-0">
                      Esqueci minha senha
                    </Button>
                  </Link>
                </div>
                <AutoFormSubmit>Login</AutoFormSubmit>
                <Separator>ou entre com</Separator>
                <div className="flex gap-4 h-full justify-center mr-16 ml-16">
                  <Button
                    className="flex-grow"
                    onClick={async () => {
                      await loginWithOAuth(
                        OAuthProvider.Discord,
                        window.location.origin + "/auth/redirect",
                        window.location.origin + "/auth/redirect"
                      );
                    }}
                  >
                    <FaDiscord />
                  </Button>
                  <Button
                    className="flex-grow"
                    onClick={async () => {
                      await loginWithOAuth(
                        OAuthProvider.Google,
                        window.location.origin + "/auth/redirect",
                        window.location.origin + "/auth/redirect"
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
                    fieldType: "password",
                    inputProps: {
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
                    onClick={async () => {
                      await loginWithOAuth(
                        OAuthProvider.Discord,
                        window.location.origin + "/auth/redirect",
                        window.location.origin + "/auth/redirect"
                      );
                    }}
                  >
                    <FaDiscord />
                  </Button>
                  <Button
                    className="flex-grow"
                    onClick={async () => {
                      await loginWithOAuth(
                        OAuthProvider.Google,
                        window.location.origin + "/auth/redirect",
                        window.location.origin + "/auth/redirect"
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
