# Chrome ウェブストアの掲載文

ストアの掲載情報を変えるときの控え。画像は `store/` にある（`compose-*.html` から作り直せる）。

## 名前
Japanese UI & Glossary for GitHub

## 概要（132 文字まで）
GitHub の画面を自然な日本語に。用語はカーソルを乗せると意味がわかる。翻訳はすべて端末の中。Japanese UI and Git glossary for GitHub (unofficial).

## カテゴリ
デベロッパー ツール

## 説明
GitHub の画面を、ブラウザの自動翻訳ではなく「ちゃんとした日本語」にする拡張機能です。

■ できること
・メニュー、ボタン、設定画面など GitHub の決まった文言を、辞書を使って自然な日本語で表示します
・Pull request、Fork、Branch などの Git / GitHub の用語には点線が付き、カーソルを乗せると「要するに何をしているのか」の説明が出ます
・用語の表示は「カタカナ」「カタカナ (英語)」「英語のまま」から選べます（インストール直後に見本を見ながら選べます）
・日付や「3 hours ago」などの時間も日本語で表示します
・辞書にない文章（GitHub の変更履歴のお知らせなど）は、設定でオンにすると Chrome 内蔵の翻訳機能で日本語にします。訳した文には「訳」の印が付き、カーソルを乗せると原文が出ます（パソコン版 Chrome 138 以降）
・ツールバーのアイコンから、いつでも英語に戻せます

■ 訳さないもの
README、コード、コメント、Issue や Pull request の題名、コミットメッセージ、ファイル名、ユーザー名、検索欄は訳しません。ブラウザの自動翻訳のように、コードや文章が書き換わることはありません。

■ プライバシー
翻訳はすべてブラウザの中で行います。画面の文言は拡張機能に入っている辞書で、辞書にない文章は Chrome に内蔵された翻訳機能（端末の中で動く AI）で訳します。ページの内容を外部のサーバーや翻訳サービスに送ることはありません。

■ ソースコード
https://github.com/nk7-jp/GitHub-ja
誤訳や訳のない文言は、GitHub の Issue で教えてください。

GitHub は GitHub, Inc. の商標です。この拡張機能は GitHub, Inc. とは関係のない非公式のものです。

―――

One-click Japanese UI for GitHub with a built-in Git glossary. Translates only GitHub's fixed interface text using a bundled dictionary — README files, code, comments, titles and names are never touched. Optionally, short texts such as changelog headlines are translated with Chrome's built-in on-device Translator API. Nothing is sent outside your browser. Unofficial; not affiliated with GitHub, Inc.

## 権限の説明（審査で聞かれたら）
- storage：設定（日本語化のオンオフ、用語の表示方法など）と、機械翻訳の結果のキャッシュを保存するため
- github.com へのアクセス：GitHub のページの文言を日本語に置き換えるため

## プライバシー
- ユーザーデータは収集しない
- 単一用途：GitHub の画面の日本語化（用語の説明と、オンにした場合の端末内での翻訳を含む）

## ストアの URL
| 項目 | URL |
|---|---|
| 公式 URL | nk7.jp（ダッシュボードの一覧から選ぶ） |
| ホームページ | https://github.com/nk7-jp/GitHub-ja |
| サポート | https://github.com/nk7-jp/GitHub-ja/issues/new |
| プライバシーポリシー | https://nk7.jp/policy/privacy/github-ja/ |
