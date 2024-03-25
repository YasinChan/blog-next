---
date: 2024-03-25
head:
  - - meta
    - name: keywords
      content: typing, enter, beforeinput, Fisher-Yates, CompositionEvent, beforeinput, 正则
  - - meta
    - name: description
      content: https://typing.yasinchan.com/ 字符输入逻辑介绍
tag:
  - typing
  - beforeinput
  - CompositionEvent
  - Fisher-Yates
  - reg
sticky: true
excerpt: <p>打字网站 <a href="https://typing.yasinchan.com" target="_blank">Typing</a> 字符输入逻辑</p>
---

# Typing 项目技术总结 - 字符输入逻辑

地址：[https://typing.yasinchan.com](https://typing.yasinchan.com)

源码：[https://github.com/YasinChan/typing](https://github.com/YasinChan/typing)

![](https://file.yasinchan.com/nS2xPufcI5TKM93b4N4a91oDAbPavS6F/2559139329.png)

这是整个 [Typing](https://typing.yasinchan.com/) 最重要的一个模块，主要逻辑可以查看[文件路径](https://github.com/YasinChan/typing/blob/main/src/components/WordInput.vue)。

主要涉及到几个点：

- 文案渲染
- 输入框
- 文案与输入内容绑定
- 限时模式、计时模式、自定义模式下的特定逻辑和输入组件的绑定逻辑
- 其他个性化功能逻辑

## 文案渲染

在这里我定义了一个 [JSON 文件](https://github.com/YasinChan/typing/blob/main/src/files/Quote.json)用来储存文案，结构如下

```json
{
  "long": [
    {
      "title": "title",
      "author": "author",
      "type": "散文",
      "length": "long",
      "content": "xxx"
    }
  ],
  "medium": [
    {
      "title": "title",
      "author": "author",
      "type": "散文",
      "length": "medium",
      "content": "content"
    }
  ],
  "short": [
    {
      "title": "title",
      "author": "author",
      "type": "片段",
      "length": "short",
      "content": "content"
    }
  ]
}
```

可以看到我分为了三种长度的文案类型，方便用户选择，在这文案的基础上的逻辑开发过程如下：

需要明确的逻辑是用户在输入过程中，是需要记录已输入、输入错误、未输入的记录的，同时用户输入过程中的每个字都需要同步反映到文案上，所以文案中每个字都需要单独控制，所以我通过以下方式渲染到 HTML 上，代码查看[文件路径](https://github.com/YasinChan/typing/blob/e98a68a4cbe5c766d4ae260423bbac3814398b88/src/components/WordInput.vue#L431)

```html
<!-- vue template 语法-->
<div class="y-word-input__quote">
  <span
    v-for="item in state.quoteArr"
    :class="[item.isWrong ? 'is-wrong' : '', item.isInput ? 'is-input' : '']"
    :key="item.id"
    >{{ item.word }}</span
  >
</div>
```

可以看出每个字都被 `<span>` 包裹，这样可以在每个 `<span>`上通过 **class** `is-wrong` 和 `is-input` 来达到不同状态的样式呈现。

## 输入框

输入框是基于 **div contenteditable** 实现，与上述渲染的文案排版逻辑是通过将两者的 `line-height` 设置为 **70px**，然后通过绝对定位的方式层叠渲染，使彼此的内容恰好在文案间隙中，达到流畅换行的目的。

```html
<div
  ref="inputAreaRef"
  @paste="pasteEvent"
  @keydown="keyDownEvent"
  @input="inputEvent"
  @mousedown.prevent="mouseDownEvent"
  @mouseup.prevent
  @beforeinput="beforeInputEvent"
  @compositionstart="compositionStartEvent"
  @compositionupdate="compositionUpdateEvent"
  @compositionend="compositionEndEvent"
  class="y-word-input__input-area"
  contenteditable="true"
></div>
```

通过代码可以看到这里绑定了很多事件，这里主要目的是两个

1. 监听输入事件用于记录内容用于错误统计和回放功能
2. 粘贴、撤销、反撤销、键盘选中等事件都需要取消掉，避免干扰情况

关于第一点，先引入 **`CompositionEvent`**和 `beforeinput` 的概念

### **CompositionEvent** 和 **beforeinput**

> DOM 接口  **`CompositionEvent`**  表示用户间接输入文本（如使用输入法）时发生的事件。此接口的常用事件有 `compositionstart`, `compositionupdate` 和  `compositionend`

这是 MDN 的解释，简单来说，比如搜狗输入法这种 **IME** ，可以将键盘上的字母转换成中文，当我们在使用这类 IME 时，浏览器提供了 [CompositionEvent](https://developer.mozilla.org/zh-CN/docs/Web/API/CompositionEvent) 相关事件，

- 当我们开始输入组合字符，会触发 `compositionstart` ，
- 在输入过程中会持续触发 `compositionupdate` ，
- 当完成时，比如按下空格或者回车等，则会触发 `compositionend` 。

> DOM 事件 **`beforeinput`**  在`[<input>]`, `<select>`  或  `<textarea>` 的值即将被修改前触发。这个事件也可以在  `contenteditable`  被设置为 `true` 的元素和打开  `designMode`  后的任何元素上被触发。

这是 MDN 对 `beforeinput` 的解释，就是说当输入一个字符，当被渲染到浏览器之前会触发这个事件，这个事件常作为现代富文本编辑器的核心事件，如 [slate](https://github.com/ianstormtaylor/slate) 等。

### 监听输入事件用于记录内容用于错误统计和回放功能

这个功能在下一篇文章中将会提到，这里先简要说一下相关逻辑：

这里的逻辑中除了需要记录中英文，还需要记录在 **composition** 状态下的英文。用到的事件是 `input` `beforeinput` `compositionstart` `compositionupdate` `compositionend` ，英文输入相关是通过 `input` 进行记录，中文输入会在 `compositionend` 中记录，然后通过 `CompositionEvent` 结合 `beforeinput` 可以记录下在 composition 状态下的英文了。

```tsx
function beforeInputEvent(e: any) {
  state.isTyping = true;
  if (e.inputType === 'insertCompositionText') {
    if (compositionList.includes(e.data)) {
      return;
    }
    // 处于 composition 状态
    if (state.currentComposition === e.data || !/\w+/.test(e.data)) {
      // 这里是 composition 状态结束的条件，比如按了空格、回车。
      state.isComposing = false;
      state.currentComposition = '';
      return;
    }
    state.currentComposition = e.data;
    return;
  }

  if (e.inputType === 'deleteContentBackward') {
    if (state.currentComposition) {
      // 如果在 composition 状态下鼠标点了旁边，这时 composition 状态下的输入会被删除，此时只需要将 currentComposition 清空即可。
      state.currentComposition = '';
      return;
    }
    return;
  }
}
```

另外在输入过程中还定义了两个列表，用于做一些特殊字符过滤处理。

```tsx
const whiteList = ['”', '》', '}', '）', '】', '’']; // 白名单，这些字符不会被标记为错误
const compositionList = ['“”', '《》', '{}', '（）', '【】', '‘’']; // composition 状态下的字符
```

---

### 禁用部分输入和键盘事件，避免干扰

上面说到的第二点，在输入期间，为确保输入过程不被其他情况干扰，这里会将比如粘贴事件、选择事件等都禁用。

```tsx
function pasteEvent(e: ClipboardEvent) {
  e.preventDefault();
}
function keyDownEvent(e: KeyboardEvent) {
  emit('keydown-event', e);
  if (e.code === KEY_CODE_ENUM['ENTER']) {
    e.preventDefault();
  }
  if (!props.isSpaceType && !props.canSpace && e.code === KEY_CODE_ENUM['SPACE']) {
    e.preventDefault();
  }
  if (
    e.shiftKey &&
    (e.code === KEY_CODE_ENUM['ARROW_LEFT'] || e.key === KEY_CODE_ENUM['ARROW_RIGHT'])
  ) {
    // shift + 左右方向键禁止
    e.preventDefault();
  }
  if ((e.metaKey || e.ctrlKey) && e.code === KEY_CODE_ENUM['KEY_A']) {
    // ctrl + a 禁止 或者 command + a 禁止
    e.preventDefault();
  }
  if ((e.metaKey || e.ctrlKey) && e.code === KEY_CODE_ENUM['KEY_Z']) {
    // ctrl + z 禁止 或者 command + z 禁止
    e.preventDefault();
  }
  if ((e.metaKey || e.ctrlKey) && e.code === KEY_CODE_ENUM['BACKSPACE']) {
    // ctrl + back space 禁止 或者 command + back space 禁止
    e.preventDefault();
  }
}
```

同时通过禁用 mouse 相关事件，将鼠标选择事件也禁用掉。

```html
@mousedown.prevent @mouseup.prevent
```

不过这会导致如果输入框失焦，那么也将无法通过鼠标点击来 focus。因此，这里在 mousedown 上还需要加上一个逻辑

```tsx
function focusInput() {
  if (!inputAreaRef.value) return;
  inputAreaRef.value.focus();
  moveCaretToEnd(inputAreaRef.value);
}

function moveCaretToEnd(element: HTMLElement) {
  // 使光标移动到末尾
  if (document.createRange && window.getSelection) {
    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(element);
    range.collapse(false);
    selection && selection.removeAllRanges();
    selection && selection.addRange(range);
    // @ts-ignore
  } else if (document.body.createTextRange) {
    // For older IE
    // @ts-ignore
    const range = document.body.createTextRange();
    range.moveToElementText(element);
    range.collapse(false);
    range.select();
  }
}
```

用于点击输入框时，光标直接在末尾呈现。

## 文案与输入内容绑定

上面所说的用于渲染文案的数据结构是这样的

```tsx
type SentenceArrItem = {
  id: number;
  word: string;
  isInput: boolean;
  isWrong: boolean;
};

const state = reactive({
  ...
  quoteArr: [] as SentenceArrItem[],
  ...
});
```

相关 `input` `beforeinput` `composition` 事件触发时会改变 `state.inputText` 的内容，

```tsx
watch(
  () => state.inputText,
  (newVal) => {
    const inputTextArr = newVal.split('');
    const wrongPos: number[] = [];
    state.quoteArr.forEach((item, index) => {
      item.isInput = false;
      item.isWrong = false;
      if (inputTextArr[index]) {
        item.isInput = true;
        item.isWrong = item.word !== inputTextArr[index];
        if (item.isWrong) {
          wrongPos.push(index);
        }
        if (whiteList.includes(inputTextArr[index])) {
          item.isInput = item.word === inputTextArr[index];
          item.isWrong = false;
        }
      }
    });
    ...
  }
);
```

然后 `watch state.inputText`，在其中对 `state.quoteArr` 进行改变，最终触发文案渲染的改变。

## 限时模式、计时模式、自定义模式下的特定逻辑和输入组件的绑定逻辑

在完成以上功能之后，组件会在不同阶段 emit 出一些事件，用于业务逻辑的处理

```tsx
const emit = defineEmits(['is-typing', 'keydown-event', 'is-finished']);
```

这里的业务逻辑需要注意在页面切换的时候及时销毁定时器等，避免内存泄漏。

这三个模式中都有刷新文案的功能，逻辑是只用保证刷新时下一次结果不是当前的文案即可。
不过其中计时模式下的短句类型的刷新逻辑不一样，短句每次刷新是从数组中随机取其中五条，为此，我这里使用了 `Fisher-Yates 洗牌算法`

### Fisher-Yates 洗牌算法

该算法的核心思想是：

- 从数组（或列表）的最后一个元素开始，向前遍历整个数组。
- 对于数组中的每一个元素（从最后一个元素开始直到第一个元素），生成一个介于当前索引（含）与数组末尾之间的随机索引。
- 用随机索引指向的元素与当前元素交换位置。
- 继续这个过程直到遍历到数组的第一个元素为止。

对应的具体实现为

```tsx
function getRandom() {
  const array = Object.values(Sentence[state.type]);
  ...
  if (array.length < state.len) {
    throw new Error('The array length should be at least 5');
  }

  // 创建一个包含原数组所有索引的数组
  const indices = Array.from({ length: array.length }, (_, i) => i);

  // 使用 Fisher-Yates 洗牌算法打乱索引数组
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  // 选取前 length 个随机索引，并从原数组中获取对应元素
  return indices.slice(0, state.len).map((index) => array[index]);
  ...
}
```

### 上传文档

自定义模式下**上传文档**可以细说一下。需要注意的是，前端自身是**不具备**直接解析或展示 .doc 等格式文档的能力的，目前只有 `.txt` 这种纯文本格式的内容可以读出来。所以借助 input file

```html
<input ref="uploadFile" type="file" accept=".txt" @change="handleFileChange" />
```

来读取 `.txt`

```tsx
function handleFileChange(event: any) {
  const selectedFile = event.target.files[0];
  if (selectedFile && ['text/plain'].includes(selectedFile.type)) {
    const file = selectedFile;

    // 预览文本文件前 1000 个字符
    if (['text/plain'].includes(selectedFile.type)) {
      const reader = new FileReader();
      reader.onload = () => {
        state.customInfo = reader.result?.slice(0, 1000) as string;
      };
      if (file) {
        reader.readAsText(file);
      }
    }
  } else {
    alert('请选择支持的文件类型!');
  }
}
```

## 其他个性化功能逻辑

### 标点符号和空格的相互转换功能

现在很多人的键盘输入场景都是在聊天框，一般会用空格来替代标点符号。所以这三种模式下都提供了标点符号和空格的相互转换功能，从而适合更多中国宝宝的打字习惯。

利用正则，将文案相互转换：

```tsx
function replacePunctuationWithSpace(input: string): string {
  const punctuationRegex = /[.,;:!?(){}[\]\\/'"`“”‘’…—～，《》「」【】·、。！？；：]/gu; // 匹配大多数常见标点符号
  return input.replace(punctuationRegex, ' ').replace(/\s+/g, ' '); // 连续空格替换为一个空格
}
```
