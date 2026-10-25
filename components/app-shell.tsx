"use client";
import {authClient} from "@/lib/auth-client";
import AuthScreen from "@/components/auth-screen";
import Workspace from "@/components/workspace";

export default function AppShell(){
 const {data:session,isPending}=authClient.useSession();
 if(isPending)return <div className="loading-screen">Abrindo seu Header…</div>;
 if(!session?.user)return <AuthScreen/>;
 const user={
  id:session.user.id,
  email:session.user.email,
  name:session.user.name,
  createdAt:session.user.createdAt instanceof Date?session.user.createdAt.toISOString():String(session.user.createdAt),
  provider:"email" as const,
 };
 return <Workspace key={user.id} user={user}/>;
}
