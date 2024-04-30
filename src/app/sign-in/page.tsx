import { redirect } from "next/navigation";
import SignInForm from "./SignInForm";
import { getServerAuthSession } from "@/server/auth";

export default async function SignInPage() {
  const session = await getServerAuthSession();
  if (session) redirect("/admin");
  return <SignInForm />;
}
