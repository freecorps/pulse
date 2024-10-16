"use client";
import { z } from "zod";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import AutoForm, { AutoFormSubmit } from "@/components/ui/auto-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthStore } from "../stores/AuthStore";
import { toast } from "sonner";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const secret = searchParams.get("secret");
  const userId = searchParams.get("userId");
  const [step, setStep] = useState<"reset" | "newPassword">("reset");

  const { resetPassword, loading, updateUserPassword, removeUser } =
    useAuthStore();

  useEffect(() => {
    if (secret && userId) {
      setStep("newPassword");
    }
  }, [secret, userId]);

  const resetForm = z.object({
    email: z.string().email(),
  });

  const newPasswordForm = z
    .object({
      password: z.string().min(8),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords must match",
      path: ["confirmPassword"],
    });

  const sendResetEmail = async ({ email }: { email: string }) => {
    try {
      await resetPassword(email);
      toast.success("Email enviado com sucesso");
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const changePassword = async ({ password }: { password: string }) => {
    if (!secret || !userId) {
      return;
    }
    try {
      await updateUserPassword(userId, secret, password);
      removeUser();
      toast.success("Senha alterada com sucesso, agora você pode fazer login.");
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  if (step === "newPassword") {
    return (
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Recuperar senha</CardTitle>
          <CardDescription>Insira sua nova senha.</CardDescription>
        </CardHeader>
        <CardContent>
          <AutoForm
            formSchema={newPasswordForm}
            fieldConfig={{
              confirmPassword: {
                inputProps: {
                  type: "password",
                  placeholder: "••••••••",
                },
              },
              password: {
                inputProps: {
                  type: "password",
                  placeholder: "••••••••",
                },
              },
            }}
            onSubmit={changePassword}
          >
            <AutoFormSubmit disabled={loading}>Salvar</AutoFormSubmit>
          </AutoForm>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Recuperar senha</CardTitle>
        <CardDescription>
          Insira o email da sua conta para recuperar a senha.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AutoForm formSchema={resetForm} onSubmit={sendResetEmail}>
          <AutoFormSubmit disabled={loading}>
            Enviar email de recuperação
          </AutoFormSubmit>
        </AutoForm>
      </CardContent>
    </Card>
  );
}

function ResetPasswordPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Suspense fallback={<div>Carregando...</div>}>
        <ResetPasswordContent />
      </Suspense>
    </div>
  );
}

export default ResetPasswordPage;
