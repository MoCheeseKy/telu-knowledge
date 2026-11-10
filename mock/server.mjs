import jsonServer from 'json-server';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = jsonServer.create();
const seedFile = path.resolve(__dirname, 'mock_data.seed.json');
const router = jsonServer.router(seedFile);
const middlewares = jsonServer.defaults();

const PORT = process.env.PORT || 4000;

// Akun viewer fiktif tetap untuk menghitung relasi per-viewer (isLiked, isBookmarked, isFollowing, role)
const MOCK_ME_ID = '10000000-0000-4000-8000-000000000001';

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Custom response wrapper agar format respons sama persis dengan ApiEnvelope NestJS
router.render = (req, res) => {
  if (
    res.locals.data &&
    typeof res.locals.data === 'object' &&
    'statusCode' in res.locals.data &&
    'isError' in res.locals.data
  ) {
    res.json(res.locals.data);
  } else {
    res.json({
      statusCode: res.statusCode || 200,
      message: [],
      data: res.locals.data,
      isError: false,
    });
  }
};

// 1. Endpoint Feed Artikel Publik (ter-enrich dengan author, topic, stats, isLiked, isBookmarked)
const handleArticleFeed = (req, res) => {
  const db = router.db.getState();
  const { topic, limit } = req.query;

  // Hanya artikel published
  let articles = (db.articles || []).filter((a) => a.status === 'published');

  // Filter topik jika parameter topic diberikan (slug atau nama)
  if (topic) {
    const topicObj = (db.topics || []).find(
      (t) =>
        t.slug?.toLowerCase() === String(topic).toLowerCase() ||
        t.name?.toLowerCase() === String(topic).toLowerCase()
    );
    if (topicObj) {
      const articleIds = new Set(
        (db.article_topics || [])
          .filter((at) => at.topic_id === topicObj.id)
          .map((at) => at.article_id)
      );
      articles = articles.filter((a) => articleIds.has(a.id));
    }
  }

  // Urutkan artikel terbaru (published_at DESC)
  articles.sort(
    (a, b) =>
      new Date(b.published_at || b.created_at).getTime() -
      new Date(a.published_at || a.created_at).getTime()
  );

  // Mapping setiap artikel dengan relasinya
  const enrichedArticles = articles.map((article) => {
    const author = (db.profiles || []).find((p) => p.id === article.author_id);
    const relTopic = (db.article_topics || []).find(
      (at) => at.article_id === article.id
    );
    const mainTopic = relTopic
      ? (db.topics || []).find((t) => t.id === relTopic.topic_id)
      : null;
    const stats = (db.article_stats || []).find(
      (s) => s.article_id === article.id
    );

    const isLiked = (db.article_likes || []).some(
      (l) => l.article_id === article.id && l.user_id === MOCK_ME_ID
    );
    const isBookmarked = (db.article_bookmarks || []).some(
      (b) => b.article_id === article.id && b.user_id === MOCK_ME_ID
    );

    return {
      id: article.id,
      title: article.title,
      subtitle: article.subtitle,
      coverImageUrl: article.cover_image_url,
      excerpt: article.excerpt,
      readingTimeMinutes: article.reading_time_minutes,
      status: article.status,
      slug: article.slug,
      publishedAt: article.published_at,
      createdAt: article.created_at,
      updatedAt: article.updated_at,
      topic: mainTopic ? mainTopic.name : 'Umum',
      topicSlug: mainTopic ? mainTopic.slug : null,
      author: {
        id: author ? author.id : article.author_id,
        displayName: author ? author.display_name : 'Civitas Tel-U',
        avatarUrl: author ? author.avatar_url : null,
        username: author ? author.username : null,
        avatarColor: author ? author.avatar_color : '#E53E3E',
      },
      stats: {
        likesCount: stats ? stats.likes_count : 0,
        commentsCount: stats ? stats.comments_count : 0,
        repostsCount: stats ? stats.reposts_count : 0,
        bookmarksCount: stats ? stats.bookmarks_count : 0,
      },
      isLiked,
      isBookmarked,
    };
  });

  const result = limit
    ? enrichedArticles.slice(0, Number(limit))
    : enrichedArticles;

  return res.json({
    statusCode: 200,
    message: ['Feed artikel berhasil diambil'],
    data: result,
    isError: false,
  });
};

