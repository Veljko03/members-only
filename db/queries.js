const pool = require("./pool");

async function insertNewMessage(title, mess, id) {
  await pool.query(
    "INSERT INTO messages (title,text,author_id) VALUES ($1, $2,$3)",
    [title, mess, id]
  );
}

async function insertNewUser(full_name, username, hashedPassword) {
  await pool.query(
    "INSERT INTO users (full_name,username, password) VALUES ($1, $2,$3)",
    [full_name, username, hashedPassword]
  );
}

async function getAllPosts() {
  const a = await pool.query(`
    SELECT 
        title,
        text,
        timestamp,
        full_name,
        username
    FROM 
        messages
    INNER JOIN 
        users
    ON 
        messages.author_id = users.id
    ORDER BY 
        messages.timestamp DESC;
  `);
  return a.rows;
}

module.exports = {
  insertNewMessage,
  insertNewUser,
  getAllPosts,
};
