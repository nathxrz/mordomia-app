import errorMessages from "../locales/pt-br/errors.json";

export default function translateError(code) {
  return errorMessages[code] || "Ocorreu um erro inesperado. Tente novamente.";
}
