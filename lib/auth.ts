import {betterAuth} from "better-auth";
import {nextCookies} from "better-auth/next-js";
import {Pool} from "pg";

const connectionString=process.env.DATABASE_URL;

if(!connectionString){
 throw new Error("DATABASE_URL não foi configurada. Conecte o projeto ao Neon pela Vercel e atualize as variáveis locais.");
}

export const auth=betterAuth({
 database:new Pool({connectionString,max:5}),
 emailAndPassword:{enabled:true,minPasswordLength:8},
 session:{cookieCache:{enabled:true,maxAge:5*60}},
 plugins:[nextCookies()],
});
