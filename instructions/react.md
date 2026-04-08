# React

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

```tsx
// ✓ correct — component, no annotation needed
export const UserCard = (props: Props) => {
  return <div>{props.user.name}</div>;
};

// ✓ correct — utility function, annotate return type
const formatName = (first: string, last: string): string => {
  return `${first} ${last}`;
};

// ✗ avoid — redundant annotation on component
export const UserCard = (props: Props): JSX.Element => { ... };
```

## Event handler naming

Use the `handle` prefix for handler implementations. Use the `on` prefix only for props that accept handlers.

```tsx
// ✓ correct
type Props = {
  onSelect: (id: string) => void;
};

export const UserCard = (props: Props) => {
  const handleClick = () => {
    props.onSelect(props.user.id);
  };

  return <button onClick={handleClick}>{props.user.name}</button>;
};

// ✗ avoid
const onClickHandler = () => { ... };
const clickHandler = () => { ... };
```

## Conditional rendering

Use a ternary for two branches. Use an early return for complex guards. Never use `&&` short-circuit — it renders `0` when the left side is a falsy number.

```tsx
// ✓ correct — ternary for two branches
return isLoggedIn ? <Dashboard /> : <Login />;

// ✓ correct — early return for guards
if (!user) return null;
return <UserCard user={user} />;

// ✗ avoid — && with a count or number can render 0
return count && <List items={items} />;

// ✓ correct — convert to boolean explicitly if needed
return count > 0 ? <List items={items} /> : null;
```

## Conditional rendering with shared JSX — extract to a const

When a JSX element is used in multiple branches of a conditional, extract it to a named `const` before the return and reference it by name. Never write the same JSX twice.

```tsx
// ✓ correct — title defined once, reused in both branches
const title = <h2>{props.title}</h2>;
const titleWithAction = (
  <div className="flex items-center justify-between">
    {title}
    {props.action}
  </div>
);

return (
  <section>
    {props.action ? titleWithAction : title}
    {props.children}
  </section>
);

// ✗ avoid — h2 written twice, branches diverge silently
return (
  <section>
    {props.action ? (
      <div className="flex items-center justify-between">
        <h2>{props.title}</h2>
        {props.action}
      </div>
    ) : (
      <h2>{props.title}</h2>
    )}
    {props.children}
  </section>
);
```

## Fragments

Use `<>` shorthand. Only use `<React.Fragment>` when a `key` prop is required.

```tsx
// ✓ correct
return (
  <>
    <Header />
    <Main />
  </>
);

// ✓ correct — key required
return items.map((item) => (
  <React.Fragment key={item.id}>
    <dt>{item.label}</dt>
    <dd>{item.value}</dd>
  </React.Fragment>
));

// ✗ avoid — verbose when no key needed
return (
  <React.Fragment>
    <Header />
    <Main />
  </React.Fragment>
);
```

## List keys

Always use a stable unique ID as the `key` prop. Never use the array index.

```tsx
// ✓ correct
items.map((item) => <Row key={item.id} item={item} />);

// ✗ avoid — breaks reconciliation when order changes
items.map((item, index) => <Row key={index} item={item} />);
```

## Single responsibility

A component should do one thing. Extract a new component when a section has its own state, represents a logically distinct piece of UI, or makes the parent hard to read.

```tsx
// ✓ correct — each component has one job
export const UserPage = (props: Props) => (
  <>
    <UserHeader user={props.user} />
    <UserActivity userId={props.user.id} />
  </>
);

// ✗ avoid — one component managing unrelated concerns
export const UserPage = (props: Props) => {
  const [activity, setActivity] = useState(...);
  // ... header markup
  // ... activity feed markup
  // ... pagination logic
};
```

## Custom hooks

Name all custom hooks with the `use` prefix.

## Use UI components — never hand-style common patterns

Do not recreate recognizable UI patterns (badges, tooltips, avatars, alerts, etc.) with raw Tailwind classes. Use existing component library components (shadcn/ui) instead. If the component isn't installed yet, install it first (`pnpm dlx shadcn@latest add <component>`).

```tsx
// ✓ correct — use the Badge component
import { Badge } from "@/components/ui/badge";

<Badge variant="secondary">{props.exercise.difficulty}</Badge>

// ✗ avoid — hand-styled badge with raw Tailwind
<span className="rounded-sm bg-muted px-2 py-0.5 text-xs text-muted-foreground">
  {props.exercise.difficulty}
</span>
```

## Memoization

Do not use `React.memo`, `useMemo`, or `useCallback` by default. Apply them only when there is a demonstrated performance problem — premature memoization adds complexity without measurable benefit.

```tsx
// ✓ correct — simple, no memo
export const UserCard = (props: Props) => (
  <div>{props.user.name}</div>
);

// ✗ avoid — wrapping everything in memo by default
export const UserCard = React.memo((props: Props) => (
  <div>{props.user.name}</div>
));
```
