---
layout: post.njk
title: Catastrophic backtracking in plain language
description: Understanding and preventing catastrophic backtracking in regular expressions to avoid potential denial of service vulnerabilities.
date: 2024-11-07
---

When working with regular expressions, you might encounter a warning about patterns vulnerable to super-linear runtime backtracking that could lead to denial of service. These warnings are important security considerations that shouldn't be ignored.

You can catch these potential issues using code quality tools like SonarQube, which help identify such vulnerabilities along with other code quality metrics.

Let's first understand the concept of Catastrophic Backtracking in regular expressions. This problem arises when a regular expression forces the engine to go through a large number of possible combinations in search of a match, which can lead to significant delays or even crash the program. In JavaScript, as in other languages, this phenomenon appears due to so-called "greedy" regular expressions and improperly constructed patterns that include multiple repetitions (e.g., `.*`, `.+`, `(?:ab)+`).

## How it works

At the core of the issue lies the backtracking mechanism—a method by which a regular expression checks possible combinations to find a match with a string. For instance, if a regex contains multiple "greedy" or "lazy" quantifiers (`*`, `+`, `{n,}`), it may attempt a large number of paths to find a match.

The problem of "catastrophic" backtracking occurs when:

- The regular expression has a complex structure with multiple quantifiers.
- The input string does not match the pattern but is similar to it (partially matches).
- This forces the regex engine to backtrack, trying other possible paths, causing an exponential increase in execution time.

## How to avoid catastrophic backtracking

- Avoid nested quantifiers (`(a+)+`), which lead to an explosion of possible combinations.
- Use lazy or non-greedy quantifiers (`*?`, `+?`) instead of greedy ones to reduce the number of possible combinations.
- Keep the pattern clear—if you need to check for a specific set of characters, restrict it with fixed quantifiers (`{n,m}`).

## Example

```javascript
const problematicRegex = /^(a+)+$/;

try {
  console.time("problematic");
  console.log(problematicRegex.test("a".repeat(20) + "b"));
  console.timeEnd("problematic");
} catch (error) {
  console.error("Error caught:", error);
}

const optimizedRegex = /^a+$/;
console.time("optimized");
console.log(optimizedRegex.test("a".repeat(20) + "b"));
console.timeEnd("optimized");
```

### Output example

```plaintext
problematic: 69.367919921875 ms
optimized: 0.031005859375 ms
```

As you can see, the difference in execution time is significant. The problematic regex takes much longer to process due to catastrophic backtracking, while the optimized version runs almost instantly. This example highlights why it's essential to be mindful of this issue when working with regular expressions. By preventing catastrophic backtracking, you avoid potential slowdowns and ensure that your program remains efficient and resilient. Taking the time to construct regex patterns carefully not only improves performance but also helps prevent vulnerabilities that could lead to denial of service in more sensitive applications.
