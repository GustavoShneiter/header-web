import {neon,type NeonQueryFunction} from "@neondatabase/serverless";

let database:NeonQueryFunction<false,false>|null=null;

export function getDatabase(){
 if(database)return database;
 const connectionString=process.env.DATABASE_URL;
 if(!connectionString)throw new Error("DATABASE_URL não foi configurada.");
 database=neon(connectionString);
 return database;
}
