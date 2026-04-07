import os

import jwt
import psycopg2
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from passlib.hash import bcrypt

app = FastAPI()

cors_origin = os.getenv("CORS_ORIGIN", "http://localhost:8080")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[cors_origin],
    allow_credentials=True,
    allow_methods=["*"] ,
    allow_headers=["*"] ,
)

jwt_secret = os.getenv("JWT_SECRET", "dev_secret_change_me")


def get_db_conn():
    return psycopg2.connect(
        host=os.getenv("DB_HOST", "localhost"),
        port=int(os.getenv("DB_PORT", "5432")),
        user=os.getenv("DB_USER", "user"),
        password=os.getenv("DB_PASSWORD", "password"),
        dbname=os.getenv("DB_NAME", "budget_db"),
    )


@app.get("/api/health")
def health():
    return {"ok": True}


@app.post("/api/auth/register")
def register(payload: dict):
    username = (payload or {}).get("username")
    password = (payload or {}).get("password")

    if not username or not password:
        raise HTTPException(status_code=400, detail="username と password は必須です")

    if len(password) < 8:
        raise HTTPException(status_code=400, detail="password は8文字以上にしてください")

    with get_db_conn() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT id FROM users WHERE username = %s", (username,))
            if cur.fetchone():
                raise HTTPException(status_code=409, detail="このユーザー名は既に使われています")

            password_hash = bcrypt.hash(password)
            cur.execute(
                "INSERT INTO users (username, password_hash) VALUES (%s, %s)",
                (username, password_hash),
            )
            conn.commit()

    return {"message": "登録が完了しました"}


@app.post("/api/auth/login")
def login(payload: dict):
    username = (payload or {}).get("username")
    password = (payload or {}).get("password")

    if not username or not password:
        raise HTTPException(status_code=400, detail="username と password は必須です")

    with get_db_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT id, username, password_hash FROM users WHERE username = %s",
                (username,),
            )
            row = cur.fetchone()
            if not row:
                raise HTTPException(status_code=401, detail="ユーザー名またはパスワードが違います")

            user_id, user_name, password_hash = row
            if not bcrypt.verify(password, password_hash):
                raise HTTPException(status_code=401, detail="ユーザー名またはパスワードが違います")

    token = jwt.encode({"sub": user_id, "username": user_name}, jwt_secret, algorithm="HS256")
    return {"token": token}
