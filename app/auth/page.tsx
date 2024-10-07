"use client";

import { OAuthProvider } from "appwrite";
import { useAuthStore } from "../stores/AuthStore";
import { z } from "zod";
import AutoForm, { AutoFormSubmit } from "@/components/ui/auto-form";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export default function AuthPage() {
  const { login, register, loading, user, loginWithOAuth, logout, error } =
    useAuthStore();

  const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
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
    <div className="container mx-auto p-4 max-w-md">
      <Card>
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
      </Card>
    </div>
  );
}
