import {readFile} from "node:fs/promises";
import {Pool} from "pg";

if(!process.env.DATABASE_URL)throw new Error("DATABASE_URL não foi configurada.");
const sql=await readFile(new URL("../db/neon.sql",import.meta.url),"utf8");
const pool=new Pool({connectionString:process.env.DATABASE_URL,max:1});
try{
 await pool.query(sql);
 console.log("Estrutura do workspace aplicada no Neon.");
}finally{
 await pool.end();
}
