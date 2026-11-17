import type { CommunityPostDto } from "@/services/communities/community-posts.types";
import type { CommunityDetail } from "../CommunityDetail/community-detail.types";

/** Properti untuk tampilan pembuatan atau penyuntingan postingan komunitas. */
export interface CommunityPostCreateViewProps {
  community: CommunityDetail;
  /** "create" (default) untuk postingan baru; "edit" untuk menyunting postingan milik sendiri. */
  mode?: "create" | "edit";
  /** Data awal postingan — wajib untuk mode "edit". */
  initialPost?: CommunityPostDto;
}

/** Properti untuk sidebar panduan penulisan dan aturan komunitas. */
export interface PostGuidelinesSidebarProps {
  community: CommunityDetail;
}
