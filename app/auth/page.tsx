"use client";

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
  CardFooter,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AuthPage() {
  const { login, register, loading, user, loginWithOAuth, logout, error } =
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
      <div>
        <h1>Welcome {user.email}</h1>
        <button onClick={() => logout()}>Logout</button>
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
              </AutoForm>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
