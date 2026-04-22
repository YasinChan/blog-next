---
date: 2022-05-12
tag:
  - slate
  - queue
  - execution-stack
sticky: true
excerpt: 本文将结合文本输入，细究 slate 内部执行逻辑。
---

# slate 系列 - 在编辑器中输入 A 发生了什么

::: tip
本文以一次最简单的文本输入为例，细究 slate 内部的执行逻辑。
:::

1. 光标先选中某个位置，触发 [selectionchange](https://github.com/ianstormtaylor/slate/blob/d2fc25c3c31453597f59cd2ac6ba087a1beb1fe3/packages/slate-react/src/components/editable.tsx#L274) 事件。在事件中，通过原生 `getSelection` 方法获取到当前光标坐标 selection，再通过 slate-react 的 `ReactEditor.toSlateRange` 方法转换成 slate range，最后用 [Transforms.select](http://Transforms.select) 将该 range 设置到 `editor.selection` 上。这里会执行 apply 的 [set_selection](https://github.com/ianstormtaylor/slate/blob/d2fc25c3c31453597f59cd2ac6ba087a1beb1fe3/packages/slate/src/transforms/general.ts#L230) 操作（该方法的触发位置在[这里](https://github.com/ianstormtaylor/slate/blob/d2fc25c3c31453597f59cd2ac6ba087a1beb1fe3/packages/slate/src/create-editor.ts#L81)）。
2. 输入 A 时，触发 slate-react 中的 [beforeinput](https://github.com/ianstormtaylor/slate/blob/d2fc25c3c31453597f59cd2ac6ba087a1beb1fe3/packages/slate-react/src/components/editable.tsx#L326) 事件。当判断 `event.inputType` 为 `insertText` 时，调用 `Editor.insertText` 方法插入文本。
3. `Editor.insertText` 内部会执行 apply 的 [insert_text](https://github.com/ianstormtaylor/slate/blob/d2fc25c3c31453597f59cd2ac6ba087a1beb1fe3/packages/slate/src/transforms/general.ts#L45) 操作。
4. 上述的 apply 都是对 Operation 的操作。Operation 处理完之后，会主动触发 [onChange](https://github.com/ianstormtaylor/slate/blob/d2fc25c3c31453597f59cd2ac6ba087a1beb1fe3/packages/slate/src/create-editor.ts#L95) 事件，用于驱动 React 重新渲染。
5. 这里有一个细节：当调用某个复杂命令时，可能会在一个 task 中执行多次 apply，这意味着 `onChange` 也会被调用多次。slate 用了一个巧妙的方式来合并：把 `onChange` 放进 Promise 的回调里，当前 task 执行完后只触发一次。

   ```jsx
   // https://github.com/ianstormtaylor/slate/blob/d2fc25c3c31453597f59cd2ac6ba087a1beb1fe3/packages/slate/src/create-editor.ts#L90
   apply: () => {
   	...
   	...
   	if (!FLUSHING.get(editor)) {
   	  FLUSHING.set(editor, true)

   	  Promise.resolve().then(() => {
   	    FLUSHING.set(editor, false)
   	    editor.onChange()
   	    editor.operations = []
   	  })
   	}
   }
   ```

   - 这里涉及了执行栈和队列的知识。我们知道 JS 是单线程的，异步任务会被先放置到队列中，等同步任务执行完后再执行。
   - 异步任务又分宏任务（task）和微任务（microtask）。浏览器会在每个 task 之间执行 DOM 重新渲染，即 task → 渲染 → task。
   - 而微任务则会在第一个 task 完成之后、渲染之前执行。
   - `Promise.then` 是微任务。所以 slate 多次执行的 apply 会把其中的 `Promise.then` 一一放进队列；当同步任务执行完，DOM 渲染之前，统一触发 `onChange`。

6. `onChange` 最终会在 [React 组件](https://github.com/ianstormtaylor/slate/blob/main/packages/slate-react/src/components/slate.tsx)中更新 [state Hook](https://github.com/ianstormtaylor/slate/blob/d2fc25c3c31453597f59cd2ac6ba087a1beb1fe3/packages/slate-react/src/components/slate.tsx#L29)，并触发 [Context.Provider](https://github.com/ianstormtaylor/slate/blob/d2fc25c3c31453597f59cd2ac6ba087a1beb1fe3/packages/slate-react/src/components/slate.tsx#L99) 的值变化，从而更新组件。

上一篇 [slate 系列 - 不同空格的处理](/post/html-different-space-slate.html)
