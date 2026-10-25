import {randomBytes,randomUUID} from "node:crypto";
import {Pool} from "pg";

const base="http://localhost:2000";
const email=`header-e2e-${Date.now()}@example.test`;
const password=randomBytes(18).toString("base64url");
const taskId=randomUUID();
let userId="";

async function json(response){
 const body=await response.json().catch(()=>({}));
 if(!response.ok)throw new Error(`${response.status} ${body?.message??body?.error??"Falha na requisição"}`);
 return body;
}

const commonHeaders={"content-type":"application/json",origin:base};
const pool=new Pool({connectionString:process.env.DATABASE_URL,max:1});
try{
 const signup=await fetch(`${base}/api/auth/sign-up/email`,{
  method:"POST",headers:commonHeaders,body:JSON.stringify({name:"Validação Header",email,password,callbackURL:"/"}),
 });
 const account=await json(signup);
 userId=account.user?.id??account.data?.user?.id??"";
 const cookie=signup.headers.getSetCookie().map(value=>value.split(";")[0]).join("; ");
 if(!userId||!cookie)throw new Error("Cadastro não retornou usuário e sessão.");

 const session=await json(await fetch(`${base}/api/auth/get-session`,{headers:{cookie,origin:base}}));
 if(session.user?.id!==userId)throw new Error("Sessão não corresponde ao usuário criado.");

 await json(await fetch(`${base}/api/workspace`,{
  method:"POST",headers:{...commonHeaders,cookie},body:JSON.stringify({table:"header_tasks",rows:[{
   id:taskId,owner_id:"ignorado-no-servidor",parent_id:null,is_parent:false,title:"Teste de integração",weekday:0,period:"morning",completed:false,position:0,description:"",due_time:"",kind:"check",background:"",text_color:"",accent:"#8b70db",
  }]}),
 }));
 const workspace=await json(await fetch(`${base}/api/workspace`,{headers:{cookie,origin:base}}));
 if(!workspace.tasks?.some(task=>task.id===taskId&&task.owner_id===userId))throw new Error("A tarefa não voltou do Neon com o proprietário correto.");

 await json(await fetch(`${base}/api/workspace?table=header_tasks&id=${taskId}`,{method:"DELETE",headers:{cookie,origin:base}}));
 console.log("Fluxo verificado: cadastro → sessão → API → Neon → resposta → exclusão.");
}finally{
 if(userId){
  for(const table of ["header_tasks","header_events","header_habits","header_challenges","header_finance_items"]){
   await pool.query(`delete from ${table} where owner_id = $1`,[userId]);
  }
  await pool.query("delete from header_profiles where id = $1",[userId]);
  await pool.query('delete from "user" where id = $1',[userId]);
 }
 await pool.end();
}
