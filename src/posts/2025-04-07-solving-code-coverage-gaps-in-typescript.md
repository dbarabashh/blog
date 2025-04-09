---
layout: post
title: "Solving a code coverage gap in TypeScript: lessons from the no-explicit-any rule"
description: "A deep dive into TypeScript's type system limitations and how to handle tricky code coverage gaps, inspired by real-world experience with the typescript-eslint project."
date: 2025-04-07
---

While contributing to the `typescript-eslint` project, I had the opportunity to work on the `no-explicit-any` rule, which is a crucial tool for maintaining type safety in TypeScript projects. During this work, I encountered an interesting challenge related to code coverage and TypeScript's type system limitations. This experience provided valuable insights into how TypeScript handles type narrowing across function boundaries and when to use type assertions appropriately.

## The issue

Inside the `no-explicit-any` rule, I came across a function called `createPropertyKeyFixer`, which had an uncovered line:

```typescript
function createPropertyKeyFixer(node: TSESTree.Node) {
  return (fixer: TSESLint.RuleFixer) => {
    if (node.parent && node.parent.type === AST_NODE_TYPES.TSTypeOperator) {
      return fixer.replaceText(node.parent, "PropertyKey");
    }
    return fixer.replaceText(node, "unknown"); // ← This line isn't covered by tests
  };
}
```

After digging in, I realized the fixer only gets called after a check with `isNodeWithinKeyofAny(node)`:

```typescript
function isNodeWithinKeyofAny(node: TSESTree.Node): boolean {
  return (
    node.parent.type === AST_NODE_TYPES.TSTypeOperator &&
    node.parent.operator === "keyof"
  );
}
```

So by the time `createPropertyKeyFixer` is called, we already know that `node.parent` exists and is a `TSTypeOperator` with the `keyof` operator.

## Understanding best practices in the project

To better understand how to deal with this kind of thing, I reviewed a few GitHub issues in the typescript-eslint repo:

- [Issue #6225](https://github.com/typescript-eslint/typescript-eslint/issues/6225) - Discusses the problem of loosely typed parent nodes in the AST
- [Issue #10682](https://github.com/typescript-eslint/typescript-eslint/issues/10682) - Continues the discussion on improving parent node typing
- [TypeScript Issue #9998](https://github.com/microsoft/TypeScript/issues/9998) - Dives into control flow analysis trade-offs

## Type narrowing in TypeScript

Type narrowing is how TypeScript figures out a more specific type for a variable in a given context—usually after a condition check.

```typescript
function example(value: string | number) {
  if (typeof value === "string") {
    // TypeScript knows value is a string here
    console.log(value.toUpperCase());
  }
}
```

However, TypeScript can't track narrowing across function boundaries:

```typescript
function isString(value: string | number): boolean {
  return typeof value === "string";
}

function processValue(value: string | number) {
  if (isString(value)) {
    // ❌ TypeError: TypeScript doesn't know value is a string here
    value.toUpperCase();
  }
}
```

To fix that, we can use a type guard:

```typescript
function isString(value: string | number): value is string {
  return typeof value === "string";
}

function processValue(value: string | number) {
  if (isString(value)) {
    // ✅ Now TypeScript knows value is a string
    value.toUpperCase();
  }
}
```

## The fix: Using type assertion

After reviewing everything, I went with a type assertion:

```typescript
function createPropertyKeyFixer(node: TSESTree.Node) {
  return (fixer: TSESLint.RuleFixer) => {
    return fixer.replaceText(
      node.parent as TSESTree.TSTypeOperator,
      "PropertyKey"
    );
  };
}
```

This approach:

- Removes the unnecessary type check
- Fixes the code coverage issue
- Maintains type safety (because we already validated the type earlier)
- Aligns with established practices in the typescript-eslint project

## When to use type assertions

Use them when:

- You can guarantee the type will be correct at runtime
- You've already checked the type earlier in the code
- It's the accepted convention in the codebase

Avoid them when:

- You can't be confident in the type at runtime
- You can use a type guard instead
- The code can be refactored to remove the need for an assertion

## Final thoughts

TypeScript's type system has some real limitations when it comes to tracking types across functions. When you hit a code coverage wall, your options include writing extra tests, refactoring, adding type guards—or, if needed, using type assertions.

Just make sure to document your assumptions when you go that route.

## Further reading

- [GitHub Issue #6225](https://github.com/typescript-eslint/typescript-eslint/issues/6225)
- [GitHub Issue #10682](https://github.com/typescript-eslint/typescript-eslint/issues/10682)
- [GitHub Issue #9998](https://github.com/microsoft/TypeScript/issues/9998)
- [Joshua Goldberg's article on code coverage gaps](https://github.com/JoshuaKGoldberg/dot-com/blob/d7d2f348ecf38fb2e3012fb06c85db16f1267cdf/src/content/blog/so-youve-got-a-gap-in-code-coverage-for-a-lint-rule/index.mdx?plain=1)
- [TypeScript docs on type narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
- [TypeScript docs on type guards](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates)
