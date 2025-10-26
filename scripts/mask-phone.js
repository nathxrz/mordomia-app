export default function maskPhone(phone) {
  if (!phone) return "";
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
}
