export function formatBirthPlaceDate(birthPlaceDate: string | null | undefined): string {
  if (!birthPlaceDate) return "";
  const parts = birthPlaceDate.split(", ");
  const place = parts[0] || "";
  const dateStr = parts[1] || "";
  if (!dateStr) return place;

  // try parsing dateStr as YYYY-MM-DD
  const dateParts = dateStr.split("-");
  if (dateParts.length === 3) {
    const year = dateParts[0];
    const monthIndex = parseInt(dateParts[1], 10) - 1;
    const day = parseInt(dateParts[2], 10);

    const months = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];

    if (monthIndex >= 0 && monthIndex < 12 && !isNaN(day)) {
      return `${place}, ${day} ${months[monthIndex]} ${year}`;
    }
  }

  return birthPlaceDate;
}
