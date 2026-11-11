import type { JSONContent } from "@tiptap/react";
import type { CommunityPost } from "@/components/_views/CommunityDetail/types";

const DRAFT_PREFIX = "telu:community-post-draft:";
const POSTS_PREFIX = "telu:community-posts:";

export interface CommunityPostDraft {
  title: string;
  body: string;
  content: JSONContent;
  tags: string[];
  savedAt: string;
}

const EMPTY_POSTS: CommunityPost[] = [];
const postsSnapshotCache = new Map<
  string,
  { raw: string | null; posts: CommunityPost[] }
>();

const draftPresenceCache = new Map<
  string,
  { raw: string | null; hasDraft: boolean }
>();
const draftListeners = new Set<() => void>();

function emitDraftChange(): void {
  draftPresenceCache.clear();
  draftListeners.forEach((listener) => listener());
}

function getStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function readRaw(key: string): string | null {
  const storage = getStorage();
  if (!storage) {
    return null;
  }

  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

function readJson<T>(key: string): T | null {
  const raw = readRaw(key);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown): void {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    // Penyimpanan penuh atau tidak tersedia.
  }
}

export function loadCommunityDraft(
  communityId: string
): CommunityPostDraft | null {
  const draft = readJson<CommunityPostDraft>(`${DRAFT_PREFIX}${communityId}`);

  if (
    !draft ||
    typeof draft.title !== "string" ||
    typeof draft.body !== "string" ||
    !Array.isArray(draft.tags) ||
    !draft.content ||
    typeof draft.content !== "object"
  ) {
    return null;
  }

  return draft;
}

export function saveCommunityDraft(
  communityId: string,
  draft: CommunityPostDraft
): void {
  writeJson(`${DRAFT_PREFIX}${communityId}`, draft);
  emitDraftChange();
}

export function clearCommunityDraft(communityId: string): void {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  try {
    storage.removeItem(`${DRAFT_PREFIX}${communityId}`);
  } catch {
    // Abaikan kegagalan penghapusan draft.
  }

  emitDraftChange();
}

export function getDraftPresenceSnapshot(communityId: string): boolean {
  const raw = readRaw(`${DRAFT_PREFIX}${communityId}`);
  const cached = draftPresenceCache.get(communityId);

  if (cached && cached.raw === raw) {
    return cached.hasDraft;
  }

  const hasDraft = loadCommunityDraft(communityId) !== null;
  draftPresenceCache.set(communityId, { raw, hasDraft });
  return hasDraft;
}

export function getEmptyDraftPresence(): boolean {
  return false;
}

export function subscribeCommunityDrafts(
  onStoreChange: () => void
): () => void {
  draftListeners.add(onStoreChange);

  const handleStorage = (event: StorageEvent) => {
    if (event.key === null || event.key.startsWith(DRAFT_PREFIX)) {
      draftPresenceCache.clear();
      onStoreChange();
    }
  };

  if (typeof window !== "undefined") {
    window.addEventListener("storage", handleStorage);
  }

  return () => {
    draftListeners.delete(onStoreChange);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", handleStorage);
    }
  };
}

export function loadCommunityPosts(communityId: string): CommunityPost[] {
  const posts = readJson<CommunityPost[]>(`${POSTS_PREFIX}${communityId}`);

  if (!Array.isArray(posts)) {
    return [];
  }

  return posts.filter(
    (post) =>
      post &&
      typeof post.id === "number" &&
      typeof post.title === "string" &&
      typeof post.description === "string"
  );
}

export function getCommunityPostsSnapshot(
  communityId: string
): CommunityPost[] {
  const key = `${POSTS_PREFIX}${communityId}`;
  const raw = readRaw(key);
  const cached = postsSnapshotCache.get(communityId);

  if (cached && cached.raw === raw) {
    return cached.posts;
  }

  const posts = loadCommunityPosts(communityId);
  postsSnapshotCache.set(communityId, { raw, posts });
  return posts;
}

export function getEmptyCommunityPosts(): CommunityPost[] {
  return EMPTY_POSTS;
}

export function subscribeCommunityPosts(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleChange = (event: StorageEvent) => {
    if (event.key === null || event.key.startsWith(POSTS_PREFIX)) {
      postsSnapshotCache.clear();
      onStoreChange();
    }
  };

  window.addEventListener("storage", handleChange);
  return () => window.removeEventListener("storage", handleChange);
}

/**
 * Menyinkronkan ringkasan postingan ke feed lokal: bila post dengan `mockPostId`
 * yang sama sudah ada (hasil sunting), datanya diganti di tempat; selain itu
 * post baru disisipkan di awal daftar.
 */
export function upsertCommunityPost(
  communityId: string,
  post: CommunityPost
): void {
  const existing = loadCommunityPosts(communityId);

  const index = post.mockPostId
    ? existing.findIndex((item) => item.mockPostId === post.mockPostId)
    : -1;

  if (index >= 0) {
    existing[index] = { ...existing[index], ...post, id: existing[index].id };
  } else {
    existing.unshift(post);
  }

  writeJson(`${POSTS_PREFIX}${communityId}`, existing.slice(0, 20));
  postsSnapshotCache.delete(communityId);
}
