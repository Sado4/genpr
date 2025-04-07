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
以下のPRテンプレートに沿って、Pull Request の説明文をマークダウン形式で作成してください。

- 出力には**テンプレートのすべてのセクションを含めてください**
- 各コミットの内容は2〜3行で要約し、短縮コミットハッシュ（例: \`abc1234\`）を文頭に記載してください
- **リンク（例: [abc1234](...)）にはせず、ハッシュをプレーンテキストとして出力してください**
- 要約は、テンプレート内に「対応内容」や変更点を記述するセクション（例：\`## 対応内容\`, \`## Changes\`）がある場合はその下に、なければ適切な位置に \`### コミット差分\` として記載してください
- 意図や背景の推測は含めず、**コード上の事実に基づいた簡潔な説明**のみを記述してください
- 最後に1行でPRタイトルを記載してください

## テンプレート

${template}

## コミット差分

${commitSection}
`.trim()
        : `
Please generate a Pull Request description based on the template below in **Markdown** format.

- Include **all sections from the template** in your output
- Summarize each commit in 2–3 lines, starting with the short commit hash (e.g. \`abc1234\`)
- **Do not use Markdown links (e.g. [abc1234](...)) — only plain hash text**
- If the template contains a section for describing changes (e.g., \`## Changes\`, \`## What was changed\`), place a subheading \`### Commit Summary\` under it. If not, choose a suitable place.
- Keep the descriptions factual and concise — avoid inferred intent or background context
- Finish with a one-line PR title

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
