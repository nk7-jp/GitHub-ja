# GitHub-ja

**GitHub の画面を自然な日本語にして、用語の意味もその場でわかる Chrome 拡張機能（非公式）**

ブラウザの自動翻訳を使うと、`Fork` が「フォーク（食器）」、`Branch` が「枝」になったり、README やコードまで訳されてしまったりします。
GitHub-ja は、GitHub の **ボタンやメニューなど決まった文言だけ** を辞書で日本語にします。さらに、専門用語にカーソルを乗せると **「要するに何をしているのか」** の説明が出ます。

| | |
|---|---|
| 日本語化 | `New issue` → **新しいイシュー**、`Settings` → **設定** |
| 用語の説明 | 点線の付いた言葉にカーソルを乗せると、意味とたとえが出る |
| 訳さないもの | README、コード、コメント、イシューや PR の題名、コミットメッセージ、ファイル名、ユーザー名、検索欄 |
| 通信 | なし。翻訳はすべてブラウザの中で、拡張機能に入っている辞書だけで行います |

## 設定

ツールバーのアイコンから切り替えられます。

- **日本語で表示する**：オフにするとその場で英語に戻ります
- **用語の表示**：Git の用語を「カタカナ（プルリクエスト）」「カタカナ (英語)」「英語のまま」から選べます（初期はカタカナ。インストール直後の設定画面でも選べます）
- **用語の説明を出す**：ホバーで説明を出すかどうか
- **訳されていない言葉を集める**：訳のない文言を手元に記録して、コピーできます（辞書づくりへの協力用。どこにも送信されません）

## 開発版を試す

1. このリポジトリをダウンロード（または `git clone`）
2. Chrome で `chrome://extensions` を開き、右上の「デベロッパー モード」をオン
3. 「パッケージ化されていない拡張機能を読み込む」で `extension/` フォルダを選ぶ（ストア版はオフにしておく）

## フォルダ構成

```
extension/
  manifest.json   … 拡張全体の設定。バージョンはここ
  src/dict-ja.js  … 画面の英語 → 日本語の辞書
  src/terms.js    … 用語の説明
  src/content.js  … GitHub のページを訳す本体
  popup/          … ツールバーのアイコンを押したときの設定画面
  welcome/        … インストール直後に開く最初の設定画面
  src/background.js … インストールしたときに最初の設定画面を開く
test/run.js       … jsdom のテスト（cd test && npm i && node run.js）
```

## 更新のしかた

1. `extension/` の中のファイルを直す
2. `extension/manifest.json` の `version` を上げる（例：0.2.0 → 0.2.1）
3. main に push する

version が上がっていれば GitHub Actions（`.github/workflows/release.yml`）が zip を作ってリリースに付け、Chrome ウェブストアにアップロードして審査に出す（Secrets とアイテム ID が設定してあるときだけ）。

### ストア提出に使う Secrets

| 名前 | 中身 |
|---|---|
| `CWS_CLIENT_ID` | Google Cloud の OAuth クライアントID |
| `CWS_CLIENT_SECRET` | 同じクライアントのシークレット |
| `CWS_REFRESH_TOKEN` | `https://www.googleapis.com/auth/chromewebstore` で取ったリフレッシュトークン |
| `CWS_PUBLISHER_ID` | デベロッパーダッシュボードの「アカウント」に出るパブリッシャーID |

ほかの拡張機能（classroom-download など）と同じ値を使える。
アイテム ID は、ストアに初めて手動で提出したあとで、Settings → Secrets and variables → Actions →「Variables」タブに `CWS_EXTENSION_ID` として入れる（Secret ではなく Variable）。

## 辞書に協力する

訳がない・おかしいところを見つけたら、[イシュー](https://github.com/nk7-jp/GitHub-ja/issues) で教えてください。プルリクエストも歓迎です。

- 画面の文言 → [`extension/src/dict-ja.js`](extension/src/dict-ja.js)
  - キーは GitHub の英語と **完全に同じ** にします（前後の空白は無視されます）
  - 用語は `[[pr]]` や `[[pr|Pull requests]]` のように書くと、設定に合わせて「Pull requests」「プルリクエスト (Pull requests)」などで表示され、説明が付きます
- 用語の説明 → [`extension/src/terms.js`](extension/src/terms.js)

### 訳し方の決まり

- Git / GitHub の用語は辞書では `[[ ]]` で書き、表示は設定で選ぶ（カタカナ／カタカナ (英語)／英語のまま）。「実行」「差分」のような普通の言葉はいつも日本語
- 普通の言葉は自然な日本語：Settings → 設定、Cancel → キャンセル
- 「です・ます」は付けない（ボタン・見出し）。説明文だけ「です・ます」
- 製品名はそのまま：GitHub Actions、Codespaces、Copilot

## しくみ

- 画面のテキストを 1 つずつ見て、辞書のキーと **完全一致** したものだけ置き換えます
- README・コード・コメント・題名・名前などは、要素ごと **最初から見ません**
- GitHub は画面を部分的に書き換えるので、変わった部分だけ訳し直します（MutationObserver）
- 日付（`2 days ago` など）は GitHub の日付部品に日本語を指定して表示しています

## プライバシー

この拡張機能は、どのデータも外部に送信しません。保存するのは設定（Chrome の同期ストレージ）と、「訳されていない言葉を集める」をオンにしたときの文言の一覧（この端末のみ）だけです。

## ライセンス

[MIT](LICENSE)

GitHub は GitHub, Inc. の商標です。この拡張機能は GitHub, Inc. とは関係のない非公式のものです。
