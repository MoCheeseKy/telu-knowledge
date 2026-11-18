import EditProfileView from "@/components/_views/Profiles/EditProfileView";

/** Metadata statis untuk halaman Ubah Profil. */
export const metadata = {
  title: "Ubah Profil | Tel-U Knowledge",
  description: "Pengaturan dan ubah profil pengguna Tel-U Knowledge",
};

/** Halaman untuk mengubah informasi profil pengguna. */
export default function EditProfilePage() {
  return <EditProfileView />;
}

