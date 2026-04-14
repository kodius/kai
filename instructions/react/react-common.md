# React — Common Rules

## Props — no inline destructuring

Never destructure props in the component signature. Accept props as a single object and access fields explicitly.

```tsx
// ✓ correct
const UserCard = (props: Props) => {
  return <div>{props.user.name}</div>;
};

// ✗ avoid
const UserCard = ({ user, onClick }: Props) => {
  return <div>{user.name}</div>;
};
```

## Props type

Define a `Props` type only when the component has props. For components with no props, omit the type entirely.

```tsx
// ✓ correct — has props
type Props = {
  user: User;
  onSelect: (id: string) => void;
};

const UserCard = (props: Props) => { ... };

// ✓ correct — children only
const Layout = (props: PropsWithChildren) => { ... };

// ✓ correct — children + other props
type Props = PropsWithChildren<{
  title: string;
}>;

const Section = (props: Props) => { ... };

// ✓ correct — no props, no type needed
const Spinner = () => <div className="spinner" />;
```

## Component definition

Always use arrow functions. Always use named exports.

```tsx
// ✓ correct
export const UserCard = (props: Props) => {
  return <div>{props.user.name}</div>;
};

// ✗ avoid — function declaration
export function UserCard(props: Props) { ... }

// ✗ avoid — default export
const UserCard = (props: Props) => { ... };
export default UserCard;
```

## Return types

Do not annotate return types on components — TypeScript infers them. Do annotate return types on regular and utility functions.

## Event handler naming

Use the `handle` prefix for handler implementations. Use the `on` prefix only for props that accept handlers.

```tsx
type Props = {
  onSelect: (id: string) => void;
};

export const UserCard = (props: Props) => {
  const handleClick = () => {
    props.onSelect(props.user.id);
  };

  return <button onClick={handleClick}>{props.user.name}</button>;
};
```

## Fragments

Use `<>` shorthand. Only use `<React.Fragment>` when a `key` prop is required.

## List keys

Always use a stable unique ID as the `key` prop. Never use the array index.

## Single responsibility

A component should do one thing. Extract a new component when a section has its own state, represents a logically distinct piece of UI, or makes the parent hard to read.

Always create smaller components even for non-reused pieces — if something is logically distinct (a footer, a branding block, a nav bar), it should be its own component. This keeps pages declarative and readable.

Layout-level components like footers, headers, and navigation should if possible be placed in the `layout.tsx` file rather than in individual pages.

Extracted components must live in their own file in a dedicated folder — never as a `const` in the page file. Pages should only import and compose components, not define them.

## Custom hooks

Name all custom hooks with the `use` prefix.

## Use UI components — never hand-style common patterns

Do not recreate recognizable UI patterns (badges, tooltips, avatars, alerts, etc.) with raw Tailwind classes. Use existing component library components (shadcn/ui) instead. If the component isn't installed yet, install it first (`pnpm dlx shadcn@latest add <component>`).

## Memoization

Do not use `React.memo`, `useMemo`, or `useCallback` by default. Apply them only when there is a demonstrated performance problem.