server.get('/api/articles/feed', handleArticleFeed);
server.get('/articles/feed', handleArticleFeed);

// 2. Endpoint Detail Artikel Lengkap
const handleArticleDetail = (req, res, next) => {
  const { id } = req.params;
  if (id === 'feed' || id === 'recommendations' || id === 'me') {
    return next();
  }

  const db = router.db.getState();
  const article = (db.articles || []).find((a) => a.id === id || a.slug === id);

  if (!article) {
    return res.status(404).json({
      statusCode: 404,
      message: ['Artikel tidak ditemukan'],
      isError: true,
      data: null,
    });
  }

  const author = (db.profiles || []).find((p) => p.id === article.author_id);
  const relTopic = (db.article_topics || []).find(
    (at) => at.article_id === article.id
  );
  const mainTopic = relTopic
    ? (db.topics || []).find((t) => t.id === relTopic.topic_id)
    : null;
  const stats = (db.article_stats || []).find(
    (s) => s.article_id === article.id
  );

  const isLiked = (db.article_likes || []).some(
    (l) => l.article_id === article.id && l.user_id === MOCK_ME_ID
  );
  const isBookmarked = (db.article_bookmarks || []).some(
    (b) => b.article_id === article.id && b.user_id === MOCK_ME_ID
  );
  const isFollowingAuthor = author
    ? (db.follows || []).some(
        (f) => f.follower_id === MOCK_ME_ID && f.following_id === author.id
      )
    : false;

  // Komentar pada artikel
  const rawComments = (db.article_comments || [])
    .filter((c) => c.article_id === article.id)
    .sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

  const comments = rawComments.map((c) => {
    const cAuthor = (db.profiles || []).find((p) => p.id === c.author_id);
    return {
      id: c.id,
      articleId: c.article_id,
      authorId: c.author_id,
      parentId: c.parent_id || null,
      content: c.content,
      createdAt: c.created_at,
      updatedAt: c.updated_at,
      author: {
        id: cAuthor ? cAuthor.id : c.author_id,
        displayName: cAuthor ? cAuthor.display_name : 'Pengguna Tel-U',
        avatarUrl: cAuthor ? cAuthor.avatar_url : null,
        avatarColor: cAuthor ? cAuthor.avatar_color : '#E53E3E',
        username: cAuthor ? cAuthor.username : null,
        faculty: cAuthor ? cAuthor.faculty : null,
        major: cAuthor ? cAuthor.major : null,
      },
    };
  });

  const enriched = {
    id: article.id,
    title: article.title,
    subtitle: article.subtitle,
    coverImageUrl: article.cover_image_url,
    content: article.content,
    excerpt: article.excerpt,
    readingTimeMinutes: article.reading_time_minutes,
    status: article.status,
    slug: article.slug,
    publishedAt: article.published_at,
    createdAt: article.created_at,
    updatedAt: article.updated_at,
    topic: mainTopic ? mainTopic.name : 'Umum',
    topicSlug: mainTopic ? mainTopic.slug : null,
    author: {
      id: author ? author.id : article.author_id,
      displayName: author ? author.display_name : 'Civitas Tel-U',
      avatarUrl: author ? author.avatar_url : null,
      username: author ? author.username : null,
      avatarColor: author ? author.avatar_color : '#E53E3E',
      bio: author ? author.bio : '',
      faculty: author ? author.faculty : null,
      major: author ? author.major : null,
      generation: author ? author.generation : null,
      website: author ? author.website || null : null,
      github: author ? author.github || null : null,
      linkedin: author ? author.linkedin || null : null,
      isFollowing: isFollowingAuthor,
    },
    stats: {
      likesCount: stats ? stats.likes_count : 0,
      commentsCount:
        comments.length > 0 ? comments.length : stats ? stats.comments_count : 0,
      repostsCount: stats ? stats.reposts_count : 0,
      bookmarksCount: stats ? stats.bookmarks_count : 0,
    },
    isLiked,
    isBookmarked,
    comments,
  };

  return res.json({
    statusCode: 200,
    message: ['Detail artikel berhasil diambil'],
    data: enriched,
    isError: false,
  });
};

server.get('/api/articles/:id', handleArticleDetail);
server.get('/articles/:id', handleArticleDetail);

