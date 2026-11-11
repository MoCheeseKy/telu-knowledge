"use client";

import { useState } from "react";
import { Heart, MessageCircle, UserRound } from "lucide-react";

interface OtherProfileProps {
  username: string;
}

const users = {
  adityapratama: {
    name: "Aditya Pratama",
    username: "adityapratama",
    bio: "Software Engineering Student. Passionate about technology and software development.",
    posts: 24,
    followers: 320,
    following: 180,
    role: "Software Engineering Student",
  },
  budi: {
    name: "Budi Santoso",
    username: "budi",
    bio: "Learning, sharing, and growing together.",
    posts: 12,
    followers: 150,
    following: 90,
    role: "Student",
  },
};

export default function OtherProfile({
  username,
}: OtherProfileProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");

  const user = users[username as keyof typeof users];

  if (!user) {
    return (
      <div className="mx-auto max-w-5xl p-8 text-center">
        <h2 className="text-xl font-semibold">
          User tidak ditemukan
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Profil yang kamu cari tidak tersedia.
        </p>
      </div>
    );
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">

      {/* PROFILE HEADER */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

          {/* AVATAR */}
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-blue-100">
            <UserRound size={42} className="text-blue-600" />
          </div>

          {/* USER INFORMATION */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">
              {user.name}
            </h1>

            <p className="text-sm text-gray-500">
              @{user.username}
            </p>

            <p className="mt-2 text-sm text-gray-600">
              {user.role}
            </p>

            <p className="mt-3 text-sm text-gray-700">
              {user.bio}
            </p>
          </div>

        </div>

        {/* STATISTICS */}
        <div className="mt-6 flex gap-8 border-t border-gray-100 pt-5">

          <div>
            <p className="font-bold">{user.posts}</p>
            <p className="text-sm text-gray-500">Posts</p>
          </div>

          <div>
            <p className="font-bold">
              {user.followers + (isFollowing ? 1 : 0)}
            </p>
            <p className="text-sm text-gray-500">Followers</p>
          </div>

          <div>
            <p className="font-bold">{user.following}</p>
            <p className="text-sm text-gray-500">Following</p>
          </div>

        </div>

        {/* ACTION BUTTONS */}
        <div className="mt-6 flex gap-3">

          <button
            onClick={() => setIsFollowing(!isFollowing)}
            className="rounded-lg bg-[var(--primary)] px-6 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            {isFollowing ? "Following" : "Follow"}
          </button>

          <button
            className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Message
          </button>

        </div>

      </section>

      {/* PROFILE TABS */}
      <section className="mt-8">

        <div className="flex gap-8 border-b border-gray-200">

          <button
            onClick={() => setActiveTab("posts")}
            className={`pb-3 text-sm font-semibold ${
              activeTab === "posts"
                ? "border-b-2 border-[var(--primary)] text-[var(--primary)]"
                : "text-gray-500"
            }`}
          >
            Posts
          </button>

          <button
            onClick={() => setActiveTab("about")}
            className={`pb-3 text-sm font-semibold ${
              activeTab === "about"
                ? "border-b-2 border-[var(--primary)] text-[var(--primary)]"
                : "text-gray-500"
            }`}
          >
            About
          </button>

        </div>

        {activeTab === "posts" ? (
          <div className="mt-6 grid gap-4">

            <article className="rounded-xl border border-gray-200 bg-white p-5">
              <h3 className="font-semibold text-gray-900">
                Welcome to my profile!
              </h3>

              <p className="mt-2 text-sm text-gray-600">
                Sharing knowledge and learning new things
                with the Telu Knowledge community.
              </p>

              <div className="mt-4 flex gap-5 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Heart size={16} /> Likes
                </span>

                <span className="flex items-center gap-1">
                  <MessageCircle size={16} /> Comments
                </span>
              </div>
            </article>

          </div>
        ) : (
          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5">
            <h3 className="font-semibold">About</h3>
            <p className="mt-2 text-sm text-gray-600">
              {user.bio}
            </p>
          </div>
        )}

      </section>

    </main>
  );
}
