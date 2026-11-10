#!/usr/bin/env node

/**
 * scripts/validate-mock.mjs
 * Script validasi integritas seed mock database Tel-U Knowledge (mock/mock_data.seed.json)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Resolusi Path File Seed dan Public Directory
function resolvePath(relPath) {
  const candidates = [
    path.resolve(process.cwd(), relPath),
    path.resolve(__dirname, '..', relPath),
    path.resolve(__dirname, '../..', relPath),
    path.resolve(process.cwd(), 'telu-knowledge', relPath),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return candidates[0];
}

const seedFilePath = resolvePath('mock/mock_data.seed.json');
const publicDirPath = resolvePath('public');

console.log(`\n======================================================`);
console.log(` Memvalidasi Mock Data Seed: ${seedFilePath}`);
console.log(` Public Directory: ${publicDirPath}`);
console.log(`======================================================\n`);

if (!fs.existsSync(seedFilePath)) {
  console.error(`❌ Error: File seed tidak ditemukan di: ${seedFilePath}`);
  process.exit(1);
}

// 2. Parse JSON
let data;
try {
  const raw = fs.readFileSync(seedFilePath, 'utf-8');
  data = JSON.parse(raw);
} catch (err) {
  console.error(`❌ Error parsing JSON: ${err.message}`);
  process.exit(1);
}

const errors = [];
const warnings = [];

function addError(msg) {
  errors.push(msg);
}

function addWarning(msg) {
  warnings.push(msg);
}

// 3. Daftar Tabel yang Diharapkan
const EXPECTED_TABLES = [
  'profiles',
  'follows',
  'articles',
  'article_stats',
  'topics',
  'article_topics',
  'article_likes',
  'article_bookmarks',
  'article_reposts',
  'article_comments',
  'collections',
  'collection_articles',
  'communities',
  'community_rules',
  'community_members',
  'forum_posts',
  'forum_post_votes',
  'forum_post_saves',
  'forum_post_reposts',
  'forum_comments',
  'forum_comment_votes',
  'notifications'
];

for (const table of EXPECTED_TABLES) {
  if (!Array.isArray(data[table])) {
    addError(`Tabel '${table}' tidak ditemukan atau bukan array.`);
  }
}

// Helper Sets untuk FK dan Unique Checks
const idSets = {};
const allIds = new Set();
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const PADDED_DECIMAL_UUID_REGEX = /^[0-9]{8}-0000-4000-8000-[0-9]{12}$/;
const ISO_TIMESTAMP_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/;
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const STUDENT_ID_REGEX = /\b1301\d{6}\b/;

for (const table of EXPECTED_TABLES) {
  idSets[table] = new Set();
  const rows = data[table] || [];

  rows.forEach((row, idx) => {
    // Check ID
    const rowId = table === 'article_stats' ? row.article_id : row.id;
    if (!rowId) {
      addError(`[${table}][idx:${idx}] tidak memiliki Primary Key id.`);
      return;
    }

    if (!UUID_REGEX.test(rowId)) {
      addError(`[${table}][idx:${idx}] ID '${rowId}' bukan format UUID yang valid.`);
    }

    if (!PADDED_DECIMAL_UUID_REGEX.test(rowId)) {
      addWarning(`[${table}][idx:${idx}] ID '${rowId}' tidak mengikuti pola zero-padded decimal.`);
    }

    if (idSets[table].has(rowId)) {
      addError(`[${table}] Duplikat ID ditemukan: '${rowId}'.`);
    } else {
      idSets[table].add(rowId);
    }

    if (table !== 'article_stats') {
      if (allIds.has(rowId)) {
        addError(`[${table}] ID '${rowId}' bertabrakan dengan tabel lain (Global ID collision).`);
      } else {
        allIds.add(rowId);
      }
    }
  });
}

// 4. Schema Checks untuk EXISTING Tables
const ARTICLES_ALLOWED_KEYS = new Set([
  'id', 'author_id', 'title', 'subtitle', 'cover_image_url', 'content',
  'excerpt', 'reading_time_minutes', 'status', 'slug', 'published_at',
  'created_at', 'updated_at'
]);

const PROFILES_ALLOWED_KEYS = new Set([
  'id', 'display_name', 'avatar_url', 'created_at', 'username', 'bio',
  'faculty', 'major', 'generation', 'banner_url', 'avatar_color',
  'website', 'github', 'linkedin', 'show_email', 'show_communities',
  'followers_count', 'following_count'
]);

(data.articles || []).forEach((art, idx) => {
  for (const key of Object.keys(art)) {
    if (!ARTICLES_ALLOWED_KEYS.has(key)) {
      addError(`[articles][id:${art.id}] Kolom '${key}' di luar skema Supabase articles.`);
    }
  }
});

(data.profiles || []).forEach((prof, idx) => {
  for (const key of Object.keys(prof)) {
    if (!PROFILES_ALLOWED_KEYS.has(key)) {
      addError(`[profiles][id:${prof.id}] Kolom '${key}' di luar skema blueprint profiles.`);
    }
  }
});

// 5. PII & Secret Scan
function scanPII(obj, pathStr) {
  if (obj === null || obj === undefined) return;
  if (typeof obj === 'string') {
    if (EMAIL_REGEX.test(obj)) {
      addError(`[PII Scan] Ditemukan pola email pada '${pathStr}': "${obj}"`);
    }
    if (STUDENT_ID_REGEX.test(obj)) {
      addError(`[PII Scan] Ditemukan pola NIM/Student ID pada '${pathStr}': "${obj}"`);
    }
  } else if (Array.isArray(obj)) {
    obj.forEach((item, i) => scanPII(item, `${pathStr}[${i}]`));
  } else if (typeof obj === 'object') {
    for (const [k, v] of Object.entries(obj)) {
      scanPII(v, `${pathStr}.${k}`);
    }
  }
}
scanPII(data, 'root');

// 6. Validasi profiles
const usernames = new Set();
(data.profiles || []).forEach((p, idx) => {
  if (!p.username || !/^[a-z0-9_]{3,30}$/.test(p.username)) {
    addError(`[profiles][id:${p.id}] Username '${p.username}' tidak cocok dengan regex ^[a-z0-9_]{3,30}$`);
  } else {
    const lower = p.username.toLowerCase();
    if (usernames.has(lower)) {
      addError(`[profiles] Duplikat username (case-insensitive): '${p.username}'`);
    }
    usernames.add(lower);
  }

  if (!p.avatar_color || !/^#[0-9A-Fa-f]{6}$/.test(p.avatar_color)) {
    addError(`[profiles][id:${p.id}] avatar_color '${p.avatar_color}' tidak berformat hex #RRGGBB.`);
  }

  // Follows counter cache check
  const actualFollowers = (data.follows || []).filter(f => f.following_id === p.id).length;
  const actualFollowing = (data.follows || []).filter(f => f.follower_id === p.id).length;
  if (p.followers_count < actualFollowers) {
    addError(`[profiles][id:${p.id}] followers_count (${p.followers_count}) < baris follows (${actualFollowers}).`);
  }
  if (p.following_count < actualFollowing) {
    addError(`[profiles][id:${p.id}] following_count (${p.following_count}) < baris follows (${actualFollowing}).`);
  }
});

// 7. Validasi follows
const followPairs = new Set();
(data.follows || []).forEach((f, idx) => {
  if (!idSets.profiles.has(f.follower_id)) {
    addError(`[follows][id:${f.id}] follower_id '${f.follower_id}' tidak ditemukan di profiles.`);
  }
  if (!idSets.profiles.has(f.following_id)) {
    addError(`[follows][id:${f.id}] following_id '${f.following_id}' tidak ditemukan di profiles.`);
  }
  if (f.follower_id === f.following_id) {
    addError(`[follows][id:${f.id}] Pengguna tidak boleh mem-follow dirinya sendiri.`);
  }
  const pairKey = `${f.follower_id}_${f.following_id}`;
  if (followPairs.has(pairKey)) {
    addError(`[follows] Duplikat relasi follow: ${pairKey}`);
  }
  followPairs.add(pairKey);
});

// 8. Validasi articles
const publishedArticleIds = new Set();
const articleSlugs = new Set();

(data.articles || []).forEach((a, idx) => {
  if (!idSets.profiles.has(a.author_id)) {
    addError(`[articles][id:${a.id}] author_id '${a.author_id}' tidak ditemukan di profiles.`);
  }

  if (a.excerpt && a.excerpt.length > 160) {
    addError(`[articles][id:${a.id}] excerpt melebihi 160 karakter (${a.excerpt.length} char).`);
  }

  if (typeof a.reading_time_minutes !== 'number' || a.reading_time_minutes < 1) {
    addError(`[articles][id:${a.id}] reading_time_minutes harus berupa integer >= 1.`);
  }

  // Status & slug rule
  if (a.status === 'published') {
    publishedArticleIds.add(a.id);
    if (!a.slug) {
      addError(`[articles][id:${a.id}] Artikel berstatus 'published' wajib memiliki slug.`);
    } else {
      if (articleSlugs.has(a.slug)) {
        addError(`[articles] Duplikat slug: '${a.slug}'`);
      }
      articleSlugs.add(a.slug);
    }
    if (!a.published_at || !ISO_TIMESTAMP_REGEX.test(a.published_at)) {
      addError(`[articles][id:${a.id}] Artikel berstatus 'published' wajib memiliki published_at bertipe ISO timestamp.`);
    }
  } else if (a.status === 'draft') {
    if (a.slug !== null && a.slug !== undefined) {
      addError(`[articles][id:${a.id}] Artikel berstatus 'draft' harus memiliki slug null.`);
    }
    if (a.published_at !== null && a.published_at !== undefined) {
      addError(`[articles][id:${a.id}] Artikel berstatus 'draft' harus memiliki published_at null.`);
    }
  } else {
    addError(`[articles][id:${a.id}] Status tidak valid: '${a.status}'.`);
  }

  // Tiptap Content Validation
  if (!a.content || a.content.type !== 'doc' || !Array.isArray(a.content.content)) {
    addError(`[articles][id:${a.id}] content bukan dokumen Tiptap valid ({ type: 'doc', content: [] }).`);
  } else {
    function validateTiptapNode(node) {
      const allowedNodes = new Set(['doc', 'heading', 'paragraph', 'blockquote', 'hardBreak', 'text']);
      if (!allowedNodes.has(node.type)) {
        addError(`[articles][id:${a.id}] Node Tiptap tidak diizinkan: '${node.type}'.`);
      }
      if (node.type === 'image') {
        addError(`[articles][id:${a.id}] Dokumen Tiptap dilarang memuat node 'image'.`);
      }
      if (node.type === 'heading') {
        const lvl = node.attrs?.level;
        if (lvl !== 2 && lvl !== 3) {
          addError(`[articles][id:${a.id}] Level heading harus 2 atau 3, ditemukan: ${lvl}`);
        }
      }
      if (Array.isArray(node.content)) {
        node.content.forEach(validateTiptapNode);
      }
    }
    a.content.content.forEach(validateTiptapNode);
  }
});

// 9. Validasi article_stats
(data.article_stats || []).forEach((st, idx) => {
  if (!idSets.articles.has(st.article_id)) {
    addError(`[article_stats][id:${st.article_id}] article_id tidak ditemukan di articles.`);
  }

  const actualLikes = (data.article_likes || []).filter(al => al.article_id === st.article_id).length;
  const actualBookmarks = (data.article_bookmarks || []).filter(ab => ab.article_id === st.article_id).length;
  const actualReposts = (data.article_reposts || []).filter(ar => ar.article_id === st.article_id).length;
  const actualComments = (data.article_comments || []).filter(ac => ac.article_id === st.article_id).length;

  if (st.likes_count < actualLikes) {
    addError(`[article_stats][art:${st.article_id}] likes_count (${st.likes_count}) < baris article_likes (${actualLikes}).`);
  }
  if (st.bookmarks_count < actualBookmarks) {
    addError(`[article_stats][art:${st.article_id}] bookmarks_count (${st.bookmarks_count}) < baris article_bookmarks (${actualBookmarks}).`);
  }
  if (st.reposts_count < actualReposts) {
    addError(`[article_stats][art:${st.article_id}] reposts_count (${st.reposts_count}) < baris article_reposts (${actualReposts}).`);
  }
  if (st.comments_count < actualComments) {
    addError(`[article_stats][art:${st.article_id}] comments_count (${st.comments_count}) < baris article_comments (${actualComments}).`);
  }
});

// 10. Validasi Interaksi Artikel HANYA ke Published Articles
function checkPublishedArticleRef(table, rows) {
  rows.forEach((row, idx) => {
    if (!idSets.articles.has(row.article_id)) {
      addError(`[${table}][id:${row.id}] article_id '${row.article_id}' tidak ditemukan di articles.`);
    } else if (!publishedArticleIds.has(row.article_id)) {
      addError(`[${table}][id:${row.id}] article_id '${row.article_id}' merujuk pada artikel non-published.`);
    }
  });
}

checkPublishedArticleRef('article_likes', data.article_likes || []);
checkPublishedArticleRef('article_bookmarks', data.article_bookmarks || []);
checkPublishedArticleRef('article_reposts', data.article_reposts || []);
checkPublishedArticleRef('article_comments', data.article_comments || []);
checkPublishedArticleRef('collection_articles', data.collection_articles || []);

// 11. Validasi topics & article_topics
const articleTopicPairs = new Set();
(data.article_topics || []).forEach(at => {
  if (!idSets.topics.has(at.topic_id)) {
    addError(`[article_topics][id:${at.id}] topic_id '${at.topic_id}' tidak ditemukan di topics.`);
  }
  const pair = `${at.article_id}_${at.topic_id}`;
  if (articleTopicPairs.has(pair)) {
    addError(`[article_topics] Duplikat relasi: ${pair}`);
  }
  articleTopicPairs.add(pair);
});

(data.topics || []).forEach(t => {
  const actualArticles = (data.article_topics || []).filter(at => at.topic_id === t.id).length;
  if (t.articles_count < actualArticles) {
    addError(`[topics][id:${t.id}] articles_count (${t.articles_count}) < baris article_topics (${actualArticles}).`);
  }
});

// 12. Validasi communities & community_members
const communityMemberPairs = new Set();
const communityOwners = new Set();

(data.community_members || []).forEach(cm => {
  if (!idSets.communities.has(cm.community_id)) {
    addError(`[community_members][id:${cm.id}] community_id '${cm.community_id}' tidak ditemukan di communities.`);
  }
  if (!idSets.profiles.has(cm.user_id)) {
    addError(`[community_members][id:${cm.id}] user_id '${cm.user_id}' tidak ditemukan di profiles.`);
  }
  if (!['owner', 'moderator', 'member'].includes(cm.role)) {
    addError(`[community_members][id:${cm.id}] Role '${cm.role}' tidak valid.`);
  }
  if (cm.role === 'owner') {
    communityOwners.add(`${cm.community_id}_${cm.user_id}`);
  }

  const pair = `${cm.community_id}_${cm.user_id}`;
  if (communityMemberPairs.has(pair)) {
    addError(`[community_members] Duplikat keanggotaan: ${pair}`);
  }
  communityMemberPairs.add(pair);
});

(data.communities || []).forEach(c => {
  if (!/^#[0-9A-Fa-f]{6}$/.test(c.avatar_color)) {
    addError(`[communities][id:${c.id}] avatar_color '${c.avatar_color}' bukan hex #RRGGBB.`);
  }
  if (!['Teknologi', 'Akademik', 'Kuliner', 'Desain', 'Hobi', 'Umum'].includes(c.category)) {
    addError(`[communities][id:${c.id}] Kategori '${c.category}' tidak valid.`);
  }
  if (!['publik', 'terbatas', 'privat'].includes(c.visibility)) {
    addError(`[communities][id:${c.id}] Visibility '${c.visibility}' tidak valid.`);
  }

  // Creator must be owner
  if (c.creator_id) {
    if (!idSets.profiles.has(c.creator_id)) {
      addError(`[communities][id:${c.id}] creator_id '${c.creator_id}' tidak ditemukan di profiles.`);
    } else {
      const ownerKey = `${c.id}_${c.creator_id}`;
      if (!communityOwners.has(ownerKey)) {
        addError(`[communities][id:${c.id}] creator_id '${c.creator_id}' tidak terdaftar sebagai role 'owner' di community_members.`);
      }
    }
  }

  const actualMembers = (data.community_members || []).filter(cm => cm.community_id === c.id).length;
  const actualPosts = (data.forum_posts || []).filter(fp => fp.community_id === c.id).length;

  if (c.member_count < actualMembers) {
    addError(`[communities][id:${c.id}] member_count (${c.member_count}) < baris community_members (${actualMembers}).`);
  }
  if (c.post_count < actualPosts) {
    addError(`[communities][id:${c.id}] post_count (${c.post_count}) < baris forum_posts (${actualPosts}).`);
  }
});

// 13. Validasi forum_posts
const postVotePairs = new Set();
const postSavePairs = new Set();
const postRepostPairs = new Set();

(data.forum_posts || []).forEach(fp => {
  if (!idSets.communities.has(fp.community_id)) {
    addError(`[forum_posts][id:${fp.id}] community_id '${fp.community_id}' tidak ditemukan di communities.`);
  }
  if (!idSets.profiles.has(fp.author_id)) {
    addError(`[forum_posts][id:${fp.id}] author_id '${fp.author_id}' tidak ditemukan di profiles.`);
  }
  if (!['aktif', 'pin', 'terkunci'].includes(fp.status)) {
    addError(`[forum_posts][id:${fp.id}] status '${fp.status}' tidak valid.`);
  }
  if (fp.flair && !['Diskusi', 'Rekomendasi', 'Pertanyaan', 'Showcase', 'Info', 'Tips', 'Tanya'].includes(fp.flair)) {
    addError(`[forum_posts][id:${fp.id}] flair '${fp.flair}' tidak valid.`);
  }

  const actualLikes = (data.forum_post_votes || []).filter(v => v.post_id === fp.id && v.vote_value === 1).length;
  const actualComments = (data.forum_comments || []).filter(fc => fc.post_id === fp.id).length;
  const actualReposts = (data.forum_post_reposts || []).filter(r => r.post_id === fp.id).length;

  if (fp.likes_count < actualLikes) {
    addError(`[forum_posts][id:${fp.id}] likes_count (${fp.likes_count}) < upvote baris (${actualLikes}).`);
  }
  if (fp.comments_count < actualComments) {
    addError(`[forum_posts][id:${fp.id}] comments_count (${fp.comments_count}) < komentar baris (${actualComments}).`);
  }
  if (fp.reposts_count < actualReposts) {
    addError(`[forum_posts][id:${fp.id}] reposts_count (${fp.reposts_count}) < repost baris (${actualReposts}).`);
  }
});

(data.forum_post_votes || []).forEach(v => {
  if (!idSets.forum_posts.has(v.post_id)) {
    addError(`[forum_post_votes][id:${v.id}] post_id '${v.post_id}' tidak ditemukan di forum_posts.`);
  }
  if (!idSets.profiles.has(v.user_id)) {
    addError(`[forum_post_votes][id:${v.id}] user_id '${v.user_id}' tidak ditemukan di profiles.`);
  }
  if (v.vote_value !== 1 && v.vote_value !== -1) {
    addError(`[forum_post_votes][id:${v.id}] vote_value harus 1 atau -1.`);
  }
  const pair = `${v.post_id}_${v.user_id}`;
  if (postVotePairs.has(pair)) {
    addError(`[forum_post_votes] Duplikat vote: ${pair}`);
  }
  postVotePairs.add(pair);
});

(data.forum_post_saves || []).forEach(s => {
  if (!idSets.forum_posts.has(s.post_id)) {
    addError(`[forum_post_saves][id:${s.id}] post_id '${s.post_id}' tidak ditemukan di forum_posts.`);
  }
  if (!idSets.profiles.has(s.user_id)) {
    addError(`[forum_post_saves][id:${s.id}] user_id '${s.user_id}' tidak ditemukan di profiles.`);
  }
  const pair = `${s.post_id}_${s.user_id}`;
  if (postSavePairs.has(pair)) {
    addError(`[forum_post_saves] Duplikat save: ${pair}`);
  }
  postSavePairs.add(pair);
});

(data.forum_post_reposts || []).forEach(r => {
  if (!idSets.forum_posts.has(r.post_id)) {
    addError(`[forum_post_reposts][id:${r.id}] post_id '${r.post_id}' tidak ditemukan di forum_posts.`);
  }
  if (!idSets.profiles.has(r.user_id)) {
    addError(`[forum_post_reposts][id:${r.id}] user_id '${r.user_id}' tidak ditemukan di profiles.`);
  }
  const pair = `${r.post_id}_${r.user_id}`;
  if (postRepostPairs.has(pair)) {
    addError(`[forum_post_reposts] Duplikat repost: ${pair}`);
  }
  postRepostPairs.add(pair);
});

// 14. Validasi forum_comments (termasuk nesting)
(data.forum_comments || []).forEach(c => {
  if (!idSets.forum_posts.has(c.post_id)) {
    addError(`[forum_comments][id:${c.id}] post_id '${c.post_id}' tidak ditemukan di forum_posts.`);
  }
  if (!idSets.profiles.has(c.author_id)) {
    addError(`[forum_comments][id:${c.id}] author_id '${c.author_id}' tidak ditemukan di profiles.`);
  }
  if (c.parent_id && !idSets.forum_comments.has(c.parent_id)) {
    addError(`[forum_comments][id:${c.id}] parent_id '${c.parent_id}' tidak ditemukan di forum_comments.`);
  }
});

// 15. Validasi collections
(data.collections || []).forEach(col => {
  if (!idSets.profiles.has(col.user_id)) {
    addError(`[collections][id:${col.id}] user_id '${col.user_id}' tidak ditemukan di profiles.`);
  }
  const actualStories = (data.collection_articles || []).filter(ca => ca.collection_id === col.id).length;
  if (col.story_count < actualStories) {
    addError(`[collections][id:${col.id}] story_count (${col.story_count}) < baris collection_articles (${actualStories}).`);
  }
});

// 16. Validasi notifications
(data.notifications || []).forEach(n => {
  if (!idSets.profiles.has(n.recipient_id)) {
    addError(`[notifications][id:${n.id}] recipient_id '${n.recipient_id}' tidak ditemukan di profiles.`);
  }
  if (n.type === 'forum') {
    if (n.actor_id !== null) {
      addError(`[notifications][id:${n.id}] Notifikasi tipe 'forum' wajib memiliki actor_id null.`);
    }
    if (n.target_type !== 'community') {
      addError(`[notifications][id:${n.id}] Notifikasi tipe 'forum' wajib memiliki target_type 'community'.`);
    }
  } else {
    if (n.actor_id && !idSets.profiles.has(n.actor_id)) {
      addError(`[notifications][id:${n.id}] actor_id '${n.actor_id}' tidak ditemukan di profiles.`);
    }
  }

  // target_id verification
  if (n.target_id) {
    if (n.target_type === 'article' && !idSets.articles.has(n.target_id)) {
      addError(`[notifications][id:${n.id}] target_id tidak ditemukan di articles.`);
    } else if (n.target_type === 'forum_post' && !idSets.forum_posts.has(n.target_id)) {
      addError(`[notifications][id:${n.id}] target_id tidak ditemukan di forum_posts.`);
    } else if (n.target_type === 'community' && !idSets.communities.has(n.target_id)) {
      addError(`[notifications][id:${n.id}] target_id tidak ditemukan di communities.`);
    } else if (n.target_type === 'profile' && !idSets.profiles.has(n.target_id)) {
      addError(`[notifications][id:${n.id}] target_id tidak ditemukan di profiles.`);
    }
  }
});

// 17. Validasi Image Paths ke public/
function checkImagePath(table, id, imgPath) {
  if (!imgPath) return;
  const relPath = imgPath.startsWith('/') ? imgPath.slice(1) : imgPath;
  const absPath = path.resolve(publicDirPath, relPath);
  if (!fs.existsSync(absPath)) {
    addError(`[${table}][id:${id}] Gambar '${imgPath}' tidak ditemukan di folder public/ (${absPath}).`);
  }
}

(data.articles || []).forEach(a => checkImagePath('articles', a.id, a.cover_image_url));
(data.profiles || []).forEach(p => {
  checkImagePath('profiles', p.id, p.avatar_url);
  checkImagePath('profiles', p.id, p.banner_url);
});
(data.communities || []).forEach(c => {
  checkImagePath('communities', c.id, c.avatar_url);
  checkImagePath('communities', c.id, c.banner_url);
});
(data.collections || []).forEach(col => checkImagePath('collections', col.id, col.cover_image_url));
(data.forum_posts || []).forEach(fp => checkImagePath('forum_posts', fp.id, fp.cover_image_url));

// 18. Ringkasan & Hasil Validasi
console.log('--- Ringkasan Jumlah Baris per Tabel ---');
console.table(
  EXPECTED_TABLES.map(table => ({
    Tabel: table,
    'Jumlah Baris': (data[table] || []).length
  }))
);

if (warnings.length > 0) {
  console.log(`\n⚠️  Peringatan (${warnings.length}):`);
  warnings.forEach(w => console.warn(` - ${w}`));
}

if (errors.length > 0) {
  console.error(`\n❌ Ditemukan ${errors.length} Kesalahan Validasi:`);
  errors.forEach(e => console.error(` ❌ ${e}`));
  process.exit(1);
} else {
  console.log(`\n✅ Validasi Berhasil! Semua ${EXPECTED_TABLES.length} tabel memenuhi 100% aturan cetak biru.`);
  process.exit(0);
}

