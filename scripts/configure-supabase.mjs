import fs from 'node:fs';
const p='supabase/config.toml';let s=fs.readFileSync(p,'utf8');s=s.replace('[storage]\nenabled = true','[storage]\nenabled = false').replace('additional_redirect_urls = ["https://127.0.0.1:3000"]','additional_redirect_urls = ["http://127.0.0.1:3000", "http://localhost:3000"]');fs.writeFileSync(p,s);
