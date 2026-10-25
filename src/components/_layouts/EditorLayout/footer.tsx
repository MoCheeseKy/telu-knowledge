import Wrapper from "@/components/_shared/Wrapper";

export default function EditorFooter() {
  return (
    <footer className="w-full border-t border-[var(--dust)] bg-[var(--background)] mt-auto py-3">
      <Wrapper backgroundColor="bg-transparent">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[var(--muted)]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse" />
            <span>Perubahan tersimpan otomatis di draft lokal</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden md:inline">
              Format tulisan mendukung Markdown & Media
            </span>
            <span>Tel-U Knowledge Studio © {new Date().getFullYear()}</span>
          </div>
        </div>
      </Wrapper>
    </footer>
  );
}
