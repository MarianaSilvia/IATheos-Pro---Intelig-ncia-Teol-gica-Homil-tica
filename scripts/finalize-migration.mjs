import fs from 'node:fs';
const edit=(p,f)=>fs.writeFileSync(p,f(fs.readFileSync(p,'utf8')));
edit('src/server/http.ts',s=>s.replace('): T {','): NonNullable<T> {').replace('return result.data;','return result.data as NonNullable<T>;'));
edit('src/components/AdminPanelView.tsx',s=>s.replaceAll('setFile(null);','setDownloadUrl("");'));
edit('supabase/config.toml',s=>s.replace('project_id = "projeto"','project_id = "qi-store-pro"').replace('enabled = true\n# Specifies an ordered list of seed','enabled = false\n# Specifies an ordered list of seed').replace('sql_paths = ["./seed.sql"]','sql_paths = []'));
edit('.gitignore',s=>s+'\nsupabase/.temp/\nsupabase/.branches/\n');
