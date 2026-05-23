<!-- kai:start -->
<!-- This section is managed by kai. Do not edit manually. -->

# Kai docs are defaults, not gospel — judge before applying

Before applying any rule from a kai instruction file:

- Read the relevant `.kai/*.md` files in scope first (the conditional triggers below).
- Then think critically. The rules may be outdated against a newer SDK or library version (Expo, React, React Native, react-hook-form, NativeWind, etc.), may carry trade-offs that hurt performance in this codebase's context, or may not anticipate the shape of the task in front of you.
- Apply a rule only when you're confident it's the best fit. If a better approach exists — a newer API, an existing pattern in this codebase that disagrees with the doc, a constraint the doc doesn't cover — flag the divergence to the user, explain why, and ask before silently overriding.
- The codebase (and a quick check of how similar features are already built) is the ground truth; kai rules are a strong prior, not a contract.
- Never deviate without flagging. Never follow a rule you suspect is wrong without flagging the suspicion.

---

When working on project file/folder structure or organizing code, read `.kai/project-structure.md`.

When building or modifying forms, form fields, or form validation, read `.kai/form.md`.

When writing React components or hooks, read `.kai/react.md`.

When defining or working with TypeScript types, read `.kai/types.md`.

When building layout or composing UI structure, read `.kai/primitives.md`.

When fetching data, using server components, or working with Next.js routing, read `.kai/nextjs.md`.
<!-- kai:end -->
