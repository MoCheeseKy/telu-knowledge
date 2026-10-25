import CollectionCard, { CollectionItem } from "./CollectionCard";

const collections: CollectionItem[] = [
  { id: 1, author: "sofiamnhrk", authorInitial: "S", title: "Skripsi & Riset", storyCount: 4, isPrivate: true, image:"/images/persona-c4.jpg" },
  { id: 2, author: "sofiamnhrk", authorInitial: "S", title: "Ide Projek", storyCount: 4, isPrivate: true, image:"/images/persona-c4.jpg" },
  { id: 3, author: "sofiamnhrk", authorInitial: "S", title: "Ide Projek", storyCount: 4, isPrivate: true, image:"/images/persona-c4.jpg" },
];

export default function HomeTab() {
  return (
    <div className="flex flex-col gap-6 py-6">
      {collections.map((item) => (
        <CollectionCard key={item.id} item={item} />
      ))}
    </div>
  );
}