---
title: 刚clone下来项目，submodule更新不成功
date: 2020-07-15 10:10:10
tags: Git
---

##刚clone下来项目，submodule更新不成功

###问题

开发过程中，我们可能会引入一个公共库来提供工程来使用，而公共代码库的版本管理是个麻烦的事情。我并遇到在clone一个项目到本地，在启动该项目前需要将该工程的子模块仓库下载下来。执行命令：

```bash
git submodule update --init --recursive
```

但遇到下面这个报错

```bash
fatal: No url found for submodule path '子模块名称' in .gitmodules
npm ERR! code ELIFECYCLE
npm ERR! errno 128
npm ERR! 项目名 install-submodule: `git submodule update --init --recursive`
npm ERR! Exit status 128
npm ERR!
npm ERR! Failed at the 项目名 install-submodule script.
npm ERR! This is probably not a problem with npm. There is likely additional logging output above.
```

### 解决方法

```bash
# 逆初始化模块，其中{MOD_NAME}为模块目录，执行后可发现模块目录被清空
git submodule deinit 子模块名
# 删除.gitmodules中记录的模块信息（--cached选项清除.git/modules中的缓存）
git rm --cached 子模块名
```

### 补充

为当前工程添加submodule，命令如下：

```bash
git submodule add 仓库地址 路径
```

其中，仓库地址是指子模块仓库地址，路径指将子模块放置在当前工程下的路径。 