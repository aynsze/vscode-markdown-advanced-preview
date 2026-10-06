# Markdown Advanced Preview

A VSCode extension that adds table‑copying and demo features to Markdown Preview.

VS Code標準のMarkdown Previewに、表のコピー機能とデモ機能を追加するVSCode拡張機能

- [表のコピー機能](#表のコピー機能)
- [デモ機能](#デモ機能)
- [サンプル画像](#サンプル画像)
- [インストール方法](#インストール方法)
- [特定のフォルダのみ有効したい場合](#特定のフォルダのみ有効したい場合)
- [動作確認用markdown](#動作確認用markdown)

## 表のコピー機能

セル内に `<!-- copy -->` を入れると、一番右の列にコピーボタンが表示され、セル内の文字列をコピーできる

- ### 1つのみの場合

  記述例：

  ```md
  | 分類 | 正規表現                |
  | ---- | ----------------------- |
  | 英字 | `[A-Za-z]`<!-- copy --> |
  ```

  コピーされる文字列：

  ```text
  [A-Za-z]
  ```

- ### 複数行の場合

  複数のセルに `<!-- copy -->` を入れることも可能

  記述例：

  ```md
  | 分類 | 正規表現                |
  | ---- | ----------------------- |
  | 英字 | `[A-Za-z]`<!-- copy --> |
  | 数字 | `[0-9]`<!-- copy -->    |
  ```

## デモ機能

HTML・CSS・JavaScriptを組み合わせたデモをMarkdown Preview内に表示できる

| 対応言語   | 対応開始バージョン |
| ---------- | ------------------ |
| HTML       | 1.0.0              |
| CSS        | 1.0.0              |
| JavaScript | 1.0.0              |

### 記述方法

> [!WARNING]
>
> `demo` の中に書いたコードが最優先される

- ### 直前のコードブロックを利用

  `demo` の中にコードがない場合、直前のコードブロックを利用する

  ````md
  ```html
  <button type="button">開く</button>
  ```

  <!-- demo -->
  ````

  上記は、以下と同じ

  ````md
  <!-- demo

  ```html
  <button type="button">開く</button>
  ```

  -->
  ````

- ### CSSの宣言を自動的に `div` で囲む

  通常のコードブロックから取得したCSSに `{` がない場合、CSSの宣言として扱い、自動的に `div { ... }` で囲む

  ````md
  ```css
  background: red;
  ```

  <!-- demo

  ```html
  <div>背景色を指定</div>
  ```

  -->
  ````

  上記は、以下と同じ

  ````md
  <!-- demo

  ```html
  <div>背景色を指定</div>
  ```

  ```css
  div {
    background: red;
  }
  ```

  -->
  ````

- ### コードの補完

  `demo` の中にHTML・CSS・JavaScriptのいずれかがない場合、同じセクション内の直前のコードブロックから補完する

  ````md
  ```css
  input {
    accent-color: red;
  }
  ```

  <!-- demo

  ```html
  <input type="checkbox" checked>
  ```

  -->
  ````

  上記は、以下と同じ

  ````md
  <!-- demo

  ```html
  <input type="checkbox" checked>
  ```

  ```css
  input {
    accent-color: red;
  }
  ```

  -->
  ````

## サンプル画像

![サンプル画像](https://raw.githubusercontent.com/aynsze/Pages/main/assets/vscode-markdown-advanced-preview_sample.png)

## インストール方法

1. GitHubの[Releases](https://github.com/aynsze/vscode-markdown-advanced-preview/releases)を開く
2. `Assets` から一番上の `markdown-advanced-preview-<バージョン>.vsix` をダウンロード
3. VSCodeを開いて、拡張機能一覧を開く
4. 上部にある `...` → `VSIXからのインストール...`を押す
5. `markdown-advanced-preview-<バージョン>.vsix` を選択
6. 動作確認

## 特定のフォルダのみ有効したい場合

1.  有効にしたいフォルダを開いたウィンドウで拡張機能ページを開く
2.  ページ上部のアイコン隣の`無効にする`を押す
3.  すると、「この拡張機能はユーザーによってグローバルに無効化されています。」が表示される
4.  `有効にする`のボタンにある`∨`を押す
5.  `有効にする（ワークスペース）`を押す

## 動作確認用Markdown

<details>
<summary>サンプル</summary>

````md
# Markdown Advanced Preview

- ### 表のコピー機能

  | 分類 | 正規表現                |
  | ---- | ----------------------- |
  | 英字 | `[A-Za-z]`<!-- copy --> |
  | 数字 | `[0-9]`<!-- copy -->    |

- ### 直前のコードブロックを利用

  ```html
  <button type="button">開く</button>
  ```

  <!-- demo -->

- ### CSSの宣言を自動的に `div` で囲む

  ```css
  background: red;
  ```

  <!-- demo

  ```html
  <div>背景色を指定</div>
  ```

  -->

- ### コードの補完

  ```css
  input {
    accent-color: red;
  }
  ```

  <!-- demo

  ```html
  <input type="checkbox" checked>
  ```

  -->
````

</details>
