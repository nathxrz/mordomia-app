export default function formatDate(dateString) {
  if (!dateString) return "";
  const date = dateString instanceof Date ? dateString : new Date(dateString);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
