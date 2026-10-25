import {headers} from "next/headers";
import {put} from "@vercel/blob";
import {auth} from "@/lib/auth";

export async function POST(request:Request){
 const session=await auth.api.getSession({headers:await headers()});
 if(!session?.user.id)return Response.json({error:"Não autorizado."},{status:401});
 const form=await request.formData();
 const file=form.get("file");
 const itemId=String(form.get("itemId")??"");
 if(!(file instanceof File)||!itemId)return Response.json({error:"Arquivo inválido."},{status:400});
 if(!file.type.startsWith("image/"))return Response.json({error:"Envie uma imagem."},{status:400});
 if(file.size>4*1024*1024)return Response.json({error:"A imagem deve ter no máximo 4 MB."},{status:400});
 const extension=file.type==="image/png"?"png":file.type==="image/webp"?"webp":"jpg";
 const pathname=`finance/${session.user.id}/${itemId}.${extension}`;
 const blob=await put(pathname,file,{access:"private",addRandomSuffix:false});
 return Response.json({url:`/api/finance/photo?path=${encodeURIComponent(blob.pathname)}`});
}
