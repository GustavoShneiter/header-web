import {headers} from "next/headers";
import {auth} from "@/lib/auth";
import {getDatabase} from "@/lib/database";

type Table="header_tasks"|"header_events"|"header_habits"|"header_challenges"|"header_finance_items"|"header_profiles";

async function currentUserId(){
 const session=await auth.api.getSession({headers:await headers()});
 return session?.user.id??null;
}

function badRequest(message:string,status=400){return Response.json({error:message},{status});}

export async function GET(){
 const ownerId=await currentUserId();
 if(!ownerId)return badRequest("Não autorizado.",401);
 const sql=getDatabase();
 const [tasks,events,habits,challenges,finance,profiles]=await Promise.all([
  sql`select * from header_tasks where owner_id=${ownerId} order by position asc`,
  sql`select * from header_events where owner_id=${ownerId} order by date asc,time asc`,
  sql`select * from header_habits where owner_id=${ownerId} order by created_at asc`,
  sql`select * from header_challenges where owner_id=${ownerId} order by created_at asc`,
  sql`select * from header_finance_items where owner_id=${ownerId} order by created_at desc`,
  sql`select * from header_profiles where id=${ownerId} limit 1`,
 ]);
 return Response.json({tasks,events,habits,challenges,finance,profile:profiles[0]??null});
}

export async function POST(request:Request){
 const ownerId=await currentUserId();
 if(!ownerId)return badRequest("Não autorizado.",401);
 const body=await request.json().catch(()=>null) as {table?:Table;rows?:Record<string,unknown>[]} | null;
 if(!body?.table||!Array.isArray(body.rows)||!body.rows.length)return badRequest("Dados inválidos.");
 if(body.rows.length>250)return badRequest("Muitos itens em uma única operação.");
 const sql=getDatabase();
 for(const source of body.rows){
  if(body.table==="header_tasks"){
   await sql`insert into header_tasks (id,owner_id,parent_id,is_parent,title,weekday,period,completed,position,description,due_time,kind,background,text_color,accent,updated_at) values (${String(source.id)},${ownerId},${source.parent_id?String(source.parent_id):null},${Boolean(source.is_parent)},${String(source.title??"")},${Number(source.weekday??0)},${String(source.period??"morning")},${Boolean(source.completed)},${Number(source.position??0)},${String(source.description??"")},${String(source.due_time??"")},${String(source.kind??"check")},${String(source.background??"")},${String(source.text_color??"")},${String(source.accent??"")},now()) on conflict (id) do update set parent_id=excluded.parent_id,is_parent=excluded.is_parent,title=excluded.title,weekday=excluded.weekday,period=excluded.period,completed=excluded.completed,position=excluded.position,description=excluded.description,due_time=excluded.due_time,kind=excluded.kind,background=excluded.background,text_color=excluded.text_color,accent=excluded.accent,updated_at=now() where header_tasks.owner_id=${ownerId}`;
  }else if(body.table==="header_events"){
   await sql`insert into header_events (id,owner_id,title,date,time,type,description,color,completed,updated_at) values (${String(source.id)},${ownerId},${String(source.title??"")},${String(source.date??"")},${String(source.time??"")},${String(source.type??"")},${String(source.description??"")},${String(source.color??"")},${Boolean(source.completed)},now()) on conflict (id) do update set title=excluded.title,date=excluded.date,time=excluded.time,type=excluded.type,description=excluded.description,color=excluded.color,completed=excluded.completed,updated_at=now() where header_events.owner_id=${ownerId}`;
  }else if(body.table==="header_habits"){
   await sql`insert into header_habits (id,owner_id,title,goal,days,completions,color,archived) values (${String(source.id)},${ownerId},${String(source.title??"")},${String(source.goal??"")},${(source.days as number[])??[]},${(source.completions as string[])??[]},${String(source.color??"")},${Boolean(source.archived)}) on conflict (id) do update set title=excluded.title,goal=excluded.goal,days=excluded.days,completions=excluded.completions,color=excluded.color,archived=excluded.archived where header_habits.owner_id=${ownerId}`;
  }else if(body.table==="header_challenges"){
   await sql`insert into header_challenges (id,owner_id,title,situation,desired,strategy,checks,archived) values (${String(source.id)},${ownerId},${String(source.title??"")},${String(source.situation??"")},${String(source.desired??"")},${String(source.strategy??"")},${JSON.stringify(source.checks??[])},${Boolean(source.archived)}) on conflict (id) do update set title=excluded.title,situation=excluded.situation,desired=excluded.desired,strategy=excluded.strategy,checks=excluded.checks,archived=excluded.archived where header_challenges.owner_id=${ownerId}`;
  }else if(body.table==="header_finance_items"){
   await sql`insert into header_finance_items (id,owner_id,kind,title,category,amount,description,product_url,photo_url,updated_at) values (${String(source.id)},${ownerId},${String(source.kind??"planned")},${String(source.title??"")},${String(source.category??"")},${Number(source.amount??0)},${String(source.description??"")},${String(source.product_url??"")},${String(source.photo_url??"")},now()) on conflict (id) do update set kind=excluded.kind,title=excluded.title,category=excluded.category,amount=excluded.amount,description=excluded.description,product_url=excluded.product_url,photo_url=excluded.photo_url,updated_at=now() where header_finance_items.owner_id=${ownerId}`;
  }else if(body.table==="header_profiles"){
   await sql`insert into header_profiles (id,display_name,preferences,updated_at) values (${ownerId},${String(source.display_name??"")},${JSON.stringify(source.preferences??{})},now()) on conflict (id) do update set display_name=excluded.display_name,preferences=excluded.preferences,updated_at=now()`;
  }else return badRequest("Tabela inválida.");
 }
 return Response.json({ok:true});
}

export async function DELETE(request:Request){
 const ownerId=await currentUserId();
 if(!ownerId)return badRequest("Não autorizado.",401);
 const url=new URL(request.url);
 const table=url.searchParams.get("table") as Table|null;
 const id=url.searchParams.get("id");
 if(!id||!table)return badRequest("Item inválido.");
 const sql=getDatabase();
 if(table==="header_tasks")await sql`delete from header_tasks where id=${id} and owner_id=${ownerId}`;
 else if(table==="header_events")await sql`delete from header_events where id=${id} and owner_id=${ownerId}`;
 else if(table==="header_finance_items")await sql`delete from header_finance_items where id=${id} and owner_id=${ownerId}`;
 else if(table==="header_habits")await sql`delete from header_habits where id=${id} and owner_id=${ownerId}`;
 else if(table==="header_challenges")await sql`delete from header_challenges where id=${id} and owner_id=${ownerId}`;
 else return badRequest("Tabela inválida.");
 return Response.json({ok:true});
}
