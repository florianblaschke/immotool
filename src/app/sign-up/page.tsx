"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signIn } from "next-auth/react";
import { Icons } from "@/lib/icons";

export default function SignUp() {
  return (
    <div className="flex h-screen flex-1 items-center justify-center">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Button
              variant="outline"
              className="w-full gap-4"
              onClick={async () =>
                await signIn("github", { callbackUrl: "/admin" })
              }
            >
              <Icons.github className="size-4" />
              SignUp with GitHub
            </Button>
            <Button
              variant="outline"
              className="w-full gap-4"
              onClick={async () =>
                await signIn("google", { callbackUrl: "/admin" })
              }
            >
              <Icons.google className="size-4" />
              SignUp with Google
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/sign-in" className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
