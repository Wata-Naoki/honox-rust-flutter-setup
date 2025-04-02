# Circle Monorepo

フロントエンド（Hono X）、API（Rust）、モバイル（Flutter）を含むモノレポ構成のプロジェクト

## プロジェクト構成

```bash
circle/
├── apps/
│   ├── frontend/  # Hono X フロントエンド
│   ├── api/       # Rust API
│   └── mobile/    # Flutter モバイルアプリ
└── packages/
    └── shared/    # 共有コード
```

## 必要条件

- Node.js 18以上
- Rust（Cargo）
- Flutter
- pnpm（推奨）

## 環境構築

### 共通

```bash
# pnpmのインストール（まだインストールしていない場合）
npm install -g pnpm

# モノレポの依存関係のインストール
pnpm install

# lefthookのインストール
pnpm lefthook install
```

### フロントエンド（Hono X）

```bash
# Node.jsのインストール（まだインストールしていない場合）
brew install node

# フロントエンドの依存関係のインストール
cd apps/frontend
pnpm install
```

### API（Rust）

```bash
# Rustのインストール（まだインストールしていない場合）
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# cargo-watchのインストール（開発時のホットリロード用）
cargo install cargo-watch

# APIの依存関係のインストール
cd apps/api
cargo build
```

### モバイル（Flutter）

```bash
# Flutterのインストール（まだインストールしていない場合）
# macOS
brew install flutter

# または公式サイトからダウンロード
# https://flutter.dev/docs/get-started/install

# Flutterの依存関係のインストール
cd apps/mobile
flutter pub get
```

### VSCode拡張機能

VSCodeでプロジェクトを開くと、推奨拡張機能のインストールが提案される

主な拡張機能：

- **Biome**: JavaScriptとTypeScriptのリンティングとフォーマット
- **Rust Analyzer**: Rust言語のサポート
- **Flutter/Dart**: Flutterとダート言語のサポート

VSCodeの設定（`.vscode/settings.json`）では、以下の機能が有効になっている：

- 保存時の自動フォーマット
- Biomeによるコード整形とリンティング
- 各言語に適したフォーマッタの設定

## pnpm-workspace.yaml について

`pnpm-workspace.yaml`はpnpmのワークスペース設定ファイルで、モノレポ内のパッケージを定義。このファイルにより、pnpmはモノレポ内の複数のパッケージを一元管理できる。

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

この設定により、`apps`と`packages`ディレクトリ内のすべてのパッケージがワークスペースの一部として認識され、以下のメリットがある：

- 共通の依存関係を一度だけインストールし、重複を避ける
- パッケージ間の依存関係を簡単に管理できる
- ルートディレクトリから一括でコマンドを実行できる

## 開発

### 個別サービスの起動

```bash
# フロントエンド開発サーバーの起動
pnpm dev:frontend

# APIサーバーの起動
pnpm dev:api

# モバイルアプリの起動
pnpm dev:mobile
```

### 組み合わせサービスの起動

```bash
# すべてのサービスを一度に起動
pnpm dev:all

# フロントエンドとAPIを起動
pnpm dev:frontend-api

# モバイルアプリとAPIを起動
pnpm dev:mobile-api
```

## リンティングとフォーマット

```bash
# リンティング
pnpm lint

# フォーマット
pnpm format
```

## サンプルアプリケーション

Todoアプリのサンプル

- フロントエンド（Hono X）: Todoリストの表示と追加
- API（Rust）: TodoデータのCRUD操作を提供するREST API
- モバイル（Flutter）: TodoリストをモバイルUIで表示・操作
