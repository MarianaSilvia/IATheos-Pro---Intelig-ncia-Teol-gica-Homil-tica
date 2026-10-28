import fs from 'node:fs';
const p=JSON.parse(fs.readFileSync('package.json','utf8'));p.scripts['supabase:test']='supabase db query --local --file supabase/tests/access.sql';fs.writeFileSync('package.json',JSON.stringify(p,null,2)+'\n');
fs.renameSync('supabase/migrations/20261027213846_qi_store_pro.sql','supabase/migrations/20261027214436_qi_store_pro.sql');
fs.renameSync('supabase/migrations/20261027214510_harden_catalog_validation.sql','supabase/migrations/20261027214614_harden_catalog_validation.sql');
