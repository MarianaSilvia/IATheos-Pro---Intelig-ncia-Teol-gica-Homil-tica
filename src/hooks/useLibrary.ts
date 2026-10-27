import { api } from "../lib/api";
import { useResource } from "./useResource";
import type { SavedItem } from "../components/SavedLibraryView";
export function useLibrary() {
  const resource = useResource<SavedItem[]>("/studies", []);
  const remove = async (id: string) => {
    await api(`/studies/${id}`, { method: "DELETE" });
    await resource.reload();
  };
  const save = async (type: SavedItem["type"], data: SavedItem["data"]) => {
    await api(`/studies/${data.id}`, {
      method: "PUT",
      body: JSON.stringify({ type, data }),
    });
    await resource.reload();
  };
  return { ...resource, remove, save };
}
