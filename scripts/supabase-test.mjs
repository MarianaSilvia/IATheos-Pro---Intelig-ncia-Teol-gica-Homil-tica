import { spawnSync } from "node:child_process";
import path from "node:path";

const command = process.platform === "win32" ? "supabase.cmd" : "supabase";
const result = spawnSync(command, ["db", "query", "--local", "--file", path.resolve("supabase/tests/access.sql")], { encoding: "utf8", stdio: "inherit" });

if (result.error?.code === "ENOENT") {
  console.error("Supabase CLI não encontrada. Instale a CLI antes de executar os testes locais.");
  process.exit(1);
}

if (result.status !== 0) {
  console.error("\nNão foi possível executar os testes SQL locais.");
  console.error("Verifique se Docker/Podman está ativo e execute: supabase start");
  process.exit(result.status ?? 1);
}
