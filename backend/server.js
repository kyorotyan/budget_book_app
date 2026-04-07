const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER || "user",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "budget_db"
});

const jwtSecret = process.env.JWT_SECRET || "dev_secret_change_me";
const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:8080";

app.use(cors({ origin: corsOrigin }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/auth/register", async (req, res) => {
  try {
    const { username, password } = req.body || {};

    if (!username || !password) {
      return res.status(400).json({ message: "username と password は必須です" });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "password は8文字以上にしてください" });
    }

    const existing = await pool.query(
      "SELECT id FROM users WHERE username = $1",
      [username]
    );

    if (existing.rowCount > 0) {
      return res.status(409).json({ message: "このユーザー名は既に使われています" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (username, password_hash) VALUES ($1, $2)",
      [username, passwordHash]
    );

    return res.status(201).json({ message: "登録が完了しました" });
  } catch (error) {
    return res.status(500).json({ message: "登録に失敗しました" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body || {};

    if (!username || !password) {
      return res.status(400).json({ message: "username と password は必須です" });
    }

    const result = await pool.query(
      "SELECT id, username, password_hash FROM users WHERE username = $1",
      [username]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({ message: "ユーザー名またはパスワードが違います" });
    }

    const user = result.rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);

    if (!ok) {
      return res.status(401).json({ message: "ユーザー名またはパスワードが違います" });
    }

    const token = jwt.sign(
      { sub: user.id, username: user.username },
      jwtSecret,
      { expiresIn: "7d" }
    );

    return res.json({ token });
  } catch (error) {
    return res.status(500).json({ message: "ログインに失敗しました" });
  }
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
  console.log(`API server listening on ${port}`);
});
