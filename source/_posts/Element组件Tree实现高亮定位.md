---
title: Element组件Tree实现高亮定位
date: 2020-08-23 17:10:10
tags:
  - 问题解决
---

## 业务需求

在再编辑回显时，需要`高亮`上次选中的值。当服务组（业务数据只有两层）小于十个时需要全部展开，且需要自动定位至用户可视区域（避免用户需要自己手动滑动寻找）。

## 实现

### tree 配置

```vue
<el-tree
  class="filter-tree"
  node-key="id"
  :data="serviceList"
  :props="defaultProps"
  :default-expand-all="isExpandAll"
  :filter-node-method="filterNode"
  @current-change="currentChange"
  highlight-current
  ref="tree"
>
</el-tree>
```

- `data`便是数据源
- `filter-node-method`实现关键词搜索（需求需要，实现高亮可以不配）
- `node-key="id"`表示使用每个节点的"id"对应的值来表示每个节点(唯一的，使用 setCurrentKey 方法必须设置)
- `highlight-current"`表示高亮选中的节点
- `props`设置为默认格式
- `default-expand-all`表示默认展开所有节点（需求需要动态判断服务组数（计算属性），实现高亮直接给 true 就行）
- `ref="tree"`指代这颗树名为 tree

### 实现高亮

```typescript
// 高亮选中节点
this.$nextTick(() => {
  const eventTree: any = this.$refs.tree;
  // 需要高亮节点的id
  eventTree.setCurrentKey(this.processServiceData.eventId);

  // 实现自动定位（必须要在高亮设置后在滚动，无效）
  this.scrollToCurrentNode();
});
```

`注意：`需要数据渲染后且 DOM 更新后才能设置成功，使用\$nextTick

### 实现定位

```typescript
  // 修改scroll位置
  private async scrollToCurrentNode() {
    // 下一个DOM修改时机
    await this.$nextTick()
    //父组件
    const elDialog: any = this.$parent
    const elTreeOffsetElBody = 80
    const tree: any = this.$refs.tree
    const currentNode = tree.$el.querySelector('.el-tree-node.is-current')
    const dialogBody = elDialog.$el.querySelector('.el-dialog__body')

    // 防止当前没有选中服务报错
    if (currentNode) {
      const currentOffsetTop = currentNode.offsetTop + elTreeOffsetElBody
      dialogBody.scrollTo({
        top: currentOffsetTop,
      })
    }
  }
```

`注意：`由于个人根据需求的组件设计风格，tree 的组件并不是直接扔在 dialog 中，而是再对其封装成只需 v-model 绑定组件。所以大家在取父子组件操作 DOM 时注意一下即可
