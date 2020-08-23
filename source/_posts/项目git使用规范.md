---
title: 项目git使用规范
date: 2020-08-03 10:10:10
tags: Git
---

### 项目 git 使用规范

#### 分支规范

##### 功能分支

feature-(姓名简称)-(jira 号/任务 ID)

feature-jzh-XXXXXXXID

##### 上线分支

release-(年月日)

release-20200803

##### 冲突分支

conflict-(姓名简称)-(年月日)

conflict-jzh-20200803

conflict-jzh-20200803-1

##### 测试/灰度修复分支

bugfix-(jira 号/任务 ID)

##### 线上修复分支

hotfix-(年月日)

hotfix-20200803

#### Commit Message 规范

```visual basic
feat: 新特性
fix: 修改问题
refactor: 代码重构
docs: 文档修改
style: 代码格式修改, 注意不是 css 修改
test: 测试用例修改
chore: 其他修改, 比如构建流程, 依赖管理.
```

在 commit 的时候需要增加上面中的类型：

```bash
git commit -m "fix: 解决xxxxxxx问题"
```

#### Merge Request 规范

标题格式为：

```visual basic
[jiraID/任务ID][姓名]feat:描述
注意是英文字符的中括号 []
```

#### Code Review

由项目 Leader/同事 进行 review 代码，review 完成之后 进行评论 LGFM 后合并分支
