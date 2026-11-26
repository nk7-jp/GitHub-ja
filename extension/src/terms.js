// 用語集：画面上で「カタカナ (English)」と表示し、カーソルを乗せると説明が出る言葉
//
//   id: { ja: 画面に出す日本語, en: 英語の正式名, desc: ひとことで言うと何か, more: もう少しくわしく（任意）,
//         plain: true なら、設定にかかわらずいつも日本語で出す（「実行」「差分」のような普通の言葉） }
//
// 辞書（dict-ja.js）からは [[id]] や [[id|英語の表記]] の形で呼び出す。
globalThis.GHJA_TERMS = {
	repository: {
		ja: 'リポジトリ', en: 'Repository',
		desc: 'プロジェクトのフォルダと、その変更履歴ぜんぶをまとめたもの。',
		more: '略して repo。GitHub 上の 1 つのプロジェクトの置き場所。'
	},
	commit: {
		ja: 'コミット', en: 'Commit',
		desc: '「ここまでの変更」をセーブポイントとして記録すること。また、その記録 1 つ 1 つ。',
		more: 'ゲームのセーブデータのようなもの。何を変えたかのメッセージと、ID（a0913d4 のような英数字）が付く。'
	},
	branch: {
		ja: 'ブランチ', en: 'Branch',
		desc: '本線から分けた作業用の世界線。ここで壊しても本線（main）は無事。',
		more: 'うまくいったら本線に「マージ」して合流させる。'
	},
	tag: {
		ja: 'タグ', en: 'Tag',
		desc: '特定のコミットに付けた名札。「v1.0」のようにバージョンの目印に使う。'
	},
	pr: {
		ja: 'プルリクエスト', en: 'Pull request',
		desc: '「このブランチの変更を取り込んでいい？」というお願いと、そのレビューの場。',
		more: '略して PR。変更点の確認、コメント、自動テストの結果を見てからマージする。'
	},
	issue: {
		ja: 'イシュー', en: 'Issue',
		desc: '不具合の報告や、やりたいことのメモを書いておく掲示板。',
		more: '番号（#123）が付き、プルリクエストから「これで直した」と結び付けられる。'
	},
	fork: {
		ja: 'フォーク', en: 'Fork',
		desc: '他人のリポジトリを、GitHub 上で自分のアカウントにまるごとコピーすること。',
		more: '自分のPCにコピーするのは「クローン」。フォークは GitHub の中でのコピー。元に変更を送るときはプルリクエストを出す。'
	},
	star: {
		ja: 'スター', en: 'Star',
		desc: '「いいね」兼「ブックマーク」。あとで見返したいリポジトリに付ける。'
	},
	watch: {
		ja: 'ウォッチ', en: 'Watch',
		desc: 'リポジトリの更新（新しいイシューやプルリクエストなど）を通知で受け取る設定。'
	},
	merge: {
		ja: 'マージ', en: 'Merge',
		desc: '別のブランチの変更を合流させること。'
	},
	clone: {
		ja: 'クローン', en: 'Clone',
		desc: 'リポジトリを履歴ごと自分のPCにコピーすること。'
	},
	release: {
		ja: 'リリース', en: 'Release',
		desc: '「このバージョンを公開しました」というお知らせと、配布用ファイルの置き場所。'
	},
	actions: {
		ja: 'アクション', en: 'Actions',
		desc: 'GitHub Actions。プッシュなどをきっかけに、テストや公開を自動で動かす仕組み。'
	},
	workflow: {
		ja: 'ワークフロー', en: 'Workflow',
		desc: 'GitHub Actions で「いつ・何を自動で実行するか」を書いた手順書（.github/workflows/ の YAML ファイル）。'
	},
	run: {
		ja: '実行', en: 'Run', plain: true,
		desc: 'ワークフローが 1 回動いた記録。成功（✓）・失敗（✗）・実行中がわかる。'
	},
	contributor: {
		ja: 'コントリビューター', en: 'Contributor',
		desc: 'そのリポジトリにコミットが取り込まれたことがある人。'
	},
	discussion: {
		ja: 'ディスカッション', en: 'Discussions',
		desc: '質問や雑談のための掲示板。イシューより気軽な話し合いに使う。'
	},
	project: {
		ja: 'プロジェクト', en: 'Projects',
		desc: 'イシューやプルリクエストをカンバン（ボード）や表で管理する機能。'
	},
	insights: {
		ja: 'インサイト', en: 'Insights',
		desc: 'コミット数や参加者などの統計を見るページ。'
	},
	readme: {
		ja: 'README', en: 'README',
		desc: 'リポジトリの説明書。トップページの下に表示される README.md のこと。'
	},
	license: {
		ja: 'ライセンス', en: 'License',
		desc: 'このコードを他の人がどう使っていいかの決まり（MIT、GPL など）。'
	},
	review: {
		ja: 'レビュー', en: 'Review',
		desc: 'プルリクエストの変更を読んで、承認したり直してほしい点を伝えたりすること。'
	},
	diff: {
		ja: '差分', en: 'Diff', plain: true,
		desc: '前と比べて何が変わったか。緑（+）が足した行、赤（-）が消した行。'
	},
	conflict: {
		ja: 'コンフリクト', en: 'Conflict',
		desc: '2 つの変更が同じ場所を別々に書き換えていて、自動で合流できない状態。人が選んで直す。'
	},
	draft: {
		ja: '下書き', en: 'Draft', plain: true,
		desc: 'まだ作業中で、マージしてほしい段階ではないプルリクエスト。'
	},
	label: {
		ja: 'ラベル', en: 'Label',
		desc: 'イシューやプルリクエストに付ける色付きの分類（bug、enhancement など）。'
	},
	milestone: {
		ja: 'マイルストーン', en: 'Milestone',
		desc: '「v2.0 までにやること」のように、イシューやプルリクエストを締め切りごとにまとめるもの。'
	},
	assignee: {
		ja: '担当者', en: 'Assignee', plain: true,
		desc: 'そのイシューやプルリクエストを担当する人。'
	},
	blame: {
		ja: 'ブレーム', en: 'Blame',
		desc: 'ファイルの各行を「誰が・いつ・どのコミットで」書いたかを表示する画面。'
	},
	raw: {
		ja: 'Raw', en: 'Raw',
		desc: 'ファイルを装飾なしの中身だけで表示する。そのままダウンロードしたいときに使う。'
	},
	check: {
		ja: 'チェック', en: 'Checks',
		desc: 'プルリクエストやコミットに対して自動で動いたテストなどの結果。'
	},
	codespace: {
		ja: 'Codespaces', en: 'Codespaces',
		desc: 'ブラウザの中で動く開発環境（クラウド上の VS Code）。'
	},
	gist: {
		ja: 'Gist', en: 'Gist',
		desc: 'コードの断片やメモを手軽に共有するための、小さなリポジトリ。'
	},
	sponsor: {
		ja: 'スポンサー', en: 'Sponsor',
		desc: '開発者やプロジェクトにお金で支援する GitHub の仕組み。'
	},
	ssh: {
		ja: 'SSH', en: 'SSH',
		desc: '鍵を使って安全に接続する方法。登録しておくとパスワードなしで push / pull できる。'
	},
	https: {
		ja: 'HTTPS', en: 'HTTPS',
		desc: 'URL で接続する方法。いちばん手軽だが、push のときにログインやトークンが必要。'
	},
	push: {
		ja: 'プッシュ', en: 'Push',
		desc: '自分のPCのコミットを GitHub に送ること。'
	},
	pull: {
		ja: 'プル', en: 'Pull',
		desc: 'GitHub の新しいコミットを受け取って、自分のブランチに合流させること。'
	},
	squash: {
		ja: 'スカッシュ', en: 'Squash',
		desc: '複数のコミットを 1 つにまとめること。「Squash and merge」は 1 つにまとめてからマージする。'
	},
	rebase: {
		ja: 'リベース', en: 'Rebase',
		desc: 'コミットを別の土台の上に付け替えること。「Rebase and merge」は履歴を一直線にしてマージする。'
	},
	revert: {
		ja: 'リバート', en: 'Revert',
		desc: '過去のコミットを「打ち消すコミット」を新しく作って、変更を元に戻すこと。'
	},
	archive: {
		ja: 'アーカイブ', en: 'Archive',
		desc: '更新を止めて読み取り専用にしたリポジトリ。中身は見られるが変更はできない。'
	},
	visibility: {
		ja: '公開範囲', en: 'Visibility', plain: true,
		desc: 'Public は誰でも見られる。Private は自分と招待した人だけ。'
	},
	collaborator: {
		ja: 'コラボレーター', en: 'Collaborator',
		desc: 'リポジトリに招待されて、書き込みなどができるようになった人。'
	},
	token: {
		ja: 'トークン', en: 'Token',
		desc: 'パスワードの代わりに使う合い言葉。権限と期限を決めて発行する。他人に見せないこと。'
	},
	secret: {
		ja: 'シークレット', en: 'Secret',
		desc: 'GitHub Actions で使うパスワードや鍵を、コードに書かずに保存しておく場所。'
	},
	webhook: {
		ja: 'Webhook', en: 'Webhook',
		desc: 'プッシュなどが起きたとき、指定した URL に自動でお知らせを送る仕組み。'
	},
	deploy: {
		ja: 'デプロイ', en: 'Deploy',
		desc: '作ったものを実際のサーバーやサイトに反映して、使える状態にすること。'
	},
	environment: {
		ja: '環境', en: 'Environment', plain: true,
		desc: 'デプロイ先（本番、テストなど）ごとの設定のまとまり。'
	},
	pages: {
		ja: 'Pages', en: 'GitHub Pages',
		desc: 'リポジトリのファイルを、そのまま Web サイトとして無料で公開できる機能。'
	},
	copilot: {
		ja: 'Copilot', en: 'Copilot',
		desc: 'GitHub の AI アシスタント。'
	},
	dependabot: {
		ja: 'Dependabot', en: 'Dependabot',
		desc: '使っているライブラリに古いものや危ないものがないか見張って、更新のプルリクエストを自動で作るボット。'
	},
	ci: {
		ja: 'CI', en: 'CI',
		desc: '継続的インテグレーション。変更のたびに自動でビルドやテストをして、壊れていないか確かめること。'
	},
	head: {
		ja: 'HEAD', en: 'HEAD',
		desc: '今いる場所（今見ているコミット）を指す目印。'
	},
	main: {
		ja: 'main', en: 'main',
		desc: '本線のブランチの名前。昔は master と呼ばれていた。'
	},
	upstream: {
		ja: 'アップストリーム', en: 'Upstream',
		desc: 'フォークの元になったリポジトリ。または、ブランチの送り先・受け取り元。'
	},
	origin: {
		ja: 'origin', en: 'origin',
		desc: 'クローンしたときに付く、リモート（GitHub 側）のあだ名。'
	}
};
