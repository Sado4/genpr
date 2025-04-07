import * as vscode from "vscode";
import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

export async function activate(context: vscode.ExtensionContext) {
  const lang = vscode.env.language;
  const isJa = lang.startsWith("ja");

  const disposable = vscode.commands.registerCommand(
    "genpr.generatePrompt",
    async () => {
      const parentBranch = await vscode.window.showInputBox({
        prompt: isJa
          ? "親ブランチ名を入力してください（例: main）"
          : "Enter the parent branch name (e.g., main)",
      });

      if (!parentBranch) return;

      const workspaceFolders = vscode.workspace.workspaceFolders;
      if (!workspaceFolders) {
        vscode.window.showErrorMessage(
          isJa
            ? "ワークスペースが開かれていません。"
            : "No workspace folder is open."
        );
        return;
      }

      const rootPath = workspaceFolders[0].uri.fsPath;

      // テンプレート読み込み
      let template = isJa
        ? "テンプレートが見つかりませんでした。"
        : "No pull request template found.";

      const githubDir = path.join(rootPath, ".github");
      if (fs.existsSync(githubDir)) {
        const found = findTemplateFile(githubDir);
        if (found) {
          template = fs.readFileSync(found, "utf-8");
        }
      }

      // コミットログ整形
      let commitBlocks: string[] = [];
      try {
        const logOutput = execSync(
          `git log ${parentBranch}..HEAD --pretty=format:"__COMMIT__%h|%s" -p --reverse`,
          { cwd: rootPath }
        ).toString();

        const logs = logOutput.split("__COMMIT__").slice(1);

        for (const block of logs) {
          const [line, ...diffLines] = block.split("\n");
          const [shortHash, subject] = line.split("|");

          const diff = diffLines.join("\n").trim();
          const entry = `### ${shortHash} ${subject}\n\n\`\`\`diff\n${diff}\n\`\`\``;
          commitBlocks.push(entry);
        }
      } catch (err) {
        vscode.window.showErrorMessage(
          isJa
            ? "git log の取得に失敗しました。"
            : "Failed to get git log diff."
        );
        return;
      }

      const commitSection = commitBlocks.join("\n\n");

      const prompt = isJa
        ? `
以下の各コミットの流れと注意書きを理解し、以下のPRテンプレートに沿ってPR説明文を作成してください。

- 出力は**マークダウン形式**にしてください
- コード差分から直接確認できる内容のみに基づいて記述してください
- 推測、主観的な判断、意図や目的の説明、抽象的な評価表現などは禁止です
- 変更された事実のみを、客観的かつ簡潔に記述してください
- 出力において例示・装飾的な言い回し・背景の推定を含めないでください
- 各コミットを2〜3行で要約し、短縮コミットハッシュ（例: \`abc1234\`）を文頭に記載してください
- **リンク形式（[abc1234](...)）ではなく、テキストとしてのハッシュのみを記載してください**
- 要約は「## 対応内容」など、PRに対して対応した内容が記されたものを記載するようなセクションがあればその下に、\`### コミット差分\` セクションとして出力してください
- 最後にPRタイトルを1行で記載してください

## テンプレート

${template}

## コミット差分

${commitSection}
`.trim()
        : `
Understand the following commits and the guidelines below, then generate a Pull Request description based on the provided template.

- Output should be in **Markdown format**
- Only describe facts that can be confirmed from the code diff
- **Do not infer intent, purpose, or subjective evaluations**
- Avoid abstract phrases, background assumptions, or examples
- Write concise and objective summaries of what was actually changed
- Summarize each commit in 2–3 lines, starting with the short commit hash (e.g. \`abc1234\`)
- **Do NOT use links like [abc1234](...) — use plain hash text only**
- Place the summary under a section like "## Changes" using a subheading \`### Commit Summary\`
- Add a one-line PR title at the end

## Template

${template}

## Commit diff

${commitSection}
`.trim();

      await vscode.env.clipboard.writeText(prompt);
      vscode.window.showInformationMessage(
        isJa
          ? "📋 プロンプトをクリップボードにコピーしました！"
          : "📋 Prompt has been copied to your clipboard!"
      );
    }
  );

  context.subscriptions.push(disposable);
}

function findTemplateFile(dir: string): string | null {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      const found = findTemplateFile(fullPath);
      if (found) return found;
    }

    if (
      entry.isFile() &&
      entry.name.toLowerCase() === "pull_request_template.md"
    ) {
      return fullPath;
    }
  }

  return null;
}

export function deactivate() {}
