import {headers} from "next/headers";
import {get} from "@vercel/blob";
import {auth} from "@/lib/auth";

export async function GET(request:Request){
 const session=await auth.api.getSession({headers:await headers()});
 if(!session?.user.id)return new Response("Não autorizado.",{status:401});
 const pathname=new URL(request.url).searchParams.get("path")??"";
 if(!pathname.startsWith(`finance/${session.user.id}/`))return new Response("Não autorizado.",{status:403});
 const result=await get(pathname,{access:"private"});
 if(!result||result.statusCode!==200)return new Response("Imagem não encontrada.",{status:404});
 const responseHeaders=new Headers({
  "content-type":result.blob.contentType,
  "cache-control":"private, max-age=300",
  "x-content-type-options":"nosniff",
  etag:result.blob.etag,
 });
 return new Response(result.stream,{headers:responseHeaders});
}
