"use client";
import {useEffect,useMemo,useState} from "react";
import type {User} from "@supabase/supabase-js";
import {createSupabaseBrowserClient} from "@/lib/supabase";
import AuthScreen from "@/components/auth-screen";
import Workspace from "@/components/workspace";

export default function AppShell({supabaseUrl,supabaseKey}:{supabaseUrl:string;supabaseKey:string}){
 const client=useMemo(()=>createSupabaseBrowserClient(supabaseUrl,supabaseKey),[supabaseUrl,supabaseKey]);
 const [user,setUser]=useState<User|null>(null),[ready,setReady]=useState(!client),[recovery,setRecovery]=useState(false);
 useEffect(()=>{if(!client)return;let active=true;client.auth.getSession().then(({data})=>{if(active){setUser(data.session?.user??null);setReady(true);}});const {data}=client.auth.onAuthStateChange((event,session)=>{setUser(session?.user??null);setReady(true);if(event==="PASSWORD_RECOVERY")setRecovery(true);});return()=>{active=false;data.subscription.unsubscribe();};},[client]);
 if(!ready)return <div className="loading-screen">Abrindo seu Header…</div>;
 if(!user||recovery)return <AuthScreen client={client} supabaseUrl={supabaseUrl} supabaseKey={supabaseKey} recovery={recovery} onRecovered={()=>setRecovery(false)}/>;
 return <Workspace key={user.id} client={client} user={user}/>;
}
