import { redirect } from "next/navigation";

export default function CreateForumPage() {
  redirect("/my-forums?create=true");
}