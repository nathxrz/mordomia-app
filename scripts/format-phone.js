export function formatPhone(phone) {
  if (!phone) return "";

  // Remove tudo que não é número
  const digits = phone.replace(/\D/g, "");

  // Celular com 11 dígitos: (DD) 9XXXX-XXXX
  if (digits.length === 11) {
    return digits.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, "($1) $2$3-$4");
  }

  // Telefone fixo com 10 dígitos: (DD) XXXX-XXXX
  if (digits.length === 10) {
    return digits.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }

  // Caso não bata, retorna apenas os números
  return digits;
}
