const mysql = require("mysql2/promise");

var connPool = mysql.createPool({
  connectionLimit: 10, // it's a shared resource, let's not go nuts.
  host: "127.0.0.1", // this will work
  port: 3306,
  user: "C4131F25U52",
  database: "C4131F25U52",
  password: "2754",
  dateStrings: true
});

async function createUser(data) {
  const conn = await connPool.getConnection();
  try {
    const response = await conn.query(`
    INSERT INTO Users (username, pass, is_admin)
    VALUES (?, ?, ?)`
      , [data.username, data.password, false]);
    conn.release();
    return response;
  }
  catch {
    conn.release()
    return null;
  }
}

async function validateUser(data) {
  const conn = await connPool.getConnection();

  try {
    const [response] = await conn.query(`
      SELECT * from Users
      WHERE (username = ?) AND (pass = ?)`
      , [data.username, data.password]);
    conn.release();

    return response;
  }
  catch {
    conn.release();
    return null;
  }
}

async function admin(data) {
  const conn = await connPool.getConnection();

  try {
    const [response] = await conn.query(`
      UPDATE Users
      SET is_admin = ?
      WHERE username = ?`
      , [1, data.username]);
    conn.release();

    return response;
  }
  catch {
    conn.release();
    return null;
  }
}

async function addPost(data) {
  const conn = await connPool.getConnection();
  try {
    const [response] = await conn.query(`
      INSERT INTO Posts (author, title, content, published)
      VALUES (?, ?, ?, NOW())`
      , [data.user, data.title, data.content]);

    conn.release();
    return response.insertId;
  }
  catch {
    conn.release();
    return null;
  }
}

async function getPost(postId) {
  const conn = await connPool.getConnection();

  try {
    const [response] = await conn.query(`
      SELECT * from Posts 
      WHERE id = ?`
      , [postId]);

    if (response.length == 0) {
      conn.release();
      return null;
    }
    else {
      conn.release();
      return response[0];
    }
  }
  catch {
    conn.release();
    return null;
  }
}

async function getPosts(query, page) {
  let search = `SELECT * from Posts `;
  let vars = [];

  if (query != "") {
    search += `WHERE (content LIKE CONCAT('%', ?, '%')) OR (title LIKE CONCAT('%', ?, '%')) OR (author LIKE CONCAT('%', ?, '%')) `;
    vars.push(query);
    vars.push(query);
    vars.push(query);
  }

  search += `ORDER BY published DESC LIMIT 5 OFFSET ?`;
  vars.push(((page - 1) * 5));

  try {
    const conn = await connPool.getConnection();
    const [response] = await conn.query(search, vars);
    conn.release();
    return response;
  }
  catch {
    conn.release();
    return null;
  }

}

async function editPost(id, title, content) {
  try {
    const conn = await connPool.getConnection();
    const [response] = await conn.query(`
      UPDATE Posts 
      SET title = ?, content = ?
      WHERE id = ?`
      , [title, content, id]);

    conn.release();
    return response;
  }
  catch {
    conn.release();
    return null;
  }
}

async function deletePost(id) {
  try {
    const conn = await connPool.getConnection();
    const [response] = await conn.query(`
      DELETE from Posts 
      WHERE id = ?`
      , [id]);

    conn.release();
    return response;
  }
  catch {
    conn.release();
    return null;
  }
}

async function getComments(postId) {
  const conn = await connPool.getConnection();

  try {
    const [response] = await conn.query(`
      SELECT * from Comments 
      WHERE post_id = ?
      ORDER BY published DESC`
      , [postId]);

    if (response.length == 0) {
      conn.release();
      return null;
    }
    else {
      conn.release();
      return response;
    }
  }
  catch {
    conn.release();
    return null;
  }
}

async function addComment(data) {
  const conn = await connPool.getConnection();
  try {
    const [response] = await conn.query(`
      INSERT INTO Comments (post_id, content, author, published)
      VALUES (?, ?, ?, NOW())`
      , [data.postId, data.content, data.author, data.published]);

    conn.release();
    return response.insertId;
  }
  catch {
    conn.release();
    return null;
  }
}

async function deleteComment(id) {
  try {
    const conn = await connPool.getConnection();
    const [response] = await conn.query(`
      DELETE from Comments 
      WHERE id = ?`
      , [id]);

    conn.release();
    return response;
  }
  catch {
    conn.release();
    return null;
  }
}

async function getUserPosts(user) {
  const conn = await connPool.getConnection();

  try {
    const [response] = await conn.query(`
      SELECT * from Posts 
      WHERE author = ?
      ORDER BY published DESC`
      , [user]);

    if (response.length == 0) {
      conn.release();
      return null;
    }
    else {
      conn.release();
      return response;
    }
  }
  catch {
    conn.release();
    return null;
  }
}

async function userExists(username) {
  const conn = await connPool.getConnection();
  try {
    const [response] = await conn.query(`
      SELECT * from Users
      WHERE username = ?`
      , [username]);
    conn.release();

    return response.length > 0;
  }
  catch {
    conn.release();
    return null;
  }
}



module.exports = {
  createUser,
  validateUser,
  admin,
  getPost,
  addPost,
  getPosts,
  editPost,
  deletePost,
  getComments,
  addComment,
  deleteComment,
  getUserPosts,
  userExists
};
