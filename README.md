# dsh-github-harness-demo

这是 [dsh-github-harness 插件](https://github.com/yintaocheng/dsh-github-harness)的独立**目标项目**，不是插件源码或另一个安装包。任务、代码变更和具体执行证据放在这里；安装与通用配置请看[插件主仓库](https://github.com/yintaocheng/dsh-github-harness#readme)。

## 最新证据：2026-10-22 · v0.3.1

[Issue #5](https://github.com/yintaocheng/dsh-github-harness-demo/issues/5) → [PR #6](https://github.com/yintaocheng/dsh-github-harness-demo/pull/6)：首轮与反馈复用同一 root session；最新独立验收为 **5 个仓库测试通过，另有 2 个冻结的外部验收程序各自退出 0**，两个 PR checks 均成功。计数不与插件本地的 195 个测试、下方历史阶段或 `main` 的 1 个基线测试相加。PR #2 / #4 未改动，三个任务 PR 均未合并。

[完整证据](evidence/single-agent-v0.3.1.md) · [机器可读记录](evidence/2026-10-22.json)：包含 12 项 Host 矩阵、真实模型会话连续性、源码提交与已推送标签，以及候选 tarball 资格验证；**不代表 npm 发布**；npm 版本是否可用以官方 registry 为准。

## 2026-10-04 的具体演示

所有任务都由独立 DSH headless 会话实际执行，随后由可信 harness **另外运行** `node --test test/*.test.mjs`，成功后才发布。下列数字来自对应提交的独立验收，不是模型口述：

| 任务 / 阶段 | 实际交付 | 验收 | 提交与审查 |
| --- | --- | --- | --- |
| [Issue #1](https://github.com/yintaocheng/dsh-github-harness-demo/issues/1)，v0.2.0 首轮 | `parseIssueReference` 解析 `owner/repo#N`；拒绝非法类型、空白、路径和编号 | 9 tests / 9 pass / 0 fail | [`006bdd0`](https://github.com/yintaocheng/dsh-github-harness-demo/commit/006bdd0fd698603fb86570848385071c9d64389e) → [PR #2](https://github.com/yintaocheng/dsh-github-harness-demo/pull/2) |
| 同一任务升级到 v0.3.0 后续跑 | 按[审查反馈](https://github.com/yintaocheng/dsh-github-harness-demo/pull/2#issuecomment-5980401768)增加 GitHub Issue URL 支持；拒绝外站、HTTP、凭据、端口、query/fragment 和编码路径 | 13 tests / 13 pass / 0 fail | [`e3fd624`](https://github.com/yintaocheng/dsh-github-harness-demo/commit/e3fd624339d706690c376d4a674504f7b23802cd)，仍是 **PR #2** |
| [Issue #3](https://github.com/yintaocheng/dsh-github-harness-demo/issues/3)，v0.3.0 新任务 | `summarizeChecks` 汇总通过/失败数量；验证输入类型与不修改输入 | 11 tests / 11 pass / 0 fail | [`4882a95`](https://github.com/yintaocheng/dsh-github-harness-demo/commit/4882a95eebcee6c143395882d7bfe47eb36c9c4c) → [PR #4](https://github.com/yintaocheng/dsh-github-harness-demo/pull/4) |

这些是三个不同执行阶段，**不能把 9、13、11 相加当作一个版本的测试总数**。它们都包含一个基线测试，且对应准确 head 的 GitHub CI 均成功，见[完整证据](evidence/repository-separation.md)。

### 这轮实际验证的边界

- 插件源码留在另一个仓库，执行目录是本仓库，没有把插件复制进目标项目。
- 第一个任务从 v0.2.0 升级到 v0.3.0，并把执行者标识从 `solo` 改为 `executor-b`，仍复用原会话、旧分支和 PR #2。这里验证的是**标识更改兼容**，不是多个 agent 协作。
- 第二个任务使用另一条分支、另一会话和 PR #4，没有借用第一个任务的代码或会话。
- 安装后的同一个 Host 工具还读取了两个不同仓库的 Issue #1，任务 key 与会话不同，进程 cwd 未改变。
- 两个演示 PR **均未合并**。不自动 approve、投票或 merge，也没有给 agent 授予仓库权限。

## 查看成果或复现

`main` 只保留目标项目基线和演示说明；成果保留在 PR，所以直接在 `main` 执行测试得到 **1 个基线测试**，不是上表的 PR 分支结果。

例如只读检出 Issue #1 的最终提交进行验证：

```sh
git fetch origin
git switch --detach e3fd624339d706690c376d4a674504f7b23802cd
node --test test/*.test.mjs
git switch main
```

要自己运行 harness：

1. 按[插件说明](https://github.com/yintaocheng/dsh-github-harness#readme)安装固定版本。
2. Fork 本仓库并准备本地 checkout；按需要启用 Fork 的 Issues / Actions。
3. 修改目标 owner/repo、实际 GitHub 操作身份及本地模型配置，确保 `origin` 指向自己的 Fork；不要提交 token。
4. 创建自己的任务 Issue，要求 `github_harness` 对**该目录和 Issue**执行。不要向本演示仓库发布你的测试任务。

## 证据与许可证

- [本轮逐项证据、固定 SHA、会话与 CI](evidence/repository-separation.md)
- [机器可读记录](evidence/2026-10-04.json)
- [分离前的历史验证](evidence/history-before-separation.md)：原插件仓库的旧 Issue/PR 保留原址，没有转移或改写历史。
- [MIT 许可证](LICENSE)

Agent 内部曾报告标准 Node 测试受到 `spawn EPERM` 限制；外层 harness 随后按原验收命令成功执行并绑定提交树。**发布依据是外层退出码和验证记录，不是 agent 自述。** 没有为了演示关闭权限保护或弱化验收命令。
