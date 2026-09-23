"use client";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import "./auth-screen.css";

export function authMessage(error: unknown): string {
  const e = error as { code?: string; message?: string };
  const messages: Record<string, string> = {
    invalid_credentials: "E-mail ou senha incorretos.",
    email_not_confirmed: "Confirme seu e-mail antes de entrar. Verifique também o spam.",
    over_email_send_rate_limit: "Limite de e-mails atingido. Aguarde alguns minutos.",
    over_request_rate_limit: "Muitas tentativas. Aguarde alguns minutos.",
    weak_password: "Escolha uma senha mais forte, com pelo menos 8 caracteres.",
    user_already_exists: "Esta conta já existe. Use Entrar.",
    signup_disabled: "O cadastro está desativado. Entre com uma conta existente.",
  };
  return messages[e?.code ?? ""] ?? (e?.message === "Failed to fetch" ? "Não foi possível conectar. Confira sua internet." : e?.message ?? "Não foi possível acessar sua conta.");
}

export default function AuthScreen({ recovery = false, onRecovered = () => {} }: { recovery?: boolean; onRecovered?: () => void }) {
  const [mode, setMode] = useState<"login" | "signup" | "reset" | "verify">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [failed, setFailed] = useState(false);
  const [visible, setVisible] = useState(false);
  const [story, setStory] = useState(0);
  const stories = [
    {image:"/login/morning-focus.png",top:"Seu tempo.",bottom:"Seu ritmo."},
    {image:"/login/yoga-sunrise.png",top:"Menos ruído.",bottom:"Mais presença."},
    {image:"/login/coffee-ritual.png",top:"Um passo.",bottom:"Depois, outro."},
    {image:"/login/library-planning.png",top:"Clareza para",bottom:"o que importa."},
    {image:"/login/park-reset.png",top:"Aqui começa",bottom:"o seu espaço."},
  ];
  useEffect(() => { const timer = window.setInterval(() => setStory(current => (current + 1) % stories.length), 8000); return () => window.clearInterval(timer); }, [stories.length]);
  const title = recovery ? "Escolha sua nova senha." : mode === "signup" ? "Crie sua conta." : mode === "reset" ? "Recupere seu acesso." : mode === "verify" ? "Confirme seu e-mail." : "Bom ter você por aqui.";
  const action = recovery ? "Salvar nova senha" : mode === "signup" ? "Criar conta" : mode === "reset" ? "Enviar recuperação" : mode === "verify" ? "Confirmar código" : "Entrar";

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!supabase || busy) return;
    setBusy(true); setMessage(""); setFailed(false);
    try {
      if (recovery) {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        onRecovered(); return;
      }
      if (mode === "reset") {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: window.location.origin + "/" });
        if (error) throw error;
        setMessage("Se houver uma conta com esse e-mail, você receberá as instruções de recuperação.");
      } else if (mode === "verify") {
        const { error } = await supabase.auth.verifyOtp({ email: email.trim(), token: code.trim(), type: "signup" });
        if (error) throw error;
      } else if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({ email: email.trim(), password, options: { emailRedirectTo: window.location.origin + "/" } });
        if (error) throw error;
        if (!data.session) setMessage("Confira seu e-mail para confirmar o cadastro. Depois entre com sua senha.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
      }
    } catch (error) { setFailed(true); setMessage(authMessage(error)); }
    finally { setBusy(false); }
  }
  async function google() {
    if (!supabase || busy) return;
    setBusy(true); setMessage(""); setFailed(false);
    try {
      const settings = await fetch(process.env.NEXT_PUBLIC_SUPABASE_URL + "/auth/v1/settings", {
        headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY! },
        signal: AbortSignal.timeout(15000),
      });
      if (!settings.ok) throw new Error("Não foi possível verificar o acesso com Google.");
      const data = await settings.json() as { external?: { google?: boolean } };
      if (!data.external?.google) throw new Error("O Google ainda não foi habilitado no Supabase. Você pode entrar com e-mail e senha.");
      const { error } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.origin + "/", queryParams: { prompt: "select_account" } } });
      if (error) throw error;
    } catch (error) { setFailed(true); setMessage(authMessage(error)); }
    finally { setBusy(false); }
  }
  function change(next: typeof mode) { setMode(next); setMessage(""); setFailed(false); }
  return <main className="auth-page">
    <aside className="auth-story" style={{backgroundImage:`linear-gradient(90deg,rgba(20,31,22,.91),rgba(20,31,22,.53)),url(${stories[story].image})`}}>
      <Link className="auth-brand" href="/"><span>h.</span>header</Link>
      <div className="auth-story-copy" key={story}><p className="auth-kicker">SEU ESPAÇO PESSOAL</p><h1>{stories[story].top}<br/><span>{stories[story].bottom}</span></h1></div>
      <div className="auth-story-footer"><div className="auth-story-dots" aria-label={`Imagem ${story+1} de ${stories.length}`}>{stories.map((item,index)=><button key={item.image} type="button" aria-label={`Ver imagem ${index+1}`} aria-current={story===index} onClick={()=>setStory(index)}/>)}</div></div>
    </aside>
    <section className="auth-form-panel">
      <div className="auth-card">
        <span className="auth-mobile-brand">header</span>
        <p className="auth-kicker">HEADER</p><h2>{title}</h2>
        <p className="auth-intro">Entre para continuar.</p>
        {!recovery && <><button className="auth-google" type="button" disabled={busy || !supabase} onClick={google}>Continuar com Google</button><div className="auth-divider"><span>ou com seu e-mail</span></div></>}
        <form onSubmit={submit}>
          {!recovery && <label>E-mail<input autoComplete="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="voce@exemplo.com" disabled={busy}/></label>}
          {mode !== "reset" && mode !== "verify" && <label>Senha<div className="auth-password"><input autoComplete={mode === "signup" || recovery ? "new-password" : "current-password"} type={visible ? "text" : "password"} required minLength={mode === "signup" || recovery ? 8 : 1} value={password} onChange={e => setPassword(e.target.value)} disabled={busy}/><button type="button" onClick={() => setVisible(!visible)} aria-label={visible ? "Ocultar senha" : "Mostrar senha"}>{visible ? "Ocultar" : "Mostrar"}</button></div></label>}
          {mode === "verify" && <label>Código de confirmação<input inputMode="numeric" autoComplete="one-time-code" required value={code} onChange={e => setCode(e.target.value)} disabled={busy}/></label>}
          {mode === "login" && !recovery && <button type="button" className="auth-link auth-forgot" disabled={busy} onClick={() => change("reset")}>Esqueci minha senha</button>}
          {!supabase && <p role="alert" className="auth-error">A conexão ainda não está configurada. Reinicie o servidor do Header.</p>}
          {message && <p role={failed ? "alert" : "status"} className={failed ? "auth-error" : "auth-message"}>{message}</p>}
          <button className="auth-submit" disabled={busy || !supabase}>{busy ? "Aguarde…" : action}</button>
        </form>
        {!recovery && <div className="auth-footer">
          <button className="auth-link" disabled={busy} onClick={() => change(mode === "login" ? "signup" : "login")}>{mode === "login" ? "Não tem conta? Criar conta" : "Já tem conta? Entrar"}</button>
          {mode === "signup" && <button className="auth-link" disabled={busy} onClick={() => change("verify")}>Recebi um código de confirmação</button>}
        </div>}
      </div>
    </section>
  </main>;
}
