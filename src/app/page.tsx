import { redirect } from "next/navigation";

/** Halaman root aplikasi yang mengarahkan pengguna langsung ke beranda (`/home`). */
export default function RootPage() {
  redirect("/home");
}
