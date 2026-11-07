"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import RepostCard, { RepostItem } from "./RepostCard";
import ProfileSidebar from "./ProfileSidebar";
import HomeTab from "./HomeTab";
import { ProfileProvider, useProfile } from "./profile.context";

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

function ProfilesContent() {
  const { profile } = useProfile();

  return (
    <div className="flex flex-col gap-8 lg:flex-row py-4">
      <section className="min-w-0 flex-1">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[var(--foreground)] tracking-tight">
            {profile.fullName || profile.username}
          </h1>
        </div>

        <Tabs defaultValue="home">
          <TabsList className="h-auto w-full justify-start gap-6 rounded-none border-b border-[var(--dust)] bg-transparent p-0">
            <TabsTrigger value="home" className={triggerClass}>
              Home
            </TabsTrigger>
            <TabsTrigger value="reposts" className={triggerClass}>
              Reposts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home">
            <HomeTab />
          </TabsContent>

          <TabsContent value="reposts">
            <div className="flex flex-col gap-6 py-6">
              {reposts.map((item) => (
                <RepostCard key={item.id} item={item} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>

      <ProfileSidebar />
    </div>
  );
}

export default function Profiles() {
  return (
    <ProfileProvider>
      <ProfilesContent />
    </ProfileProvider>
  );
}