// 2b. Endpoint Daftar Artikel Milik Sendiri (GET /articles/me)
const handleMyArticles = (req, res) => {
  const db = router.db.getState();
  const { status, limit = 20 } = req.query;
  const numLimit = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 50);

  let userArticles = (db.articles || []).filter(
    (a) => a.author_id === MOCK_ME_ID
  );

  if (status) {
    userArticles = userArticles.filter((a) => a.status === status);
  }

  userArticles.sort(
    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );

  const authorProfile = (db.profiles || []).find((p) => p.id === MOCK_ME_ID);

  const items = userArticles.slice(0, numLimit).map((a) => ({
    id: a.id,
    title: a.title || 'Tanpa Judul',
    subtitle: a.subtitle || null,
    coverImageUrl: a.cover_image_url || null,
    excerpt: a.excerpt || '',
    readingTimeMinutes: a.reading_time_minutes || 1,
    status: a.status,
    slug: a.slug || null,
    createdAt: a.created_at,
    updatedAt: a.updated_at,
    publishedAt: a.published_at || null,
    author: {
      id: authorProfile ? authorProfile.id : MOCK_ME_ID,
      displayName: authorProfile ? authorProfile.display_name : 'Saya',
      avatarUrl: authorProfile ? authorProfile.avatar_url : null,
    },
  }));

  return res.json({
    statusCode: 200,
    message: ['Daftar artikel berhasil diambil'],
    data: {
      items,
      nextCursor: null,
    },
    isError: false,
  });
};

server.get('/api/articles/me', handleMyArticles);
server.get('/articles/me', handleMyArticles);

// 2c. Endpoint Hapus Artikel (DELETE /articles/:id)
const handleDeleteArticle = (req, res) => {
  const { id } = req.params;
  const db = router.db.getState();
  const articleIndex = (db.articles || []).findIndex(
    (a) => a.id === id || a.slug === id
  );

  if (articleIndex === -1) {
    return res.status(404).json({
      statusCode: 404,
      message: ['Artikel tidak ditemukan'],
      isError: true,
      data: null,
    });
  }

  db.articles.splice(articleIndex, 1);
  router.db.write();

  return res.json({
    statusCode: 200,
    message: ['Artikel berhasil dihapus'],
    data: null,
    isError: false,
  });
};

server.delete('/api/articles/:id', handleDeleteArticle);
server.delete('/articles/:id', handleDeleteArticle);

// 3. Endpoint Toggle Suka / Like Artikel
const handleToggleLike = (req, res) => {
  const { id } = req.params;
  const db = router.db.getState();
  const article = (db.articles || []).find((a) => a.id === id || a.slug === id);
  if (!article) {
    return res.status(404).json({
      statusCode: 404,
      message: ['Artikel tidak ditemukan'],
      isError: true,
      data: null,
    });
  }

  if (!db.article_likes) db.article_likes = [];
  const existingIndex = db.article_likes.findIndex(
    (l) => l.article_id === article.id && l.user_id === MOCK_ME_ID
  );

  let stats = (db.article_stats || []).find((s) => s.article_id === article.id);
  if (!stats) {
    stats = {
      article_id: article.id,
      likes_count: 0,
      comments_count: 0,
      reposts_count: 0,
      bookmarks_count: 0,
    };
    if (!db.article_stats) db.article_stats = [];
    db.article_stats.push(stats);
  }

  let isLiked = false;
  if (existingIndex >= 0) {
    db.article_likes.splice(existingIndex, 1);
    stats.likes_count = Math.max(0, (stats.likes_count || 1) - 1);
    isLiked = false;
  } else {
    db.article_likes.push({
      id: crypto.randomUUID(),
      article_id: article.id,
      user_id: MOCK_ME_ID,
      created_at: new Date().toISOString(),
    });
    stats.likes_count = (stats.likes_count || 0) + 1;
    isLiked = true;
  }

  router.db.write();
  return res.json({
    statusCode: 200,
    message: [isLiked ? 'Menyukai artikel' : 'Batal menyukai artikel'],
    data: { isLiked, likesCount: stats.likes_count },
    isError: false,
  });
};

server.post('/api/articles/:id/like', handleToggleLike);
server.post('/articles/:id/like', handleToggleLike);

