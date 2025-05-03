export function getLanguageId(): number {
  const id = localStorage.getItem("languageId");
  return id ? Number(id) : 1;
}
