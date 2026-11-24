const db = require('../config/db');

// Wraps async handlers so errors reach Express error middleware
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

const httpError = (status, message) =>
  Object.assign(new Error(message), { status });

// MySQL IDs are positive integers
const ensureValidId = (id) => {
  if (!/^\d+$/.test(id) || Number(id) < 1) {
    throw httpError(400, `Invalid post id: ${id}`);
  }
};

// Whitelist request fields
const buildPostData = (body = {}) => {
  const data = {};

  if (body.title !== undefined) data.title = String(body.title).trim();
  if (body.content !== undefined) data.content = String(body.content).trim();
  if (body.author !== undefined) data.author = String(body.author).trim() || 'Anonymous';

  if (body.tags !== undefined) {
    const list = Array.isArray(body.tags) ? body.tags : String(body.tags).split(',');
    data.tags = [...new Set(list.map(tag => String(tag).trim()).filter(Boolean))];
  }

  return data;
};

// GET /api/posts
const getPosts = asyncHandler(async (req, res) => {
  const [posts] = await db.query('SELECT * FROM posts ORDER BY createdAt DESC');

  res.status(200).json({
    success: true,
    count: posts.length,
    data: posts,
  });
});

// GET /api/posts/:id
const getPostById = asyncHandler(async (req, res) => {
  ensureValidId(req.params.id);

  const [rows] = await db.query('SELECT * FROM posts WHERE id = ?', [req.params.id]);

  if (rows.length === 0) throw httpError(404, 'Post not found');

  res.status(200).json({ success: true, data: rows[0] });
});

// POST /api/posts
const createPost = asyncHandler(async (req, res) => {
  const postData = buildPostData(req.body);

  if (!postData.title) throw httpError(400, 'Title is required');
  if (!postData.content) throw httpError(400, 'Content is required');

  if (postData.title.length > 200) {
    throw httpError(400, 'Title must be 200 characters or fewer');
  }

  if (postData.author && postData.author.length > 100) {
    throw httpError(400, 'Author name must be 100 characters or fewer');
  }

  const [result] = await db.query(
    'INSERT INTO posts (title, content, author, tags) VALUES (?, ?, ?, ?)',
    [
      postData.title,
      postData.content,
      postData.author || 'Anonymous',
      JSON.stringify(postData.tags || []),
    ]
  );

  const [rows] = await db.query('SELECT * FROM posts WHERE id = ?', [result.insertId]);

  res.status(201).json({ success: true, data: rows[0] });
});

// PUT /api/posts/:id
const updatePost = asyncHandler(async (req, res) => {
  ensureValidId(req.params.id);

  const postData = buildPostData(req.body);
  const fields = [];
  const values = [];

  for (const field of ['title', 'content', 'author', 'tags']) {
    if (postData[field] !== undefined) {
      fields.push(`${field} = ?`);
      values.push(field === 'tags' ? JSON.stringify(postData[field]) : postData[field]);
    }
  }

  if (postData.title !== undefined && !postData.title) {
    throw httpError(400, 'Title cannot be empty');
  }

  if (postData.content !== undefined && !postData.content) {
    throw httpError(400, 'Content cannot be empty');
  }

  if (postData.title && postData.title.length > 200) {
    throw httpError(400, 'Title must be 200 characters or fewer');
  }

  if (postData.author && postData.author.length > 100) {
    throw httpError(400, 'Author name must be 100 characters or fewer');
  }

  const id = req.params.id;

  const [existing] = await db.query('SELECT id FROM posts WHERE id = ?', [id]);

  if (existing.length === 0) throw httpError(404, 'Post not found');

  if (fields.length > 0) {
    values.push(id);
    await db.query(`UPDATE posts SET ${fields.join(', ')} WHERE id = ?`, values);
  }

  const [rows] = await db.query('SELECT * FROM posts WHERE id = ?', [id]);

  res.status(200).json({ success: true, data: rows[0] });
});

// DELETE /api/posts/:id
const deletePost = asyncHandler(async (req, res) => {
  ensureValidId(req.params.id);

  const [result] = await db.query('DELETE FROM posts WHERE id = ?', [req.params.id]);

  if (result.affectedRows === 0) throw httpError(404, 'Post not found');

  res.status(200).json({
    success: true,
    message: 'Post deleted',
    data: { id: Number(req.params.id) },
  });
});

module.exports = { getPosts, getPostById, createPost, updatePost, deletePost };