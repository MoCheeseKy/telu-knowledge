import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import RepostCard, { RepostItem } from "./RepostCard";
import ProfileSidebar from "./ProfileSidebar";

const reposts: RepostItem[] = [
  {
    id: 1,
    category: "Software Engineering",
    author: "Rifky Muhammad Prayudhi",
    date: "12 September 2026",
    title: "Apakah C4 akan menggantikan Diagram Conventional saat ini?",
    description:
      "You're going to see these in someone's toolkit next year and wonder why you didn't hear about them first. Here's your head start.",
    likes: "16,2k",
    comments: "16,2k",
    reposts: "16,2k",
    image: "/images/repost-cover.png",
  },
  {
    id: 2,
    category: "Software Engineering",
    author: "Rifky Muhammad Prayudhi",
    date: "12 September 2026",
    title: "Apakah C4 akan menggantikan Diagram Conventional saat ini?",
    description:
      "You're going to see these in someone's toolkit next year and wonder why you didn't hear about them first. Here's your head start.",
    likes: "16,2k",
    comments: "16,2k",
    reposts: "16,2k",
    image: "/images/repost-cover.png",
  },
  {
    id: 3,
    category: "Software Engineering",
    author: "Rifky Muhammad Prayudhi",
    date: "12 September 2026",
    title: "Apakah C4 akan menggantikan Diagram Conventional saat ini?",
    description:
      "You're going to see these in someone's toolkit next year and wonder why you didn't hear about them first. Here's your head start.",
    likes: "16,2k",
    comments: "16,2k",
    reposts: "16,2k",
    image: "/images/repost-cover.png",
  },
];

const triggerClass =
  "flex-none rounded-none border-0 border-b-2 border-transparent bg-transparent px-0 pb-2 text-gray-500 shadow-none data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:text-black data-[state=active]:shadow-none data-active:border-black data-active:bg-transparent data-active:text-black";

export default function Profiles() {
  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      <section className="min-w-0 flex-1">
        <h1 className="mb-6 font-serif text-4xl font-bold">sofiamnhrk</h1>

        <Tabs defaultValue="reposts">
          <TabsList className="h-auto w-full justify-start gap-6 rounded-none border-b bg-transparent p-0">
            <TabsTrigger value="home" className={triggerClass}>
              Home
            </TabsTrigger>
            <TabsTrigger value="reposts" className={triggerClass}>
              Reposts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home">
            <p className="py-6 text-sm text-gray-500">Konten tab Home</p>
          </TabsContent>

          <TabsContent value="reposts">
            {reposts.map((item) => (
              <RepostCard key={item.id} item={item} />
            ))}
          </TabsContent>
        </Tabs>
      </section>

      <ProfileSidebar />
    </div>
  );
}