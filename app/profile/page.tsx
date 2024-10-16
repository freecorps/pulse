"use client";
import React, { useEffect, useRef, useState } from "react";
import { z } from "zod";
import Navbar from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/app/stores/AuthStore";
import { account, storage } from "@/app/appwrite";
import { Models, OAuthProvider } from "appwrite";
import { toast } from "sonner";
import AutoForm, { AutoFormSubmit } from "@/components/ui/auto-form";
import { useRouter } from "next/navigation";
import Image from "next/image";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .startsWith("+", "Phone number must start with '+'")
    .min(1, "Phone number is too short")
    .max(15, "Phone number is too long")
    .optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .optional(),
});

export default function Profile() {
  const { user, logout, updateProfilePicture } = useAuthStore();
  const [sessions, setSessions] = useState<Models.Session[]>([]);
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | undefined>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      fetchSessions();
      checkMfaStatus();
      setProfilePicture(user.prefs?.profilePictureUrl);
      console.log(user.targets);
    }
  }, [user]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadProfilePicture(file);
    }
  };

  const uploadProfilePicture = async (file: File) => {
    if (!user) {
      return;
    }
    try {
      const fileId = user.$id;
      await storage.createFile("profilePicture", fileId, file);

      const fileUrl = storage.getFileView("profilePicture", fileId);

      await account.updatePrefs({ profilePictureUrl: fileUrl });

      updateProfilePicture(fileUrl);

      setProfilePicture(fileUrl);
      toast.success("Profile picture updated successfully!");
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      toast.error("Failed to upload profile picture. Please try again.");
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card>
          <CardHeader>You need to be logged in to view this page.</CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/auth")}>Go to Auth</Button>
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
      console.error("Error fetching sessions:", error);
      toast.error("Failed to fetch sessions");
    }
  };

  const checkMfaStatus = async () => {
    try {
      const factors = await account.listMfaFactors();
      setMfaEnabled(factors.totp);
    } catch (error) {
      console.error("Error checking MFA status:", error);
      toast.error("Failed to check MFA status");
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
      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const addIdentity = async (provider: OAuthProvider) => {
    try {
      const location = window.location.href;
      await account.createOAuth2Session(provider, location);
      toast.success(`${provider} account linked successfully!`);
    } catch (error) {
      console.error("Error adding identity:", error);
      toast.error(`Failed to link ${provider} account. Please try again.`);
    }
  };

  const enableMfa = async () => {
    return;
    // try {
    //   const factor = await account.createMfaAuthenticator();
    //   // Here you would typically show a QR code to the user
    //   toast.info("Scan the QR code with your authenticator app", {
    //     duration: 10000,
    //     description: `QR Code: ${factor.qrCode}`,
    //   });
    //   // After the user scans the QR code, they need to enter the code to complete setup
    //   const code = prompt("Enter the code from your authenticator app:");
    //   if (code) {
    //     await account.updateMfaAuthenticator(factor.id, code);
    //     setMfaEnabled(true);
    //     toast.success("MFA enabled successfully!");
    //   }
    // } catch (error) {
    //   console.error("Error enabling MFA:", error);
    //   toast.error("Failed to enable MFA. Please try again.");
    // }
  };

  const isProviderLinked = (provider: OAuthProvider) => {
    return user.targets.some((identity) => identity.name === provider);
  };

  return (
    <div>
      <Navbar />
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full max-w-3xl">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <Image
                src={profilePicture as string}
                alt="Profile Picture"
                width={100}
                height={100}
                className="rounded-full"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                ref={fileInputRef}
                className="hidden"
              />
              <Button onClick={triggerFileInput}>Upload New Picture</Button>
            </CardContent>
          </Card>

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
                      "Type your current password to update email or phone number",
                  },
                  phone: {
                    inputProps: {
                      placeholder: "+1 (555) 123-4567",
                    },
                  },
                }}
              >
                <AutoFormSubmit>Update Profile</AutoFormSubmit>
              </AutoForm>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader>
              <CardTitle>Linked Accounts</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <Button
                onClick={() => addIdentity(OAuthProvider.Discord)}
                disabled={isProviderLinked(OAuthProvider.Discord)}
              >
                Link Discord
              </Button>
              <Button
                onClick={() => addIdentity(OAuthProvider.Google)}
                disabled={isProviderLinked(OAuthProvider.Google)}
              >
                Link Google
              </Button>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader>
              <CardTitle>Active Sessions</CardTitle>
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
              <CardTitle>Two-Factor Authentication</CardTitle>
            </CardHeader>
            <CardContent>
              {mfaEnabled ? (
                <p>MFA is enabled for your account.</p>
              ) : (
                <Button onClick={enableMfa}>Enable MFA</Button>
              )}
            </CardContent>
          </Card>
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
