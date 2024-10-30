"use client";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import Navbar from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/app/stores/AuthStore";
import { account, avatars } from "@/app/appwrite";
import { Models, AuthenticationFactor } from "appwrite";
import { toast } from "sonner";
import AutoForm, { AutoFormSubmit } from "@/components/ui/auto-form";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Credenza,
  CredenzaContent,
  CredenzaDescription,
  CredenzaHeader,
  CredenzaTitle,
} from "@/components/ui/credenza/credenza";
import ProfilePictureUpload from "@/components/profilePictureUpload";

const profileSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z
    .string()
    .startsWith("+", "O número de telefone deve começar com +")
    .min(1, "Número de telefone inválido")
    .max(15, "Número de telefone inválido")
    .optional(),
  password: z
    .string()
    .min(8, "A senha deve ter pelo menos 8 caracteres")
    .optional(),
});

export default function Profile() {
  const {
    user,
    logout,
    updateProfilePicture,
    createMfaRecoveryCodes,
    createTotp,
    verifyAuthenticator,
    updateMFA,
  } = useAuthStore();
  const [sessions, setSessions] = useState<Models.Session[]>([]);
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [mfaFactors, setMfaFactors] = useState<Models.MfaFactors | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | undefined>();
  const [isMfaDialogOpen, setIsMfaDialogOpen] = useState(false);
  const [mfaStep, setMfaStep] = useState<
    "confirm" | "recoveryCodes" | "setupMethod" | "verifyMethod"
  >("confirm");
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [totpUri, setTotpUri] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [challengeID, setChallengeID] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      fetchSessions();
      checkMfaStatus();
      setProfilePicture(user.prefs?.profilePictureUrl);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchSessions();
      checkMfaStatus();
      setProfilePicture(user.prefs?.profilePictureUrl);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card>
          <CardHeader>
            Você precisa estar logado para ver esta página.
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/auth")}>
              Ir para Autenticação
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const fetchSessions = async () => {
    try {
      const response = await account.listSessions();
      setSessions(response.sessions);
    } catch (error) {
      console.error("Erro ao buscar sessões:", error);
      toast.error("Falha ao buscar sessões");
    }
  };

  const checkMfaStatus = async () => {
    try {
      const factors = await account.listMfaFactors();
      setMfaEnabled(factors.totp || factors.email);
      setMfaFactors(factors);
    } catch (error) {
      console.error("Erro ao verificar o status da MFA:", error);
      toast.error("Falha ao verificar o status da MFA");
    }
  };

  const updateProfile = async (data: z.infer<typeof profileSchema>) => {
    try {
      if (data.name !== user?.name) {
        await account.updateName(data.name);
      }
      if (data.email !== user?.email && data.password) {
        await account.updateEmail(data.email, data.password);
      }
      if (data.phone !== user?.phone && data.password) {
        await account.updatePhone(data.phone || "", data.password);
      }
      toast.success("Perfil atualizado com sucesso!");
    } catch {
      toast.error("Falha ao atualizar o perfil. Por favor, tente novamente.");
    }
  };

  const startMfaSetup = async () => {
    if (!user?.emailVerification) {
      toast.error("Você precisa verificar seu email antes de habilitar a MFA.");
      return;
    }
    setIsMfaDialogOpen(true);
    setMfaStep("confirm");
  };

  const confirmMfaSetup = async () => {
    try {
      if (!mfaFactors?.recoveryCode) {
        const codes = await createMfaRecoveryCodes();
        setRecoveryCodes(codes);
        setMfaStep("recoveryCodes");
      } else {
        setMfaStep("setupMethod");
      }
    } catch (error) {
      console.error("Erro ao criar códigos de recuperação:", error);
      toast.error(
        "Falha ao criar códigos de recuperação. Por favor, tente novamente."
      );
    }
  };

  const setupTOTP = async () => {
    try {
      const otpCreated = await createTotp();
      if (!otpCreated) {
        toast.error("Falha ao criar TOTP. Por favor, tente novamente.");
        return;
      }
      setTotpUri(otpCreated.uri);
      const qrCode = avatars.getQR(otpCreated.uri, 800, 0, false);
      setTotpUri(qrCode);
      setMfaStep("verifyMethod");
    } catch (error) {
      console.error("Erro ao configurar TOTP:", error);
      toast.error("Falha ao configurar TOTP. Por favor, tente novamente.");
    }
  };

  const verifyTOTP = async () => {
    try {
      await verifyAuthenticator(verificationCode);
      await updateMFA(true);
      toast.success("MFA habilitada com sucesso!");
      setIsMfaDialogOpen(false);
      checkMfaStatus();
    } catch (error) {
      console.error("Erro ao verificar TOTP:", error);
      toast.error("Falha ao verificar TOTP. Por favor, tente novamente.");
    }
  };

  const setupEmailMFA = async () => {
    try {
      const challengge = await account.createMfaChallenge(
        AuthenticationFactor.Email
      );
      setChallengeID(challengge.$id);
      setMfaStep("verifyMethod");
    } catch (error) {
      console.error("Erro ao configurar MFA por Email:", error);
      toast.error(
        "Falha ao configurar MFA por Email. Por favor, tente novamente."
      );
    }
  };

  const setupBackupCodes = async () => {
    try {
      const codes = await createMfaRecoveryCodes();
      setRecoveryCodes(codes);
      setMfaStep("recoveryCodes");
    } catch (error) {
      console.error("Erro ao configurar códigos de recuperação:", error);
      toast.error(
        "Falha ao configurar códigos de recuperação. Por favor, tente novamente."
      );
    }
  };

  const verifyEmailMFA = async () => {
    if (!challengeID) {
      toast.error(
        "Erro ao verificar MFA por Email. Por favor, tente novamente."
      );
      return;
    }
    try {
      await account.updateMfaChallenge(challengeID, verificationCode);
      await updateMFA(true);
      toast.success("MFA habilitada com sucesso!");
      setIsMfaDialogOpen(false);
      checkMfaStatus();
    } catch (error) {
      console.error("Erro ao verificar MFA por Email:", error);
      toast.error(
        "Falha ao verificar MFA por Email. Por favor, tente novamente."
      );
    }
  };

  return (
    <div>
      <Navbar />
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full max-w-3xl">
          <ProfilePictureUpload
            profilePicture={profilePicture}
            userId={user?.$id}
            onUpdateProfilePicture={async (fileUrl, fileId) => {
              await updateProfilePicture(fileUrl, fileId);
              setProfilePicture(fileUrl);
            }}
            userPrefs={user?.prefs}
          />
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <AutoForm
                values={{
                  name: user.name,
                  email: user.email,
                  phone: user.phone,
                }}
                onSubmit={updateProfile}
                formSchema={profileSchema}
                fieldConfig={{
                  password: {
                    inputProps: {
                      type: "password",
                      placeholder: "••••••••",
                    },
                    description:
                      "Digite sua senha atual para atualizar o email ou número de telefone",
                  },
                  phone: {
                    inputProps: {
                      placeholder: "+55 (11) 91234-5678",
                    },
                  },
                }}
              >
                <AutoFormSubmit>Atualizar Perfil</AutoFormSubmit>
              </AutoForm>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader>
              <CardTitle>Sessões Ativas</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5">
                {sessions.map((session) => (
                  <li key={session.$id}>
                    {session.provider} -{" "}
                    {new Date(session.$createdAt).toLocaleString()}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader>
              <CardTitle>Autenticação de Dois Fatores</CardTitle>
            </CardHeader>
            <CardContent>
              {mfaEnabled ? (
                <div>
                  <p>A MFA está habilitada para sua conta.</p>
                  {!mfaFactors?.totp && (
                    <Button
                      onClick={() => {
                        setMfaStep("setupMethod");
                        setIsMfaDialogOpen(true);
                      }}
                    >
                      Habilitar TOTP
                    </Button>
                  )}
                  {!mfaFactors?.email && (
                    <Button onClick={setupEmailMFA}>
                      Habilitar MFA por Email
                    </Button>
                  )}
                  {!mfaFactors?.recoveryCode && (
                    <Button onClick={setupBackupCodes}>
                      Habilitar Códigos de Recuperação
                    </Button>
                  )}
                </div>
              ) : (
                <Button onClick={startMfaSetup}>Habilitar MFA</Button>
              )}
            </CardContent>
          </Card>

          <Credenza open={isMfaDialogOpen} onOpenChange={setIsMfaDialogOpen}>
            <CredenzaContent>
              <CredenzaHeader>
                <CredenzaTitle>
                  Habilitar Autenticação de Dois Fatores
                </CredenzaTitle>
                <CredenzaDescription>
                  {mfaStep === "confirm" &&
                    "Você tem certeza de que deseja habilitar a MFA?"}
                  {mfaStep === "recoveryCodes" &&
                    "Por favor, salve esses códigos de recuperação em um lugar seguro.\n Eles não poderam ser mostrados novamente."}
                  {mfaStep === "setupMethod" &&
                    "Escolha seu método MFA preferido."}
                  {mfaStep === "verifyMethod" && "Verifique seu método MFA."}
                </CredenzaDescription>
              </CredenzaHeader>

              {mfaStep === "confirm" && (
                <Button onClick={confirmMfaSetup}>Sim, habilitar MFA</Button>
              )}

              {mfaStep === "recoveryCodes" && (
                <>
                  <div className="p-4 rounded bg-gray-100 shadow-md border border-gray-300">
                    <h3 className="text-lg font-semibold mb-2">
                      Códigos de Recuperação
                    </h3>
                    {recoveryCodes.map((code, index) => (
                      <p
                        key={index}
                        className="font-mono text-sm bg-white p-2 rounded mb-1 shadow-sm"
                      >
                        {code}
                      </p>
                    ))}
                  </div>
                  <Button onClick={() => setMfaStep("setupMethod")}>
                    Próximo
                  </Button>
                </>
              )}

              {mfaStep === "setupMethod" && (
                <Tabs defaultValue="totp">
                  <TabsList>
                    <TabsTrigger value="totp">TOTP</TabsTrigger>
                    <TabsTrigger value="email">Email</TabsTrigger>
                  </TabsList>
                  <TabsContent value="totp">
                    <Button onClick={setupTOTP}>Configurar TOTP</Button>
                  </TabsContent>
                  <TabsContent value="email">
                    <Button onClick={setupEmailMFA}>
                      Configurar MFA por Email
                    </Button>
                  </TabsContent>
                </Tabs>
              )}

              {mfaStep === "verifyMethod" && (
                <>
                  {totpUri && (
                    <Image
                      src={totpUri}
                      alt="TOTP QR Code"
                      width={200}
                      height={200}
                    />
                  )}
                  <input
                    type="text"
                    placeholder="Digite o código de verificação"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="border p-2 rounded"
                  />
                  <Button onClick={totpUri ? verifyTOTP : verifyEmailMFA}>
                    Verificar
                  </Button>
                </>
              )}
            </CredenzaContent>
          </Credenza>
        </main>
        <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
          <Button variant="destructive" onClick={logout}>
            Logout
          </Button>
        </footer>
      </div>
    </div>
  );
}
