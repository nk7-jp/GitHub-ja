# プライバシーポリシー（Japanese UI & Glossary for GitHub / GitHub-ja）

最終更新：2026年11月26日（v0.4.0）

この拡張機能は、利用者のデータを収集・送信・販売しません。

- **翻訳はブラウザの中だけで行います。** 拡張機能に入っている辞書を使って GitHub の画面の文言を置き換えます。ページの内容を外部のサーバーや翻訳サービスに送ることはありません。
- **機械翻訳（任意）**：設定でオンにした場合だけ、辞書にない短い文章（GitHub の変更履歴のお知らせなど）を、Chrome に内蔵された翻訳機能（Translator API）で翻訳します。翻訳は端末の中で行われ、この拡張機能が文章を外部に送ることはありません。初回だけ、Chrome が英語→日本語の言語パックを Google からダウンロードします。
- **保存するもの**
  - 設定（日本語化のオンオフ、用語の表示方法、用語の説明のオンオフ）：Chrome の同期ストレージに保存します。Google アカウントで Chrome の同期をオンにしている場合、ほかの端末の Chrome と同期されます。
  - 機械翻訳をオンにしたときだけ、翻訳した文章と訳文を、同じ文章を何度も翻訳しないためにこの端末の中に保存します（最大 800 件）。
  - 「訳されていない言葉を集める」をオンにしたときだけ、訳のなかった画面の文言と、それが出たページの種類（例：`/:owner/:repo/settings`）を、この端末の中に保存します。ポップアップの「消去」でいつでも消せます。利用者が自分でコピーして送らない限り、どこにも送信されません。
- **アクセスするサイト**：github.com と gist.github.com だけです。

お問い合わせ：https://github.com/nk7-jp/GitHub-ja/issues

---

This extension does not collect, transmit, or sell any user data. Translation happens entirely in your browser using a bundled dictionary and, if you turn it on, Chrome's built-in on-device Translator API. Only your settings (stored in Chrome sync storage) and, if you opt in, a local list of untranslated UI strings are saved.
