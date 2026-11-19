/**
 * Menyalin teks ke clipboard dengan fallback textarea untuk konteks non-HTTPS/lama.
 *
 * @param text - Teks yang akan disalin ke clipboard.
 * @returns `true` jika berhasil, atau `false` jika gagal tanpa melempar exception.
 */
export async function copyTextToClipboard(text: string): Promise<boolean> {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return false;
  }

  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.setAttribute("readonly", "");
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textArea);
    return ok;
  } catch {
    return false;
  }
}
