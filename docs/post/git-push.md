---
date: 2019-02-01
tag:
  - git
excerpt: ''
---

# 将本地 Git 仓库推送到远程

把本地项目初始化后推到远程仓库，只需要几步。

1. 在远程（GitHub、GitLab 等）新建一个空仓库。
2. 在本地仓库目录依次执行：

   ```bash
   git init

   git add .

   git commit -m '提交说明'

   git remote add origin 远程仓库地址

   git push -u origin master
   ```
