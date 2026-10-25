"use client";

import Link from "next/link";
import {useEffect,useState,type FormEvent} from "react";
import {authClient} from "@/lib/auth-client";
import "./auth-screen.css";

export function authMessage(error:unknown):string{
 const value=error as {code?:string;message?:string;error?:{code?:string;message?:string}};
 const code=value?.code??value?.error?.code??"";
 const detail=value?.message??value?.error?.message??"";
 const messages:Record<string,string>={
  INVALID_EMAIL_OR_PASSWORD:"E-mail ou senha incorretos.",
  USER_ALREADY_EXISTS:"Esta conta já existe. Use Entrar.",
  PASSWORD_TOO_SHORT:"Escolha uma senha com pelo menos 8 caracteres.",
  TOO_MANY_REQUESTS:"Muitas tentativas. Aguarde alguns minutos.",
 };
 return messages[code]??(detail.includes("fetch")?"Não foi possível conectar ao Header. Tente novamente.":detail||"Não foi possível acessar sua conta.");
}

export default function AuthScreen(){
 const [mode,setMode]=useState<"login"|"signup">("login");
 const [name,setName]=useState("");
 const [email,setEmail]=useState("");
 const [password,setPassword]=useState("");
 const [busy,setBusy]=useState(false);
 const [message,setMessage]=useState("");
 const [failed,setFailed]=useState(false);
 const [visible,setVisible]=useState(false);
 const [story,setStory]=useState(0);
 const stories=[
  {image:"/login/morning-focus.png",top:"Seu tempo.",bottom:"Seu ritmo."},
  {image:"/login/yoga-sunrise.png",top:"Menos ruído.",bottom:"Mais presença."},
  {image:"/login/coffee-ritual.png",top:"Um passo.",bottom:"Depois, outro."},
  {image:"/login/library-planning.png",top:"Clareza para",bottom:"o que importa."},
  {image:"/login/park-reset.png",top:"Aqui começa",bottom:"o seu espaço."},
 ];
 useEffect(()=>{const timer=window.setInterval(()=>setStory(current=>(current+1)%stories.length),8000);return()=>window.clearInterval(timer);},[stories.length]);

 async function submit(event:FormEvent){
  event.preventDefault();
  if(busy)return;
  setBusy(true);setMessage("");setFailed(false);
  try{
   const result=mode==="signup"
    ?await authClient.signUp.email({name:name.trim(),email:email.trim(),password,callbackURL:"/"})
    :await authClient.signIn.email({email:email.trim(),password,callbackURL:"/"});
   if(result.error)throw result.error;
   window.location.assign("/");
  }catch(error){setFailed(true);setMessage(authMessage(error));}
  finally{setBusy(false);}
 }

 function change(next:typeof mode){setMode(next);setMessage("");setFailed(false);}
 const title=mode==="signup"?"Crie sua conta.":"Bom ter você por aqui.";
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
    <p className="auth-intro">{mode==="signup"?"Sua rotina, preferências e progresso ficam seguros na sua conta.":"Entre para continuar de onde parou."}</p>
    <form onSubmit={submit}>
     {mode==="signup"&&<label>Nome<input autoComplete="name" required maxLength={100} value={name} onChange={event=>setName(event.target.value)} placeholder="Como você quer ser chamado?" disabled={busy}/></label>}
     <label>E-mail<input autoComplete="email" type="email" required value={email} onChange={event=>setEmail(event.target.value)} placeholder="voce@exemplo.com" disabled={busy}/></label>
     <label>Senha<div className="auth-password"><input autoComplete={mode==="signup"?"new-password":"current-password"} type={visible?"text":"password"} required minLength={mode==="signup"?8:1} value={password} onChange={event=>setPassword(event.target.value)} disabled={busy}/><button type="button" onClick={()=>setVisible(!visible)} aria-label={visible?"Ocultar senha":"Mostrar senha"}>{visible?"Ocultar":"Mostrar"}</button></div></label>
     {mode==="login"&&<p className="auth-support-note">Recuperação de senha será habilitada após a configuração do e-mail transacional.</p>}
     {message&&<p role={failed?"alert":"status"} className={failed?"auth-error":"auth-message"}>{message}</p>}
     <button className="auth-submit" disabled={busy}>{busy?"Aguarde…":mode==="signup"?"Criar conta":"Entrar"}</button>
    </form>
    <div className="auth-footer"><button className="auth-link" disabled={busy} onClick={()=>change(mode==="login"?"signup":"login")}>{mode==="login"?"Não tem conta? Criar conta":"Já tem conta? Entrar"}</button></div>
   </div>
  </section>
 </main>;
}
