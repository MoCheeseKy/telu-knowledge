import { ChevronRight } from "lucide-react";

const communities = [
  { id: 1, name: "Game Dev +++", desc: "Cari Kulineran Telkom yang wa...", members: "128.000 Anggota" },
  { id: 2, name: "Game Dev +++", desc: "Cari Kulineran Telkom yang wa...", members: "128.000 Anggota" },
  { id: 3, name: "Game Dev +++", desc: "Cari Kulineran Telkom yang wa...", members: "128.000 Anggota" },
  { id: 4, name: "Game Dev +++", desc: "Cari Kulineran Telkom yang wa...", members: "128.000 Anggota" },
];

export default function ProfileSidebar() {
  return (
    <aside className="w-full lg:w-72 lg:shrink-0 lg:border-l lg:pl-8">
      <div className="mb-4 flex size-20 items-center justify-center rounded-full bg-blue-700 text-3xl text-white">
        S
      </div>

      <p className="font-semibold">sofiamnhrk</p>
      <p className="mb-4 text-xs text-gray-500">142 Pengikut · 89 Mengikuti</p>
      <p className="mb-4 text-xs text-gray-600">
        Software Engineering student @ Telkom University. Ingin Jadi Programmer
        Handal, Namun enggan Ngoding
      </p>
      <button className="mb-6 text-xs text-green-700">Edit profile</button>

      <div className="border-t pt-6">
        <h3 className="mb-4 text-sm font-semibold text-red-600">
          KOMUNITAS AKTIF
        </h3>

        <div className="flex flex-col gap-4">
          {communities.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm font-semibold">{item.name}</p>
                <p className="truncate text-xs text-gray-600">{item.desc}</p>
                <p className="text-[10px] text-gray-500">{item.members}</p>
              </div>
              <button className="shrink-0 text-xs font-medium">Mengikuti</button>
            </div>
          ))}
        </div>

        <button className="mt-6 flex items-center gap-1 text-xs text-gray-600">
          Lihat semua komunitas yang diikuti
          <ChevronRight className="size-3" />
        </button>
      </div>
    </aside>
  );
}