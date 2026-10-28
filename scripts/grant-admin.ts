import { config } from "../src/server/config.ts";
import { serviceDatabase } from "../src/server/supabase.ts";
import { z } from "zod";
const uid=z.uuid().parse(process.argv[2]);
if(!config.local&&!process.argv.includes("--remote"))throw new Error("Use --remote explicitamente para QI Store Pro após conferir o UID.");
const db=serviceDatabase();const {data,error}=await db.auth.admin.getUserById(uid);
if(error||!data.user)throw new Error("Usuário não cadastrado.");
const result=await db.from("app_admins").upsert({user_id:uid});if(result.error)throw result.error;
console.log(`Permissão administrativa concedida a ${uid}.`);
