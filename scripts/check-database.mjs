import {Pool} from "pg";

if(!process.env.DATABASE_URL)throw new Error("DATABASE_URL não foi configurada.");
const expected=["account","header_challenges","header_events","header_finance_items","header_habits","header_profiles","header_tasks","session","user","verification"];
const pool=new Pool({connectionString:process.env.DATABASE_URL,max:1});
try{
 const result=await pool.query("select table_name from information_schema.tables where table_schema = 'public' and table_name = any($1::text[]) order by table_name",[expected]);
 const present=result.rows.map(row=>row.table_name);
 const missing=expected.filter(name=>!present.includes(name));
 if(missing.length)throw new Error(`Tabelas ausentes: ${missing.join(", ")}`);
 console.log(`Banco verificado: ${present.length} tabelas essenciais disponíveis.`);
}finally{
 await pool.end();
}