// 4. Endpoint Toggle Simpan / Bookmark Artikel
const handleToggleBookmark = (req, res) => {
  const { id } = req.params;
  const db = router.db.getState();
  const article = (db.articles || []).find((a) => a.id === id || a.slug === id);
  if (!article) {
    return res.status(404).json({
      statusCode: 404,
      message: ['Artikel tidak ditemukan'],
      isError: true,
      data: null,
    });
  }

  if (!db.article_bookmarks) db.article_bookmarks = [];
  const existingIndex = db.article_bookmarks.findIndex(
    (b) => b.article_id === article.id && b.user_id === MOCK_ME_ID
  );

  let stats = (db.article_stats || []).find((s) => s.article_id === article.id);
  if (!stats) {
    stats = {
      article_id: article.id,
      likes_count: 0,
      comments_count: 0,
      reposts_count: 0,
      bookmarks_count: 0,
    };
    if (!db.article_stats) db.article_stats = [];
    db.article_stats.push(stats);
  }

  let isBookmarked = false;
  if (existingIndex >= 0) {
    db.article_bookmarks.splice(existingIndex, 1);
    stats.bookmarks_count = Math.max(0, (stats.bookmarks_count || 1) - 1);
    isBookmarked = false;
  } else {
    db.article_bookmarks.push({
      id: crypto.randomUUID(),
      article_id: article.id,
      user_id: MOCK_ME_ID,
      created_at: new Date().toISOString(),
    });
    stats.bookmarks_count = (stats.bookmarks_count || 0) + 1;
    isBookmarked = true;
  }

  router.db.write();
  return res.json({
    statusCode: 200,
    message: [
      isBookmarked
        ? 'Artikel berhasil disimpan ke koleksi'
        : 'Artikel dihapus dari koleksi',
    ],
    data: { isBookmarked, bookmarksCount: stats.bookmarks_count },
    isError: false,
  });
};

server.post('/api/articles/:id/bookmark', handleToggleBookmark);
server.post('/articles/:id/bookmark', handleToggleBookmark);

