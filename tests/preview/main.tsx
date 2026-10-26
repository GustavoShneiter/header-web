import {createRoot} from "react-dom/client";
import type {AppUser} from "../../lib/app-user";
import Workspace from "../../components/workspace";
import {dateKey} from "../../lib/planner.mjs";
import "../../app/globals.css";
import "../../app/liquid-glass.css";
import "../../app/mature-workspace.css";

const user={id:"qa-user",email:"gustavo@example.test",name:"Gustavo",createdAt:"2026-01-01T00:00:00Z",provider:"email"} satisfies AppUser;
const query=new URLSearchParams(location.search);
const previewTheme=query.get("theme")==="dark"?"dark":"light";
const previewMotion=query.has("capture")?"off":"gentle";
const now=new Date();
const today=dateKey(now);
const weekday=now.getDay();
const id=()=>crypto.randomUUID();
const tasks=[
 {id:id(),owner_id:user.id,parent_id:null,is_parent:false,title:"Revisar prioridades da semana",weekday,period:"morning",completed:true,position:0,description:"Fechar as três entregas mais importantes",due_time:"08:30",kind:"check",background:"",text_color:"",accent:"#8268d8"},
 {id:id(),owner_id:user.id,parent_id:null,is_parent:false,title:"Finalizar proposta comercial",weekday,period:"morning",completed:false,position:1,description:"Ajustar escopo e valores",due_time:"10:00",kind:"check",background:"",text_color:"",accent:"#2877bb"},
 {id:id(),owner_id:user.id,parent_id:null,is_parent:false,title:"Treino funcional",weekday,period:"afternoon",completed:false,position:2,description:"50 minutos",due_time:"14:30",kind:"check",background:"",text_color:"",accent:"#218a78"},
 {id:id(),owner_id:user.id,parent_id:null,is_parent:false,title:"Leitura e notas",weekday,period:"evening",completed:false,position:3,description:"Capítulo 4",due_time:"19:00",kind:"check",background:"",text_color:"",accent:"#c68024"},
 {id:id(),owner_id:user.id,parent_id:null,is_parent:false,title:"Organizar documentos",weekday:(weekday+1)%7,period:"morning",completed:false,position:4,description:"",due_time:"09:00",kind:"check",background:"",text_color:"",accent:"#8268d8"},
 {id:id(),owner_id:user.id,parent_id:null,is_parent:false,title:"Planejar conteúdo",weekday:(weekday+2)%7,period:"afternoon",completed:true,position:5,description:"",due_time:"15:00",kind:"check",background:"",text_color:"",accent:"#b35382"},
];
const events=[
 {id:id(),owner_id:user.id,title:"Reunião de alinhamento",date:today,time:"11:30",type:"Trabalho",description:"Decisões da próxima etapa",color:"#8268d8",completed:false},
 {id:id(),owner_id:user.id,title:"Consulta",date:today,time:"16:40",type:"Pessoal",description:"",color:"#218a78",completed:false},
];
const habits=[
 {id:id(),owner_id:user.id,title:"Caminhar 30 minutos",goal:"Mover o corpo todos os dias",days:[0,1,2,3,4,5,6],completions:[today],color:"#218a78",archived:false},
 {id:id(),owner_id:user.id,title:"Ler 20 páginas",goal:"Aprender sem pressa",days:[1,2,3,4,5],completions:[],color:"#8268d8",archived:false},
];
const challenges=[{id:id(),owner_id:user.id,title:"Criar uma rotina sustentável",situation:"Muitos compromissos soltos",desired:"Terminar a semana com energia",strategy:"Proteger duas manhãs de trabalho profundo",checks:[],archived:false}];
const finance=[
 {id:id(),owner_id:user.id,kind:"income",title:"Receita principal",category:"Trabalho",amount:8500,description:"",product_url:"",photo_url:""},
 {id:id(),owner_id:user.id,kind:"bill",title:"Moradia",category:"Casa",amount:2400,description:"Vencimento dia 8",product_url:"",photo_url:""},
 {id:id(),owner_id:user.id,kind:"bill",title:"Serviços",category:"Assinaturas",amount:380,description:"",product_url:"",photo_url:""},
 {id:id(),owner_id:user.id,kind:"planned",title:"Cadeira de trabalho",category:"Escritório",amount:1600,description:"Comparar ergonomia e prazo",product_url:"",photo_url:""},
];
const data={tasks,events,habits,challenges,finance,profile:{display_name:"Gustavo",preferences:{theme:previewTheme,accent:"violet",glass:"balanced",motion:previewMotion,weekStart:1,showCompleted:true,compact:false,focus:"Concluir o essencial sem lotar todos os espaços.",defaultPeriod:"morning"}}};

window.fetch=async(input,init)=>{
 const url=String(input);
 if(url.includes("/api/workspace"))return new Response(JSON.stringify(init?.method==="POST"||init?.method==="DELETE"?{ok:true}:data),{status:200,headers:{"content-type":"application/json"}});
 return new Response(JSON.stringify({ok:true}),{status:200,headers:{"content-type":"application/json"}});
};

const root=createRoot(document.getElementById("root")!);
if(query.has("mobile")){
 root.render(<main style={{minHeight:"100vh",display:"grid",placeItems:"center",padding:24,background:"#d8d5cc"}}><iframe title="Header em 390 por 844" src={`/?embed=1&theme=${previewTheme}${query.has("capture")?"&capture=1":""}`} style={{width:390,height:844,border:0,borderRadius:24,background:previewTheme==="dark"?"#0d0e0d":"#efede5",boxShadow:"0 24px 70px rgb(0 0 0 / .18)"}}/></main>);
}else{
 root.render(<Workspace user={user}/>);
 window.setTimeout(()=>{
  const view=query.get("view");
  if(view)document.querySelector<HTMLButtonElement>(`[aria-label="Abrir ${view}"]`)?.click();
  if(query.has("profile"))document.querySelector<HTMLButtonElement>(".app-profile-trigger")?.click();
 },800);
}
