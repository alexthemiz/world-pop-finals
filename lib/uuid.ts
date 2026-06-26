const KEY = "tk-uuid";

export function getOrCreateUUID(): string {
  if (typeof localStorage === "undefined") return "";
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(KEY, id);
  }
  return id;
}
