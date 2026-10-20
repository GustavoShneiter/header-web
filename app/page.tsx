import AppShell from "@/components/app-shell";

export const dynamic = "force-dynamic";

export default function Page(){
 const supabaseUrl=process.env.NEXT_PUBLIC_SUPABASE_URL??"";
 const supabaseKey=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY??"";
 return <AppShell supabaseUrl={supabaseUrl} supabaseKey={supabaseKey}/>;
}
