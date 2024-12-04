"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { useAuthStore } from "@/app/stores/AuthStore";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ModeToggle } from "./modeTogle";
import { LogOut, Menu, Settings, User } from "lucide-react";
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
                <nav className="flex flex-col gap-4">
                  {siteLinks.map((item) => (
                    <Link key={item.name} href={item.href} prefetch={false}>
                      <Button variant="ghost">{item.name}</Button>
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
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link href="./profile" className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="./settings" className="flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Logo(props: React.HTMLAttributes<HTMLImageElement>) {
  return (
    <img
      {...props}
      src="/favicon.ico"
      alt="Logo do site"
      width={24}
      height={24}
    />
  );
}
