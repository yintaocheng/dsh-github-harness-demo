# dsh-github-harness-demo

这是 [dsh-github-harness](https://github.com/yintaocheng/dsh-github-harness) 的独立**目标项目**，不是插件源码或另一个安装包。

- 插件负责执行；本仓库只保存示例业务代码、任务 Issue、审查 PR 与可核对的结果。
- 每次运行绑定本仓库的一项任务。同一仓库可以有多项独立任务，当前每次仍只运行一个 agent。
- 任务成果先保留在 PR，不自动合并到 `main`。

## 目标项目基线

Node.js 22+，无第三方依赖：

```sh
node --test test/*.test.mjs
```

`main` 起始仅有一个项目标识函数和一个基线测试。任务将分别实现 Issue 引用解析与检查结果汇总；真实结果将在执行完成后记录，不把计划写成已验证结论。

## 实际记录

- [历史验证存档](evidence/history-before-separation.md)：此前在插件仓库中进行的演示和安装验证，保留原 Issue/PR/SHA 链接，不冒充本仓库的新执行。
- 本仓库的新任务、提交、测试数量、会话复用与 CI 结果，在对应 Issue/PR 和后续证据页中逐项记录。

## 自己复现

先按[插件安装说明](https://github.com/yintaocheng/dsh-github-harness#readme)安装插件。Fork 本仓库，修改目标 owner/repo 和实际 GitHub 操作身份，确保本地 `origin` 指向你的 Fork。模型和机器路径放在被忽略的本地配置中，不要提交 token。

在目标仓库创建自己的 Issue，然后让 `github_harness` 对**这个目录和 Issue**运行；不要直接向本仓库发布你的测试任务。

## 许可证

[MIT](LICENSE)。历史 GitHub 事实仍保留在其原始 URL，不重写或伪造原记录。
