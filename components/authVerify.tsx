"use client";
import { useAuthStore } from "@/app/stores/AuthStore";

export default function AuthVerify() {
  const { needToChallenge } = useAuthStore();

  if (needToChallenge) {
    if (window.location.pathname !== "/auth") {
      window.location.href = "/auth";
    }
  }

  return null;
}
