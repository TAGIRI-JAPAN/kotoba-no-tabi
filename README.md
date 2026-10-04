# ことばの旅 — Kotoba no Tabi

日本語の地域表現を、会話・聞き取り・ひとこと辞典で学ぶ静的サイトです。
156地域、1,893本の会話・聞き取り、1,807件の地域表現カードを収録。
日本語・英語・ミャンマー語・シンハラ語・インドネシア語・フィリピン語に対応。

## 公開する手順

推奨リポジトリ名：`kotoba-no-tabi`。別名でも動作します。
このZIPには、直下に `index.html` と `assets` フォルダが入っています。
ZIPファイル自体をアップロードしてもサイトは表示されません。解凍した中身を配置します。

1. GitHubで新しい **Public** リポジトリ `kotoba-no-tabi` を作成する。`Add a README file` を有効にし、最初のコミットを作る。
2. GitHub Desktop（https://desktop.github.com/）にログインし、`File > Clone repository` でそのリポジトリを選び、Cloneする。
3. GitHub Desktopの `Repository > Show in Explorer`（Macは `Show in Finder`）で保存先を開く。
4. ZIPを解凍し、**解凍フォルダの中身すべて**を保存先へコピーする。READMEの置き換えは許可する。隠しファイルを表示し、`.nojekyll` も含める（Windowsはエクスプローラーの隠しファイル表示、MacはCommand + Shift + .）。ZIPを保存先に直接解凍してもよい。
5. 保存先を開いてすぐ `index.html` と `assets` が見えることを確認する。`dist` や `kotoba-no-tabi-github` という外側のフォルダを丸ごと入れない。
6. GitHub DesktopでSummaryに `Add Kotoba no Tabi` と入力し、`Commit to main`、続けて `Push origin` を押す。
7. GitHubのリポジトリ画面で **Settings > Pages** を開く。
8. Sourceを **Deploy from a branch**、Branchを **main**、フォルダを **/(root)** にして **Save**。
9. Pagesの画面に公開URLが表示され、Actionsの `pages build and deployment` が成功したら、そのURLを開く。

公開URLの形式：`https://あなたのGitHubユーザー名.github.io/kotoba-no-tabi/`
リポジトリ名を変えた場合、URLの最後の名前も変わります。

## ファイルが欠けるのを防ぐ

画像・フォントを含めてファイル数が100件を超えます。
GitHubのブラウザ画面のアップロードは一度に100ファイルまでなので、この一式は上記のGitHub Desktopでまとめて反映してください。
すべてのファイルは25MiB未満です。ファイル名や `assets` 内の階層を変更する必要はありません。
`.nojekyll` は表示されない場合がありますが、コピーする中に含めてください。リポジトリ画面で存在を確認できます。
ブラウザ上のREADME表示はサイトではありません。Settings > Pagesに表示された公開URLから開きます。

## 確認するところ

- `index.html` がリポジトリ直下にある。
- Pagesが `main / (root)` を参照している。
- `assets` フォルダがあり、画像とフォントが揃っている。
- トップに1,893本、地域のことばに1,803本と表示される。
- 言語選択、地域の絞り込み、会話の次へ・戻るが動く。
- ブラウザの再読み込み後も、開いていた会話に戻れる。

音声ファイルがない発話は、利用端末の日本語読み上げ機能を使います。
端末の日本語音声の有無により再生環境は異なり、地域のアクセントを再現した録音ではありません。
学習記録は同じブラウザ・同じ公開URLの中に保存します。以前のサイトの記録は別URLへ自動では移りません。

## 公式手順

- ファイル追加・100ファイルの制限：https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository
- GitHub DesktopでClone：https://docs.github.com/en/desktop/adding-and-cloning-repositories/cloning-and-forking-repositories-from-github-desktop
- Pages設定：https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

この構成はビルド、npmのインストール、APIキーの設定なしで公開できます。
