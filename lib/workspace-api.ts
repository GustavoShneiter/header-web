import type {FinanceItem} from "@/lib/workspace-types";

export const workspaceSections=[
 {key:"tasks",table:"header_tasks",label:"Tarefas"},
 {key:"events",table:"header_events",label:"Calendário"},
 {key:"habits",table:"header_habits",label:"Hábitos"},
 {key:"challenges",table:"header_challenges",label:"Desafios"},
 {key:"finance",table:"header_finance_items",label:"Financeiro"},
 {key:"profile",table:"header_profiles",label:"Perfil"},
] as const;

async function responseJson(response:Response){
 const data=await response.json().catch(()=>({})) as {error?:string;[key:string]:unknown};
 if(!response.ok)throw new Error(data.error||"Não foi possível sincronizar seus dados.");
 return data;
}

export function syncErrorMessage(error:unknown){
 return error instanceof Error?error.message:"Não foi possível conectar. Tente novamente.";
}

export async function loadWorkspace(){
 try{
  const data:any=await responseJson(await fetch("/api/workspace",{cache:"no-store"}));
  return workspaceSections.map(section=>({
   ...section,
   data:section.key==="profile"?data.profile:data[section.key],
   error:null,
  }));
 }catch(error){
  return workspaceSections.map(section=>({...section,data:null,error}));
 }
}

export async function saveWorkspaceRows(table:string,rows:unknown[]){
 await responseJson(await fetch("/api/workspace",{
  method:"POST",
  headers:{"content-type":"application/json"},
  body:JSON.stringify({table,rows}),
 }));
}

export async function deleteWorkspaceRow(table:string,id:string){
 const query=new URLSearchParams({table,id});
 await responseJson(await fetch(`/api/workspace?${query}`,{method:"DELETE"}));
}

export async function uploadFinancePhoto(item:FinanceItem,file:File){
 const form=new FormData();
 form.set("itemId",item.id);
 form.set("file",file);
 const data=await responseJson(await fetch("/api/finance/upload",{method:"POST",body:form}));
 return String(data.url??"");
}
