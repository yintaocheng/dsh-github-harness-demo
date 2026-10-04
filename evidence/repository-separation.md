# 仓库分离与 v0.3.0：实际执行记录

[← 演示 README](../README.md) · [机器记录](2026-10-04.json)

日期：2026-10-04，Asia/Shanghai。环境：Windows、Node.js v22.19.0、Git 2.51.0.windows.1、DSH 桌面携带 runtime 0.2.0-rc.2。实际 GitHub 操作身份为 `yintaocheng`。

## 插件与目标仓库确实分离

- [插件](https://github.com/yintaocheng/dsh-github-harness)：代码、测试、MIT 许可证、配置模板和安装文档。
- [目标项目](https://github.com/yintaocheng/dsh-github-harness-demo)：最小业务代码、任务和本页证据。
- 目标基线为 [`63af9a7`](https://github.com/yintaocheng/dsh-github-harness-demo/commit/63af9a79832d66202c518884caf231887c72941d)，只有一个项目标识函数和一个基线测试。
- 两个仓库的默认分支 LICENSE 均通过 GitHub API 识别为 MIT；主仓库有 `dsh-plugin` topic，演示仓库不打该插件发现标签。

## A. Issue #1：首轮实现与升级续跑

[Issue #1](https://github.com/yintaocheng/dsh-github-harness-demo/issues/1)明确限定输入格式、非法输入和验收命令。

### 首轮：固定 v0.2.0

使用已安装的固定发布版本 [`337146e`](https://github.com/yintaocheng/dsh-github-harness/commit/337146e281c981135d4d60ceac6a5648dfbefc0b)，执行目录显式指向演示仓库。

- 时段：20:50:37–20:53:17（UTC+8）。
- 交付短引用解析函数及测试，没有修改插件代码。
- 提交：[`006bdd0`](https://github.com/yintaocheng/dsh-github-harness-demo/commit/006bdd0fd698603fb86570848385071c9d64389e)。
- 独立验收：**9 tests、9 pass、0 fail、0 skipped、exit 0**，见[原始 TAP](logs/issue-1-initial.tap)。
- [PR CI](https://github.com/yintaocheng/dsh-github-harness-demo/actions/runs/37203665401)和[push CI](https://github.com/yintaocheng/dsh-github-harness-demo/actions/runs/37203662541)均为 success。
- 创建 [PR #2](https://github.com/yintaocheng/dsh-github-harness-demo/pull/2)。

### 续跑：v0.3.0 + 执行者标识修改

[反馈](https://github.com/yintaocheng/dsh-github-harness-demo/pull/2#issuecomment-5980401768)要求增加完整 GitHub Issue URL，拒绝外站、HTTP、账号密码、端口、查询串、fragment、编码路径等输入。

插件更新到 [`53b3603`](https://github.com/yintaocheng/dsh-github-harness/commit/53b3603efebe7c25d763dd49f34f0dc339dea993)，本地 `agent.id` 从 `solo` 改为 `executor-b`；GitHub 账户没有更换。

- 时段：21:24:38–21:27:55（UTC+8）。
- 修改仍只有[解析器](https://github.com/yintaocheng/dsh-github-harness-demo/blob/e3fd624339d706690c376d4a674504f7b23802cd/src/issue-reference.mjs)与[解析器测试](https://github.com/yintaocheng/dsh-github-harness-demo/blob/e3fd624339d706690c376d4a674504f7b23802cd/test/issue-reference.test.mjs)。
- 提交：[`e3fd624`](https://github.com/yintaocheng/dsh-github-harness-demo/commit/e3fd624339d706690c376d4a674504f7b23802cd)。
- 独立验收：**13 tests、13 pass、0 fail、0 skipped、exit 0**，见[原始 TAP](logs/issue-1-feedback.tap)。
- [PR CI](https://github.com/yintaocheng/dsh-github-harness-demo/actions/runs/37205707299)与[push CI](https://github.com/yintaocheng/dsh-github-harness-demo/actions/runs/37205703995)均为 success。
- 更新同一个 [PR #2](https://github.com/yintaocheng/dsh-github-harness-demo/pull/2)及[Issue 检查点](https://github.com/yintaocheng/dsh-github-harness-demo/issues/1#issuecomment-5980136531)，没有另建任务 PR。

两次的 session ID 都是：

```text
session-c35ef884-fa89-4ab0-8ec5-6c910bd7b41c
```

旧分支 `harness/solo/issue-1` 与旧 artifact alias 保留；业务 key 已与执行者名称解耦。这证明旧任务的非破坏性兼容，不证明已支持并行多 agent 或更换 GitHub 账户。

## B. Issue #3：同仓库第二项独立任务

[Issue #3](https://github.com/yintaocheng/dsh-github-harness-demo/issues/3)要求独立实现 `summarizeChecks`：计数通过/失败、校验输入、不修改输入。明确不依赖 Issue #1 的分支，也不实现投票或合并策略。

- 时段：21:30:28–21:32:45（UTC+8），插件 v0.3.0。
- 从 `main` 基线出发，使用新分支 `harness/issue-3`。
- 修改只有[汇总函数](https://github.com/yintaocheng/dsh-github-harness-demo/blob/4882a95eebcee6c143395882d7bfe47eb36c9c4c/src/check-summary.mjs)及[对应测试](https://github.com/yintaocheng/dsh-github-harness-demo/blob/4882a95eebcee6c143395882d7bfe47eb36c9c4c/test/check-summary.test.mjs)。
- 提交：[`4882a95`](https://github.com/yintaocheng/dsh-github-harness-demo/commit/4882a95eebcee6c143395882d7bfe47eb36c9c4c)。
- 独立验收：**11 tests、11 pass、0 fail、0 skipped、exit 0**，见[原始 TAP](logs/issue-3-initial.tap)。
- 创建 [PR #4](https://github.com/yintaocheng/dsh-github-harness-demo/pull/4)与[检查点](https://github.com/yintaocheng/dsh-github-harness-demo/issues/3#issuecomment-5980521563)。
- [PR CI](https://github.com/yintaocheng/dsh-github-harness-demo/actions/runs/37206002969)与[push CI](https://github.com/yintaocheng/dsh-github-harness-demo/actions/runs/37205998525)均为 success。

本任务 session 不同于 Issue #1：

```text
session-f0e2a7e6-33b4-4099-a3aa-d38d3ae0bf3e
```

两个任务均已发布且 PR 保持 open / not merged。没有把两个任务的源代码或测试数量混在一起。

## C. 已发布版本的安装与 Host 工具

安装来源：

```text
github:yintaocheng/dsh-github-harness#v0.3.0
```

在新建隔离 `DSH_HOME` / headless 测试 profile 中，使用桌面自带官方 CLI 安装。pnpm 实际下载：

```text
https://codeload.github.com/yintaocheng/dsh-github-harness/tar.gz/53b3603efebe7c25d763dd49f34f0dc339dea993
```

安装新增 1 个包，完整 Loader 启动后确认实际包版本 0.3.0、license=MIT、`github_harness` 注册成功。

- `read-only`：工具调用被权限门拒绝。
- 独立 full-access 测试进程：同一个已安装工具读取**插件仓库 Issue #1**及**演示仓库 Issue #1**，业务 key 与 session 均不同，`process.cwd()` 没有改变。
- 演示仓库 `doctor`：operator=`yintaocheng`，四类 GitHub GET 读取为 `ok`，DSH help exit 0；写权限仍为 `unverified`，没有拿读取成功冒充写权限探测。

pnpm 有 “git-hosted package has to be built but build scripts were ignored” 提示；本包是直接运行的 ESM，没有 prepare/postinstall。保持 `--ignore-scripts` 后真实 Loader 与工具均成功，没有为提示放行脚本。

这不是当前 GUI 的点击安装实测，没有修改、关闭或重启用户正在使用的 desktop profile，也没有启动替代 Web 服务。隔离 DSH 状态不是 OS 恶意代码隔离。

## D. 插件回归与验证依据

插件固定提交 [`53b3603`](https://github.com/yintaocheng/dsh-github-harness/commit/53b3603efebe7c25d763dd49f34f0dc339dea993)的独立发布验收为 **120 tests、120 pass、0 fail、0 skipped**，见[Windows 原始 TAP](logs/plugin-v0.3.0.tap)。该 SHA 的[插件 CI](https://github.com/yintaocheng/dsh-github-harness/actions/runs/37205261873)为 success。

120 是插件回归数，不是目标项目测试数。目标项目的 9 / 13 / 11 分别属于上述三个阶段和不同树。

Agent 内部尝试默认 Node 测试时报告过 `spawn EPERM`，并进行了补充检查；其摘要保留了“仍需外层验证”的说明。之后可信 harness 在授权的执行层运行**原配置命令**，取得 exit 0，并将证明绑定到实际 tree 与 verifyHash，才允许提交/推送。这里没有修改 ACL、放宽测试条件或把 agent 的自述当作验收证明。

## 没有声称完成的事

- npm 登录/发布和镜像同步：按维护者决定暂停，未发布。
- 多 agent 并行、多个 GitHub 身份交接、maintainer 权限授予、独立 GitHub approve、多数计票或自动合并：未实现。
- 本轮没有做真实缓存删除/断电实验；旧记录歧义和缓存丢失恢复由回归测试覆盖，不能当作新的现场实测。
- 原插件仓库的历史演示 PR 没有迁移、合并或重写，保留在[历史记录](history-before-separation.md)所指向的原址。
