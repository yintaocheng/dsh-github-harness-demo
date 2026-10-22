# v0.3.1 单 agent 验证记录 · 2026-10-22

本页是独立目标仓库的公开证据摘要，配套[机器可读记录](2026-10-22.json)为人工筛选的字段，不是本地原始记录的复制。插件源码与目标项目保持分离；这里验证单 agent 的执行、反馈续跑和 Host 兼容性，不宣称多 agent 协作。

## Issue #5 → 同一 PR #6、同一 root session

- 任务：[Issue #5](https://github.com/yintaocheng/dsh-github-harness-demo/issues/5)；交付：[PR #6](https://github.com/yintaocheng/dsh-github-harness-demo/pull/6)。验收对象为 `clampNumber`。
- 两轮共用 root session：`session-be2a97e1-3dcb-4266-8910-fa81fd424efa`。

| 阶段 | 固定提交 | 实际执行入口 |
| --- | --- | --- |
| 首轮 | [`affa6365a4508c9beef2b1c24e205521518f8c67`](https://github.com/yintaocheng/dsh-github-harness-demo/commit/affa6365a4508c9beef2b1c24e205521518f8c67) | 已安装 v0.3.1 CLI → 桌面 DSH `0.2.1-rc.2` |
| 反馈续跑 | [`216c23b631a651621587648e0e42ba7f65ecd170`](https://github.com/yintaocheng/dsh-github-harness-demo/commit/216c23b631a651621587648e0e42ba7f65ecd170) | 已安装 v0.3.1 CLI → 桌面 DSH `0.2.1-rc.2` |

任务使用独立、隔离的 `DSH_HOME`；子执行会话采用 `workspace-write`，审批关闭（no approvals）。这不是从插件源码目录直接运行的替代演示，也没有借用生产会话。

### 最新提交的独立验收

以下是外部验收执行结果，不是模型自述；冻结的验收程序不由任务 agent 修改。

| 验收单位 | 结果 | 范围 |
| --- | --- | --- |
| 仓库测试 `node --test test/*.test.mjs` | **5 passed，退出 0** | 最新反馈提交的仓库测试 |
| 冻结外部程序 1：`node --input-type=module -e …` | **退出 0**；`HARNESS_CLAMP_ACCEPTANCE_OK` | 区间夹取、负数、小数、等值边界；三个参数的非有限值/非数字拒绝；反向区间拒绝 |
| 冻结外部程序 2：`node --input-type=module -e …` | **退出 0**；`HARNESS_CLAMP_FEEDBACK_OK` | `TypeError` 信息指出 `value` / `min` / `max`；等值边界仍正确 |

两段完整、冻结的验收程序收录在[公开 JSON](2026-10-22.json)中。**5 个测试与 2 个外部程序是不同验收单位，不能相加写成 7 tests。**

PR 记录的两个 `test` checks 均为 `completed / success`：

- [检查记录一](https://github.com/yintaocheng/dsh-github-harness-demo/actions/runs/39781340718/job/119833087228)
- [检查记录二](https://github.com/yintaocheng/dsh-github-harness-demo/actions/runs/39781333852/job/119833064093)

这两个链接按原记录列出，不额外推断各自对应哪一轮提交。[PR #2](https://github.com/yintaocheng/dsh-github-harness-demo/pull/2) 与 [PR #4](https://github.com/yintaocheng/dsh-github-harness-demo/pull/4) 保持不变；PR #2、#4、#6 **均未合并**。

## 12 项 Host 矩阵

候选插件版本均为 `0.3.1`。三个实际运行时各验证四种组合，共 **12 cases**；这里的“通过”包括预期的权限拒绝，不能解释为受限模式下成功执行写操作。

| 运行时 | native / full | native / read-only | native / workspace-write | PTC / full |
| --- | --- | --- | --- | --- |
| 旧桌面端 DSH `0.2.0-rc.2` | 通过，含 disposal cancellation | 通过：I/O 前原生权限拒绝 | 通过：I/O 前原生权限拒绝 | 通过 |
| 官方 npm CLI DSH `0.2.1-rc.2` | 通过，含 disposal cancellation | 通过：I/O 前原生权限拒绝 | 通过：I/O 前原生权限拒绝 | 通过 |
| 当前桌面端 DSH `0.2.1-rc.2` | 通过，含 disposal cancellation | 通过：I/O 前原生权限拒绝 | 通过：I/O 前原生权限拒绝 | 通过 |

- `full` 指 Host 的 `danger-full-access`；所有 12 项均注册工具成功。
- 六个 full 用例均验证 canonical output、两个项目的 task/session 隔离及进程 cwd 不变。
- 三个 native/full 用例均启动实际调用并验证插件 disposal 会取消活动调用。
- 六个受限 native 用例均在 I/O 前拒绝调用；不是放宽权限后再“通过”。Host 权限门与前述任务子会话的 `workspace-write` 是不同层次。
- “官方 npm CLI”指 DSH 运行时的来源，不是本插件已发布到 npm 的证据。

## 真实模型的旧版 → 最新桌面端连续性

这是独立于 Issue #5 的兼容性验证，不与该任务的 root session 混用。

| 顺序 | 运行时 | 结果 |
| --- | --- | --- |
| 1 | 旧桌面端 DSH `0.2.0-rc.2` | 创建独立资格验证会话并完成真实模型调用 |
| 2 | 最新桌面端 DSH `0.2.1-rc.2` | 在同一 root session 中续跑，验证此前上下文 |
| 3 | 最新桌面端 DSH `0.2.1-rc.2` | 再次续跑成功 |

三次共用 `session-823b38c5-6fe8-42bd-b5cb-7ac19ded5e10`，是实际模型连续性而不是仅比较会话字符串。**没有复制生产会话**；公开记录只保留运行标识与结论，不公开模型全文、上下文探针或本地配置。

## 公开 GitHub 标签的全新安装

在另一个全新隔离 profile 中，通过官方插件管理器安装 `github:yintaocheng/dsh-github-harness#v0.3.1`。逐个核对运行源码与已验收候选包一致（仅归一化 LF/CRLF），并在桌面 DSH `0.2.1-rc.2` 中完成 native 与 PTC 调度、规范输出和项目隔离检查；native 还验证了卸载取消。

这是发布后的 **GitHub 来源安装验收**，单独于前述 12 项候选包矩阵，也不是 npm registry 安装验收。

## 插件源码发布与 tarball qualification

| 项目 | 证据 |
| --- | --- |
| 插件源码提交 | [`573bed5afea47d93a935c802d52b030e766d32d6`](https://github.com/yintaocheng/dsh-github-harness/commit/573bed5afea47d93a935c802d52b030e766d32d6)，已推送 |
| 不变标签 | [`v0.3.1`](https://github.com/yintaocheng/dsh-github-harness/tree/v0.3.1)，已推送并固定上述源码提交 |
| 源码 CI | [`test`：completed / success](https://github.com/yintaocheng/dsh-github-harness/actions/runs/39784469380) |
| 插件本地测试 | **195 passed**，仅插件测试口径 |
| 候选 tarball 内容审计 | **30 files**；排除全部 collaboration / App 模块和本地 artifacts |

以下摘要只标识**已通过资格验证的 tarball（tarball qualification）**，不代表 npm registry 上已存在对应发布：

```text
package: dsh-github-harness@0.3.1
integrity: sha512-uSAVW0JEAGVW1ImGINccPF5BA975cs+2ch+xwS5Cpp7OAYUkB4w8iCddAnsfP50rU8+SMz2xscSgZ4FJHh008w==
sha256: 25edb004589126a633fdef1fdd70637a995ee4ef286dc15ae140f01d208730a3
```

**本文不将候选包验收等同于 npm 发布。** npm 版本是否可用需查询官方 registry 并核对下载完整性；源码推送、标签、CI 成功与 tarball 资格验证是不同的证据。

## 计数、历史与公开边界

- 本次最新任务：**5 个仓库测试 + 两个分别退出 0 的外部程序**，不是插件的测试总数。
- 插件本地：**195 passed**；Host 矩阵：**12 cases**；真实模型连续性：**3 次调用**。这些各有口径，不能混加。
- [2026-10-04 历史证据](repository-separation.md)中的 **9 / 13 / 11** 是不同演示阶段，各自包含一个基线测试，保持原日期、数字与边界不变。
- 目标仓库 `main` 仍只有 **1 个基线测试**；任务成果留在未合并 PR 中。本页不把 PR 结果冒充为 `main` 的测试结果。
- 不自动 approve、投票或 merge，不向 agent 授予仓库权限；不把单 agent 续跑描述成协作能力。
- 公开 JSON 仅收录必要的版本、固定提交、公开 GitHub URL、匿名化验证结论、会话/运行标识及无秘密的外部验收程序；不复制个人绝对路径、home/profile 路径、provider/model 设置、token、登录 URL 或完整模型转录。
- 本页整理既有证据，不声称在文档整理期间重新运行了命令、CI 或网络查询。
