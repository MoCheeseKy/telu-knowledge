const idDateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const idDateTimeFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

/**
 * Memformat string tanggal ISO menjadi format tanggal panjang Indonesia (misal: "12 September 2026").
 *
 * @param dateString - String tanggal ISO.
 * @returns String tanggal terformat atau string kosong jika tidak tersedia.
 */
export function formatDate(dateString?: string | null): string {
  if (!dateString) return "";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return idDateFormatter.format(d);
  } catch {
    return dateString;
  }
}

/**
 * Memformat string tanggal ISO menjadi tanggal singkat beserta jam (misal: "9 Okt 2024, 08.30").
 *
 * @param dateString - String tanggal ISO.
 * @returns String tanggal dan waktu terformat atau string kosong jika tidak tersedia.
 */
export function formatDateTime(dateString?: string | null): string {
  if (!dateString) return "";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return idDateTimeFormatter.format(d);
  } catch {
    return dateString;
  }
}

/**
 * Memformat angka statistik (likes, comments, reposts) menjadi ringkas (misal: 16200 -> "16,2k").
 *
 * @param count - Jumlah hitungan statistik.
 * @returns Representasi string angka ringkas (default: `"0"`).
 */
export function formatCounter(count?: number | null): string {
  if (typeof count !== "number" || isNaN(count)) return "0";
  if (count >= 1000) {
    const formatted = (count / 1000).toFixed(1).replace(".", ",");
    return `${formatted}k`;
  }
  return String(count);
}
