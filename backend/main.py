from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import models
import schemas
import auth
from database import engine, get_db

# usersテーブルを作成する
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Budget Book API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/register", response_model=schemas.MessageResponse, status_code=status.HTTP_201_CREATED)
def register(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    """ユーザ登録: ユーザIDとパスワードをデータベースに保存する"""
    existing = db.query(models.User).filter(models.User.username == user_in.username).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="このユーザー名はすでに使用されています。",
        )
    new_user = models.User(
        username=user_in.username,
        hashed_password=auth.hash_password(user_in.password),
    )
    db.add(new_user)
    db.commit()
    return {"message": "ユーザー登録が完了しました。"}


@app.post("/login", response_model=schemas.Token)
def login(user_in: schemas.UserLogin, db: Session = Depends(get_db)):
    """ログイン: 入力されたユーザIDとパスワードを照合する"""
    user = db.query(models.User).filter(models.User.username == user_in.username).first()
    if not user or not auth.verify_password(user_in.password, user.hashed_password):
        # 照合失敗時にログイン失敗レスポンスを返す
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="ユーザー名またはパスワードが正しくありません。",
            headers={"WWW-Authenticate": "Bearer"},
        )
    # 照合成功時にログイン成功レスポンスを返す
    access_token = auth.create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}
