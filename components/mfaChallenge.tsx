"use client";

import React, { useState, useEffect } from "react";
import { AuthenticationFactor, Models } from "appwrite";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { useAuthStore } from "@/app/stores/AuthStore";

const MFAChallenge: React.FC<{
  factors: Models.MfaFactors;
  onVerify: (factor: AuthenticationFactor, token: string) => Promise<void>;
}> = ({ factors, onVerify }) => {
  const {
    mfaStep,
    selectedMfaFactor,
    isMfaRecovery,
    mfaChallengeId,
    setMfaStep,
    setSelectedMfaFactor,
    setIsMfaRecovery,
    createMfaChallenge,
    verifyChallenge,
    error,
  } = useAuthStore();

  const [token, setToken] = useState("");

  const handleFactorSelect = async (factor: AuthenticationFactor) => {
    setSelectedMfaFactor(factor);
    setIsMfaRecovery(false);
    try {
      await createMfaChallenge(factor);
      console.log("MFA Step updated to verify");
    } catch (error) {
      console.error("Erro ao criar desafio MFA:", error);
      toast.error("Falha ao criar desafio MFA: " + String(error));
    }
  };

  const handleRecoverySelect = async () => {
    setSelectedMfaFactor(null);
    setIsMfaRecovery(true);
    try {
      await createMfaChallenge(AuthenticationFactor.Recoverycode);
    } catch (error) {
      console.error("Erro ao criar desafio de recuperação:", error);
      toast.error("Falha ao criar desafio de recuperação: " + String(error));
    }
  };

  const handleVerify = async () => {
    if (mfaChallengeId && (selectedMfaFactor || isMfaRecovery)) {
      try {
        await verifyChallenge(
          isMfaRecovery ? AuthenticationFactor.Recoverycode : mfaChallengeId!,
          token
        );
        if (error) {
          return;
        }
        toast.success("Verificação MFA bem-sucedida!");
      } catch (error) {
        toast.error("Falha ao verificar MFA: " + String(error));
      }
    } else {
      toast.error(
        "Por favor, selecione um método MFA e gere um desafio primeiro."
      );
    }
  };

  if (!factors.totp && !factors.email) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>MFA não configurado</CardTitle>
          <CardDescription>
            Nenhum método MFA está disponível para esta conta.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="min-w-72">
      <CardHeader>
        <CardTitle>Verificação MFA</CardTitle>
        <CardDescription>
          {mfaStep === "select"
            ? "Escolha seu método MFA."
            : "Insira o código de verificação."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {mfaStep === "select" ? (
          <div className="space-y-4">
            <h3 className="text-sm font-medium mb-2">
              Selecione o método MFA:
            </h3>
            {factors.totp && (
              <Button
                onClick={() => handleFactorSelect(AuthenticationFactor.Totp)}
                className="mr-2"
              >
                TOTP (App Autenticador)
              </Button>
            )}
            {factors.email && (
              <Button
                onClick={() => handleFactorSelect(AuthenticationFactor.Email)}
                className="mr-2"
              >
                Email
              </Button>
            )}
            <Button onClick={handleRecoverySelect}>
              Código de Recuperação
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder={
                isMfaRecovery
                  ? "Insira o código de recuperação"
                  : "Insira o código de verificação"
              }
            />
            {selectedMfaFactor === AuthenticationFactor.Email && (
              <Button
                className="mr-2"
                onClick={async () => {
                  try {
                    await createMfaChallenge(AuthenticationFactor.Email);
                    toast.success(
                      "Código de verificação enviado para o seu email."
                    );
                  } catch (error) {
                    toast.error(
                      "Falha ao enviar código de verificação: " + String(error)
                    );
                  }
                }}
              >
                Reenviar Código
              </Button>
            )}
            <div className="flex w-full items-center justify-between">
              <Button onClick={handleVerify}>Verificar</Button>
              <Button onClick={() => setMfaStep("select")} variant="outline">
                Voltar
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <p className="text-sm text-red-500">{error}</p>
      </CardFooter>
    </Card>
  );
};

export default MFAChallenge;
