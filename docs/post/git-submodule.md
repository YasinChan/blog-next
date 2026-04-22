---
date: 2020-05-22
tag:
  - git
  - tech
excerpt: 有一种场景，在我们的主仓库下需要引入其他仓库的，同时要保持双方的独立。此时，我们可以使用 git 提供的 git submodules 方法
---

# git 子仓库管理

::: tip
有这样一种场景：主仓库下需要引入另一个仓库，同时又要保持两个仓库的独立。这时可以使用 git 提供的 `git submodule` 功能。
:::

## 场景

假设我们有一个主仓库 `git-father`：

```
/xxx/git-father
├── .git
└── README.md
```

现在需要将另一个仓库 `git-sub` 引入到 `git-father` 中。

### 引入子仓库

```bash
# 在主仓库 git-father 下执行
git submodule add git@github.com:YasinChan/git-sub.git git-sub
```

执行后，子仓库会被引入到主仓库下，同时会生成一个 `.gitmodules` 配置文件：

```
/xxx/git-father
├── .git
├── .gitmodules
├── README.md
└── git-sub
```

### 更新子仓库

```bash
# 方法一
git submodule foreach git pull origin master
# 方法二
cd git-sub
git pull origin master
```

### 克隆一个包含子仓库的仓库

前面说到主仓库和子仓库是互相独立的，所以无论是 push 还是 pull 操作都需要单独执行。也就是说，我们在 clone 主仓库时，并不会同时把子仓库 clone 下来。这种情况下可以这样操作：

```bash
# 克隆主仓库
git clone git@github.com:YasinChan/git-father.git
```

此时目录结构如下：

```
/xxx/git-father
├── .git
├── .gitmodules
├── README.md
└── git-sub
# git-sub 是一个空的文件夹
```

接着执行：

```bash
git submodule init
# 提示：Submodule 'git-sub' (git@github.com:YasinChan/git-sub.git) registered for path 'git-sub'
```

再执行：

```bash
git submodule update
```

此时 `git-sub` 的内容就会被拉取下来。

### .gitmodules

这个配置文件记录了项目 URL 与本地目录之间的映射关系。前面提到的所有 `git submodule` 相关操作，读取的都是这个文件的配置。
