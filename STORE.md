# Chrome ウェブストアの掲載文（コピー用）

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

---

# 最初の提出のしかた（1 回だけ手動）

## 1. zip を用意する
GitHub の [Releases](https://github.com/nk7-jp/GitHub-ja/releases) にある最新の `GitHub-ja-x.y.z.zip` をダウンロードする（main に push したときに自動で作られる）。

## 2. 新しいアイテムを作る
1. [デベロッパーダッシュボード](https://chrome.google.com/webstore/devconsole) →「新しいアイテム」
2. zip をアップロード

## 3. 「ストアの掲載情報」タブ
| 項目 | 入れるもの |
|---|---|
| 説明 | 上の「説明」をコピー |
| カテゴリ | デベロッパー ツール |
| 言語 | 日本語 |
| ストアアイコン | 自動（manifest の 128px） |
| スクリーンショット | `store/screenshot-1-setup.png`、`store/screenshot-2-popup.png`、`store/screenshot-3-mt.png`（＋実際の GitHub の画面があれば） |
| 小さいプロモーションタイル | `store/small-tile-440x280.png` |
| 公式 URL | なし |
| ホームページ URL | https://github.com/nk7-jp/GitHub-ja |
| サポート URL | https://github.com/nk7-jp/GitHub-ja/issues/new |

## 4. 「プライバシー」タブ
| 項目 | 入れるもの |
|---|---|
| 単一用途の説明 | GitHub の画面を日本語で表示する（画面の文言を辞書で日本語に置き換え、用語にカーソルを乗せると意味を表示する。辞書にない短い文章は、利用者がオンにした場合だけ Chrome 内蔵の翻訳機能で端末の中で翻訳する）。 |
| storage の理由 | 日本語化のオンオフや用語の表示方法などの設定を保存するため。 |
| ホスト権限の理由 | github.com と gist.github.com のページの画面の文言を日本語に置き換えるため。辞書と Chrome 内蔵の翻訳機能（端末の中で動く）だけを使い、ページの内容を外部に送信することはない。 |
| リモートコード | 「いいえ、リモートコードを使用していません」 |
| データの使用 | どの項目にもチェックを入れない（収集しない）。下の 3 つの宣言にはチェックを入れる |
| プライバシーポリシーの URL | https://nk7.jp/policy/privacy/github-ja/ |

## 5. 「配布」タブ
- 公開設定：公開
- 地域：すべての地域

## 6. 審査に提出
「審査のため送信」を押す。ダッシュボードの URL かアイテムの画面に出る 32 文字の ID（英小文字）を控える。

## 7. 自動提出をオンにする
GitHub-ja のリポジトリ → Settings → Secrets and variables → Actions →「**Variables**」タブ →「New repository variable」
- Name：`CWS_EXTENSION_ID`
- Value：控えた ID

入れたら Actions →「ストア接続チェック」→「Run workflow」で接続を確かめる。
これ以降は `extension/manifest.json` の `version` を上げて main に push するだけで、自動でストアに提出される。
