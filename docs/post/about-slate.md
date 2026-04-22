---
date: 2021-11-11
tag:
  - slate
  - rich-editor
sticky: true
excerpt: <p>本文将根据 slate 文档结合实例整理讲述 slate 的部分细节。</p>
---

# slate 系列 - 架构与核心概念

::: tip
本文将结合 [slate 文档](https://docs.slatejs.org/) 与实例，梳理 [slate](https://github.com/ianstormtaylor/slate) 的若干关键细节。
:::

## 简述

slate 是一个完全可定制的富文本编辑器框架，本质上是构建在 React 之上的一个 `div[contenteditable]`。其所有逻辑都是通过插件实现的，因此使用者无需纠结哪些是“核心”、哪些不是。

slate 的主要包只有三个：

1. **slate**：提供编辑器的核心逻辑处理。
2. **slate-react**：负责视图层逻辑（官方维护。slate 的视图层组件还有 Vue、Angular 等衍生品，这里基于 React 的组件由官方维护）。
3. **slate-history**：记录状态，配合撤销/反撤销操作。
4. **slate-hyperscript**：提供 JSX 支持，常用于粘贴 HTML 后做结构转换等场景。

## 细节

slate 的核心逻辑，本质上是对一段数组对象数据的处理。

```json
[
  {
    "type": "paragraph",
    "children": [
      {
        "text": "测试"
      },
      {
        "text": "加粗",
        "bold": true
      },
      {
        "text": "斜体",
        "italic": true
      },
      {
        "text": "下划线",
        "underline": true
      },
      {
        "text": " "
      },
      {
        "children": [
          {
            "text": "链接"
          }
        ],
        "type": "link",
        "info": {
          "url": "https://taptap.com"
        }
      }
    ]
  },
  {
    "id": "sWIx",
    "type": "image",
    "info": {
      "url": "https://img2.tapimg.com/moment/etag/FkNk2byCBYVIw0xr2tA43mSpoxDs.png"
    },
    "children": [
      {
        "text": ""
      }
    ]
  }
]
```

上面这段数组对应的视图大致如下：

![图一](https://qiniu.yasinchan.com/image/image2021-11-17_13-47-43.png)

数组中的两个对象，分别对应视图层的两行。对 slate 而言，每行就是一个对象，所有增删改查最终都落到对这段数组的操作上。

slate 把操作（**Operations**）划分为以下 9 种：

```ts
type BaseInsertNodeOperation = {
  type: 'insert_node';
  path: Path;
  node: Node;
};

type BaseRemoveNodeOperation = {
  type: 'remove_node';
  path: Path;
  node: Node;
};

type BaseInsertTextOperation = {
  type: 'insert_text';
  path: Path;
  offset: number;
  text: string;
};

type BaseRemoveTextOperation = {
  type: 'remove_text';
  path: Path;
  offset: number;
  text: string;
};

type BaseMergeNodeOperation = {
  type: 'merge_node';
  path: Path;
  position: number;
  properties: Partial<Node>;
};

type BaseSplitNodeOperation = {
  type: 'split_node';
  path: Path;
  position: number;
  properties: Partial<Node>;
};

type BaseMoveNodeOperation = {
  type: 'move_node';
  path: Path;
  newPath: Path;
};

type BaseSetNodeOperation = {
  type: 'set_node';
  path: Path;
  properties: Partial<Node>;
  newProperties: Partial<Node>;
};

type BaseSetSelectionOperation =
  | {
      type: 'set_selection';
      properties: null;
      newProperties: Range;
    }
  | {
      type: 'set_selection';
      properties: Partial<Range>;
      newProperties: Partial<Range>;
    }
  | {
      type: 'set_selection';
      properties: Range;
      newProperties: null;
    };
```

这些操作构成了一份完整的步骤记录，也是 `undo` / `redo` 能够实现的基础。在此之上，为了降低使用者的心智负担，slate 又做了两层封装：**Transform** 和 **Editor**。

**Transform** 在内部统一消化了对 `Range` 的处理。

更上层的是 `Commands`，也就是 **Editor**。所谓“降低心智负担”，意思是调用 **Editor** 时通常不再需要手动传递路径等参数。可以把它理解为对 **Transform** 的进一步封装。

举个例子，**Operations** 中有 `insert_text` 和 `insert_node`，**Transform** 把它们封装成了 `insertText` 与 `insertNodes` 方法，都接受包括 `at` 在内的多个 `options`。

而 **Editor** 中的 `insertText` 方法又把 **Transform** 的这两个方法整合到了一起：调用方无需自行判断当前是否是 marks 来决定用 `Transforms.insertText` 还是 `Transforms.insertNodes`，也不用传 `at` 等参数。在命令式的场景下用起来非常顺手。

上面多次提到了 **Range**，它是 slate 对路径的统一管理。

```ts
interface Range {
  anchor: Point;
  focus: Point;
}
```

这就是 **Range** 的定义：`anchor` 是起始点，`focus` 是结束点。通俗来讲，框选一段文字时，`mousedown` 的位置就是 `anchor`，`mouseup` 的位置就是 `focus`。当只是聚焦光标、没有选中任何文字时，`anchor` 和 `focus` 是同一个 **Point**。

那么 **Point** 又是什么？

```ts
interface Point {
  path: Path;
  offset: number;
}

type Path = number[];
```

**Point** 用来描述光标的具体位置。举个例子，在上面图片中若光标位于“测”与“试”之间，此时的 **Point** 就是：

```ts
{
    "path": [0, 0],
    "offset": 1
}
```
