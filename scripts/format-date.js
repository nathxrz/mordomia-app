export default function formatDate(dateInput) {
  if (!dateInput) return "";

  if (dateInput instanceof Date) {
  } else if (typeof dateInput === "string") {
    const parts = dateInput.split("-");
    if (parts.length !== 3) return "";
    const [year, month, day] = parts;

    return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
  } else {
    return "";
  }
}
