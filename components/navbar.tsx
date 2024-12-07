"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { useAuthStore } from "@/app/stores/AuthStore";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ModeToggle } from "./modeTogle";
import { LogOut, Menu, User, MessageCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Models } from "appwrite";
import { siteLinks } from "@/config/site";
import { SearchCommand } from "./search-command";
import { useState, useEffect } from "react";
import { Query } from "appwrite";
import { teams, databases } from "@/app/appwrite";
import Image from "next/image";

export default function Navbar() {
  const { user, logout } = useAuthStore();

  return (
    <header className="fixed top-0 left-0 right-0 h-12 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container h-full mx-auto px-4">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2" prefetch={false}>
              <Logo className="h-7 w-7" />
            </Link>
            <nav className="hidden lg:flex items-center gap-4">
              {siteLinks.map((item) => (
                <Link key={item.name} href={item.href} prefetch={false}>
                  <Button variant="ghost">{item.name}</Button>
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <SearchCommand />
            {user ? (
              <>
                <UserMenu user={user} logout={logout} />
                <ModeToggle />
              </>
            ) : (
              <>
                <div className="hidden lg:flex items-center gap-2">
                  <Link href="/auth" prefetch={false}>
                    <Button variant="ghost">Login</Button>
                  </Link>
                  <Link href="/auth" prefetch={false}>
                    <Button>Register</Button>
                  </Link>
                </div>
                <ModeToggle />
              </>
            )}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Menu de Navegação</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4 mt-6">
                  {siteLinks.map((item) => (
                    <Link key={item.name} href={item.href} prefetch={false}>
                      <Button variant="ghost" className="w-full justify-start">
                        {item.name}
                      </Button>
                    </Link>
                  ))}
                  {!user && (
                    <>
                      <Link
                        href="/auth"
                        className="text-lg font-semibold"
                        prefetch={false}
                      >
                        Login
                      </Link>
                      <Link
                        href="/auth"
                        className="text-lg font-semibold"
                        prefetch={false}
                      >
                        Register
                      </Link>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

interface UserMenuProps {
  user: Models.User<Models.Preferences>;
  logout: () => void;
}

function UserMenu({ user, logout }: UserMenuProps) {
  const [isEditor, setIsEditor] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [hasForumProfile, setHasForumProfile] = useState(false);
  const [forumProfileId, setForumProfileId] = useState<string | null>(null);

  useEffect(() => {
    async function checkPermissions() {
      // Verifica Editor
      try {
        const editorMembership = await teams.listMemberships("editor", [
          Query.equal("userId", user.$id),
        ]);
        setIsEditor(editorMembership.total > 0);
      } catch (error) {
        console.error("Erro ao verificar permissão de editor:", error);
        setIsEditor(false);
      }

      // Verifica Premium
      try {
        const premiumMembership = await teams.listMemberships("premium", [
          Query.equal("userId", user.$id),
        ]);
        setIsPremium(premiumMembership.total > 0);
      } catch (error) {
        console.error("Erro ao verificar permissão premium:", error);
        setIsPremium(false);
      }

      // Verifica perfil do fórum
      try {
        const forumProfile = await databases.listDocuments("forum", "perfil", [
          Query.equal("userId", user.$id),
        ]);

        setHasForumProfile(forumProfile.total > 0);
        if (forumProfile.total > 0) {
          setForumProfileId(forumProfile.documents[0].$id);
        }
      } catch (error) {
        console.error("Erro ao verificar perfil do fórum:", error);
        setHasForumProfile(false);
      }
    }

    checkPermissions();
  }, [user.$id]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.prefs.profilePictureUrl} alt={user.name} />
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {isEditor && (
                <span className="px-1.5 py-0.5 text-[10px] font-medium text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                  Editor
                </span>
              )}
              {isPremium && (
                <span className="px-1.5 py-0.5 text-[10px] font-medium text-blue-600 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  Premium
                </span>
              )}
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/profile" className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </Link>
          </DropdownMenuItem>
          {hasForumProfile ? (
            <DropdownMenuItem asChild>
              <Link
                href={`/forum/profile/${forumProfileId}`}
                className="flex items-center"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                <span>Perfil do Fórum</span>
              </Link>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem asChild>
              <Link href="/forum/profile/new" className="flex items-center">
                <MessageCircle className="mr-2 h-4 w-4" />
                <span>Criar Perfil do Fórum</span>
              </Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        {(isEditor || isPremium) && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {isEditor && (
                <DropdownMenuItem asChild>
                  <Link href="/editor" className="flex items-center">
                    <svg
                      viewBox="0 0 24 24"
                      className="mr-2 h-4 w-4 fill-yellow-600"
                      aria-hidden="true"
                    >
                      <path d="M12 2L9.1 9.1H2L7.5 13.3L5.7 20L12 15.9L18.3 20L16.5 13.3L22 9.1H14.9L12 2Z" />
                    </svg>
                    <span>Área do Editor</span>
                  </Link>
                </DropdownMenuItem>
              )}
              {isPremium && (
                <DropdownMenuItem asChild>
                  <Link href="/premium" className="flex items-center">
                    <svg
                      viewBox="0 0 24 24"
                      className="mr-2 h-4 w-4 fill-blue-600"
                      aria-hidden="true"
                    >
                      <path d="M12 2L9.1 9.1H2L7.5 13.3L5.7 20L12 15.9L18.3 20L16.5 13.3L22 9.1H14.9L12 2Z" />
                    </svg>
                    <span>Área Premium</span>
                  </Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Logo(props: React.HTMLAttributes<HTMLImageElement>) {
  return (
    <Image
      {...props}
      src="/favicon.ico"
      alt="Logo do site"
      width={24}
      height={24}
    />
  );
}
