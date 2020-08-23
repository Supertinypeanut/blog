---
title: TypeScript 进阶——类型编程
date: 2020-08-10 10:10:10
tags: TypeScript
---

## TypeScript 进阶——类型编程

TypeScript 在某个层面上可以称作 Type + JavaScript，那么抛开 JavaScript，Type 是完备的编程语言吗？我们是否可以对类型进行编程呢？本文介绍一些 ts 特性和工具，期望一窥类型的乐趣。

> PS：建议将代码放到 IDE 或* [*TS playground*](https://www.typescriptlang.org/play/)*里查看类型提示。\*

Generics (泛型)

主流的编程语言通常都支持泛型以提供更加出色的抽象能力 (手动艾特 Go)，TypeScript 也不免俗。

```typescript
const wrapArr = <T>(v: T): T[] => [v];
const outputA = wrapArr("aa"); // string[]
const outputB = wrapArr(1); // number[]
```

完备的编程语言函数是必不可少的。本质上，泛型可以理解成类型层面的函数，当我们指定具体的输入类型时，得到的结果是经过处理后的输出类型。

```typescript
const identity = (x) => x; // value level
type Identity<T> = T; // Type level
const pair = (x, y) => [x, y];
type Pair<T, U> = [T, U];
```

泛型也起到约束和推导，举个例子

```
const map = <T, U>(arr: T[], cb: (v: T, i: number) => U): U[] => {/* map 实现 */}
```

那么函数已经有了，我们还需要一些工具函数帮助编程。

Utility Types

TypeScript 内置了很多工具类型，帮助开发者做类型变换（编程）。以下举几个例子，更多可看[官方文档](https://www.typescriptlang.org/docs/handbook/utility-types.html)

Partial<T>, Required<T>

将 T 的所有属性变成可选/必选。

```typescript
interface Foo {
  name: string;
  age: number;
}
type Bar = Partial<Foo>;
// Bar => {
//  name?: string
//  age?: number
// }
type LikeFoo = Required<Bar>;
// LikeFoo is same as Foo
```

Pick<T, U>, Omit<T, U>

从一个类型中获得子集。在组件 Props 透传时，常用于生成子组件的 Props 类型

```typescript
interface ParentProps {
  color: string;
  size: number;
  label: string;
  name: string;
  options: string[];
  placeholder?: string;
}
type Child1Key = "color" | "size" | "label";
type Child1Props = Pick<ParentProps, Child1Key>;
// {
//   color: string
//   size: number
//   label: string
// }
type Child2Props = Omit<ParentProps, Child1Key>;
// {
//   name: string
//   options: string[]
//   placeholder?: string
// }
```

Exclude<T, U>, Extract<T, U>

在 T 中排除/抽取匹配 U 的类型

```typescript
type T0 = Exclude<"a" | "b" | "c", "a" | "b">; // "c"
type T1 = Exclude<string | number | (() => void), Function>; // string | number
type T2 = Extract<"a" | "b" | "c", "c">; // "c"
```

Parameters<T>, ReturnType<T>

获得函数的参数类型和返回类型。可用于获得未暴露出来的类型。

```typescript
// util.ts
export const sum = (...p: number[]) => p.reduce((r, v) => r + v, 0)
// main.ts
import { sum } from 'util'
Parameters<typeof sum> // => number[]
ReturnType<typeof sum> // => number
```

与 lodash 的工具函数一样，这些工具类型可以通过 ts 本身的特性实现，下文着重介绍以上几个工具类型的实现。

类型操作符

先介绍几个常用的操作符

1. in，与 JavaScript 的 in 类似，用于遍历

1. keyof，获取一个类型的所有键值。最终得到一个联合类型，类似 Object.keys

```typescript
type Pick<T, U extends keyof T> = { [K in U]: T[K] };
type Partial<T> = { [K in keyof T]?: T[K] };
type Required<T> = { [K in keyof T]-?: T[K] };
```

Conditional Type (条件类型)

条件判断是编程语言基础的功能之一。TS 可以用条件类型来实现。条件类型一般形式是 T extends U ? X : Y ，和 JavaScript 的三元表达式一致，其中条件部分 T extends U 表示 T 是 U 的子集，即 T 类型的所有取值都包含在 U 类型中。

首先可以利用条件类型实现几个工具类型

```typescript
type Exclude<T, U> = T extends U ? never : T;
type Extract<T, U> = T extends U ? T : never;
```

再举个实际的案例

```typescript
function process(text: string | null): string | null {
  return text && text.replace(/f/g, "p");
}
process("hello world").toUpperCase(); // Type Error!
```

由于欠缺输入类型和输出类型之间的关联关系，导致即便输入是字符串时 TypeScript 仍然不能推断出输出是字符串，最终编译报错。

```typescript
function process<T extends string | null>(text: T): T extends string ? string : null {
 return text && text.replace(/f/g, 'p');
}
process('foo').toUpperCase(); *// Okay.*
process(null).toUpperCase(); // Type Error!
```

infer

infer 是条件类型的补充，表示待推断的类型。举个例子

```typescript
type Parameters<T> = T extends (...args: infer U) => any ? U : never;
type ReturnType<T> = T extends (...args: any) => infer U ? U : never;
```

在上面的条件类型中，infer U 表示待推断的函数参数类型。

infer 可以用于很多 unpack 的场景中

```typescript
type Unpacked<T> = T extends (infer U)[]
  ? U
  : T extends Set<infer U>
  ? U
  : T extends Promise<infer U>
  ? U
  : T;
```

图灵完备

有了类型层面的函数（泛型）、条件语句（条件类型）、递归等功能之后， 我们不禁有一个疑问：TypeScript 能够描述所有的数据类型吗？Github 有类似的讨论：[TypeScript 是图灵完备的](https://github.com/Microsoft/TypeScript/issues/14833)。

> TypeScript 包含了一套完整的类型层面编程能力，就像我们可以用 JavaScript、C++、Go 等编程语言解决各种实际问题一样，TypeScript 可以解决各种类型问题，因为本质上它们的内核都和图灵机等价。

拾遗

类型编程与实际业务编程一样充满乐趣。类型体操就像瑜伽/JOJO 立一样，容易沉迷，可谓一直凹类型一直爽。

双手供上一道类型题（leetcode 的笔试题），所谓实践出真知。

```typescript
// 实现一个 Connect 类型，将下面 Module 转换成 Result
interface Action<T> {
  payload?: T;
  type: string;
}
interface Module {
  count: number;
  message: string;
  asyncMethod<T, U>(input: Promise<T>): Promise<Action<U>>;
  syncMethod<T, U>(action: Action<T>): Action<U>;
}
type Result = {
  asyncMethod<T, U>(input: T): Action<U>;
  syncMethod<T, U>(action: T): Action<U>;
};
```
