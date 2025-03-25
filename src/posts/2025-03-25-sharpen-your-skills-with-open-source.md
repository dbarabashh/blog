---
layout: post.njk
title: Sharpen your skills with open-source
description: How contributing to open-source projects can help both beginners and experienced engineers improve their skills and gain valuable experience.
date: 2025-03-25
---

Very often, both beginner engineers and more experienced specialists find themselves in situations where they don't know how to properly improve their skills or gain new experience on a new project.

I regularly see posts on Reddit or LinkedIn where newcomers write about not knowing how to find their first project or how to gain the necessary experience. More seasoned engineers, on the other hand, talk about similar issues but frame them slightly differently: "Where can I find interesting challenges?"

But what if I told you that the solution for both groups is already right in front of you? All of us use GitHub, which hosts a huge number of open-source projects that are actively maintained. In fact, most of the npm packages you use daily in your work projects are also usually open-source. These projects are supported by regular enthusiasts who find open issues, create pull requests, and improve the very tools they actively use themselves.

It's easy to talk about these things, but do I practice what I preach? I'm one of those people who actually does this, and that's why I want to share my own journey how I found a way to sharpen my skills while contributing to the open-source community.

We all know and use [MDN Web Docs](https://developer.mozilla.org/en-US/). But did you know that this project is [open-source](https://github.com/mdn)? Yes, it's truly open and actively supported not only by core contributors but also by enthusiasts who regularly close issues created by other developers who rely on this documentation.

We're used to opening MDN Web Docs when we don't understand something or when we're preparing for an interview. But what if, instead, you opened the list of open issues and tried closing one of them? In my opinion, it's a great way to gain real-world project experience and learn something new at the same time. Very often, you'll see issues like "missing documentation for this," or "needs an example for X," and so on. When you take on one of these tasks, you automatically start researching, dive into the topic, and gain new knowledge.

Let me walk you through one of my pull requests as an example. If you [follow the link](https://github.com/mdn/content/pull/38582), you'll see that I created a pull request and linked it to the corresponding [issue](https://github.com/mdn/content/issues/38339). The issue was about an error in the documentation related to the `width` property of the [HTMLCanvasElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/width). The second paragraph of the article stated that only the drawing buffer gets reset after changing the `width` or `height` properties. However, according to the [WHATWG specification](https://html.spec.whatwg.org/multipage/canvas.html#concept-canvas-set-bitmap-dimensions), changing these properties actually resets the entire drawing context, including parameters like `fontKerning`. The issue's author suggested clearly stating in the documentation that changing the canvas size resets the whole drawing context, not just the image content.

Did I know this before? **Of course not**. I had no idea that canvas behaved this way and that it reset not only the drawing buffer but the entire drawing context. But this task gave me the chance to dig into the details, read the specification, and truly understand how it works.

> It is also very important to understand how to choose tasks like these. Personally, I pay attention to issues that have already been reviewed and approved by the core developers responsible for the project. I would not recommend taking on a task that does not have a comment from the maintainers indicating it is ready to be worked on, or a relevant label signaling its current status.

In addition, it is always a good idea to read through the project's contribution guide, it will save you time and help you better understand the process.

What did I gain from this experience?

- I found an interesting task I had been looking for.
- I explored something new that I hadn't even considered before, and I got a direct link to the specification where I could research it further. Isn't that awesome?
- I developed a skill for working with documentation that's read by millions of developers around the world.
- My pull request was reviewed by a developer from the MDN core team.
- I gained new knowledge and became an active member of the open-source community.

So, to wrap things up, I want to say that my example is just one of many ways to discover something interesting that helps you become better than you were before. You can choose any open-source project that fits your interests—whether it's a component design system or a library you already use. You might even have a new idea for improving your favorite library.

There's a vast field of knowledge in front of you, filled with people who are ready to help and provide feedback.

Remember: **Community is incredibly important!**
