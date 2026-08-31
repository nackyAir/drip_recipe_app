# Coffee Recipe App

## 概要

- バリスタ目線に沿ったコーヒーのドリップレシピを管理するアプリ。
- シンプルなデザインでコーヒーのレシピの作成、編集が可能。

## 採用技術

#### DB : Supabase (PostgreSQL) + Drizzle ORM

#### 認証 : Better Auth (Email / Password, Google)

#### 言語 : TypeScript

#### フレームワーク : Next.js App Router

#### デザイン : Tailwind CSS / Mantine

#### デプロイ : Vercel

## セットアップ

1. [Supabase](https://supabase.com/) でプロジェクトを作成する
2. `.env.example` をコピーして `.env` を作成する
3. Supabase の接続文字列を設定する
   - `DATABASE_URL`: Transaction pooler（ポート 6543）
   - `DIRECT_URL`: Direct connection（ポート 5432、マイグレーション用）
4. `BETTER_AUTH_SECRET` を生成する（`openssl rand -base64 32`）
5. Google ログインを使う場合は OAuth クライアントを作成し、リダイレクト URI に `{BETTER_AUTH_URL}/api/auth/callback/google` を登録する
6. スキーマを適用する

```bash
yarn db:push
```

または Supabase の SQL Editor で `drizzle/0000_init.sql` を実行する。

```bash
yarn install
yarn dev
```

## 今後の実装予定

- EmailPassword認証(バリデーション実装次第リリース)
- レシピのColumnを増やす
- 店舗とバリスタを紐づけし、店舗ベースでのレシピ管理する機能
- レシピの検索機能
- レシピのタグ機能
- レシピのいいね機能
- レシピのシェア機能

その他、バリスタさんのご意見、ご指摘等を踏まえ、煮つめて行く予定。