// 5. Endpoint Tambah Komentar Artikel
const handleCreateComment = (req, res) => {
  const { id } = req.params;
  const { content, parent_id } = req.body || {};
  if (!content || !content.trim()) {
    return res.status(400).json({
      statusCode: 400,
      message: ['Isi komentar wajib diisi'],
      isError: true,
      data: null,
    });
  }

  const db = router.db.getState();
  const article = (db.articles || []).find((a) => a.id === id || a.slug === id);
  if (!article) {
    return res.status(404).json({
      statusCode: 404,
      message: ['Artikel tidak ditemukan'],
      isError: true,
      data: null,
    });
  }

  const newComment = {
    id: crypto.randomUUID(),
    article_id: article.id,
    author_id: MOCK_ME_ID,
    parent_id: parent_id || null,
    content: content.trim(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (!db.article_comments) db.article_comments = [];
  db.article_comments.push(newComment);

  let stats = (db.article_stats || []).find((s) => s.article_id === article.id);
  if (stats) {
    stats.comments_count = (stats.comments_count || 0) + 1;
  }

  router.db.write();

  const author = (db.profiles || []).find((p) => p.id === MOCK_ME_ID);
  return res.status(201).json({
    statusCode: 201,
    message: ['Komentar berhasil dikirim'],
    data: {
      id: newComment.id,
      articleId: newComment.article_id,
      authorId: newComment.author_id,
      parentId: newComment.parent_id,
      content: newComment.content,
      createdAt: newComment.created_at,
      updatedAt: newComment.updated_at,
      author: {
        id: author ? author.id : MOCK_ME_ID,
        displayName: author ? author.display_name : 'Pengguna Tel-U',
        avatarUrl: author ? author.avatar_url : null,
        avatarColor: author ? author.avatar_color : '#E53E3E',
        username: author ? author.username : null,
        faculty: author ? author.faculty : null,
        major: author ? author.major : null,
      },
    },
    isError: false,
  });
};

server.post('/api/articles/:id/comments', handleCreateComment);
server.post('/articles/:id/comments', handleCreateComment);

// 6. Endpoint Toggle Follow Penulis
const handleToggleFollow = (req, res) => {
  const { id } = req.params;
  const db = router.db.getState();
  const profile = (db.profiles || []).find((p) => p.id === id || p.username === id);
  if (!profile) {
    return res.status(404).json({
      statusCode: 404,
      message: ['Profil tidak ditemukan'],
      isError: true,
      data: null,
    });
  }

  if (!db.follows) db.follows = [];
  const existingIndex = db.follows.findIndex(
    (f) => f.follower_id === MOCK_ME_ID && f.following_id === profile.id
  );

  let isFollowing = false;
  if (existingIndex >= 0) {
    db.follows.splice(existingIndex, 1);
    isFollowing = false;
  } else {
    db.follows.push({
      id: crypto.randomUUID(),
      follower_id: MOCK_ME_ID,
      following_id: profile.id,
      created_at: new Date().toISOString(),
    });
    isFollowing = true;
  }

  router.db.write();
  return res.json({
    statusCode: 200,
    message: [
      isFollowing
        ? `Mengikuti ${profile.display_name}`
        : `Batal mengikuti ${profile.display_name}`,
    ],
    data: { isFollowing },
    isError: false,
  });
};

server.post('/api/profiles/:id/follow', handleToggleFollow);
server.post('/profiles/:id/follow', handleToggleFollow);

// 7. Endpoint Rekomendasi Topik Pilihan
const handleTopicRecommendations = (req, res) => {
  const db = router.db.getState();
  const topics = [...(db.topics || [])]
    .sort((a, b) => (b.articles_count || 0) - (a.articles_count || 0))
    .slice(0, 4)
    .map((t) => ({
      id: t.id,
      title: t.name,
      count: `${t.articles_count} Artikel`,
      href: `/discovers-articles?topic=${t.slug}`,
    }));

  return res.json({
    statusCode: 200,
    message: ['Rekomendasi topik berhasil diambil'],
    data: topics,
    isError: false,
  });
};

server.get('/api/topics/recommendations', handleTopicRecommendations);
server.get('/topics/recommendations', handleTopicRecommendations);

// 8. Endpoint Rekomendasi Penulis Terpopuler (Maksimal 5 dengan followers terbanyak)
const handleWriterRecommendations = (req, res) => {
  const db = router.db.getState();
  const writers = (db.profiles || [])
    .filter((p) => p.id !== MOCK_ME_ID)
    .map((p) => {
      const followersCount = (db.follows || []).filter(
        (f) => f.following_id === p.id
      ).length;
      const isFollowing = (db.follows || []).some(
        (f) => f.follower_id === MOCK_ME_ID && f.following_id === p.id
      );
      return {
        id: p.id,
        name: p.display_name || p.username,
        displayName: p.display_name,
        username: p.username,
        avatarUrl: p.avatar_url || undefined,
        avatarColor: p.avatar_color,
        followersCount,
        isFollowing,
      };
    })
    .sort((a, b) => b.followersCount - a.followersCount)
    .slice(0, 5);

  return res.json({
    statusCode: 200,
    message: ['Rekomendasi penulis berhasil diambil'],
    data: writers,
    isError: false,
  });
};

server.get('/api/profiles/recommendations', handleWriterRecommendations);
server.get('/profiles/recommendations', handleWriterRecommendations);

// 9. Endpoint Rekomendasi Komunitas Aktif
const handleCommunityRecommendations = (req, res) => {
  const db = router.db.getState();
  const communities = (db.communities || [])
    .slice(0, 3)
    .map((c) => {
      const isFollowing = (db.community_members || []).some(
        (cm) => cm.community_id === c.id && cm.user_id === MOCK_ME_ID
      );
      return {
        id: c.id,
        title: c.name,
        description: c.description || '',
        activeMemberCount: `${(c.member_count || 0).toLocaleString('id-ID')} Anggota`,
        isFollowing,
        href: `/communities/${c.id}`,
      };
    });

  return res.json({
    statusCode: 200,
    message: ['Rekomendasi komunitas berhasil diambil'],
    data: communities,
    isError: false,
  });
};

server.get('/api/communities/recommendations', handleCommunityRecommendations);
server.get('/communities/recommendations', handleCommunityRecommendations);

// Mount router pada /api dan /
server.use('/api', router);
server.use(router);

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 Tel-U Knowledge Mock Server (json-server 0.17.4)`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`📁 Seed: ${seedFile}`);
  console.log(`======================================================\n`);
});
