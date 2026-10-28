import fs from 'node:fs';
const p='supabase/tests/access.sql';let s=fs.readFileSync(p,'utf8');
s=s.replace(/select public.save_product\('paid',([^\n]+)\);/,"select set_config('test.paid',public.save_product(null,$1),true);");
s=s.replace(/select public.save_product\('free',([^\n]+)\);/,"select set_config('test.free',public.save_product(null,$1),true);");
s=s.replaceAll("'paid'","current_setting('test.paid')").replaceAll("'free'","current_setting('test.free')");
fs.writeFileSync(p,s);
