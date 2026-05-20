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
const Spinner = () => <LoadingSpinner />;
```

## Props — only add when the component is reused

Only give a component props when it's actually reused or when a caller needs to vary its content/behavior. For a single-use component extracted just to keep a page declarative (e.g. an auth-screen branding block used once), hardcode the content inside it. Adding `title` / `subtitle` / etc. props to a component that is rendered in exactly one place trades real simplicity for imagined flexibility.

If a second call site later appears and needs to vary the content, lift the hardcoded values to props at that point — not before.

## Naming collisions — prefix custom components with `_`

When a custom reusable component shares a name with a built-in or library component commonly used in the same codebase (e.g. React Native's `Text`, `Button`, `View`), prefix the custom component with `_` — `_Text`, `_Button`. This makes it immediately clear at the call site which one is being used and avoids aliasing the import everywhere. The custom component's file still uses the lowercase name (`components/ui/text.tsx`).

## Extend the underlying component's props

When a component wraps another component — a built-in element, a library component, or a lower layer in your own codebase — extend that component's props type instead of hand-picking a subset. Callers get the full underlying API for free and pass-through props don't have to be re-declared one by one.

```tsx
type Props = Omit<PressableProps, "children"> & {
  children: string;
  variant?: Variant;
  loading?: boolean;
};
```

Use `Omit<Base, "x">` only when the wrapper deliberately narrows or overrides a base prop (e.g. restricting `children` to `string`). Spread the props onto the base component in the render and override only the fields the wrapper controls.

In a layering chain, each layer extends the one directly below it, not the primitive again. `FormInput` extends `Input`'s `Props` (omitting the fields `FormInput` owns, like `value`/`onChangeText`/`onBlur`/`error`, which come from the form controller); `Input` extends `TextInputProps`. Done this way, a prop added to `Input` is available on `FormInput` automatically — no re-declaration at every layer. For this to work, each layer must export its `Props` type so the next layer can import and extend it.

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

Extracted components must live in their own file in a dedicated folder — never as a `const` in the page file. Pages should only import and compose components, not define them.

## Component layering — primitive → styled → contextual

Build reusable components in layers, where each layer wraps the one below and narrows the context. The bottom layer is a primitive (a built-in element or library component). The middle layer adds the project's styling and shared behavior. The top layer is the use-case-aware component. Lower layers stay reachable for one-off uses.

Form inputs: `FormInput` (labels, errors, react-hook-form wiring) → `Input` (project tokens, focus styling) → `TextInput` (RN primitive). Screen shells: `ListScreen` (one scroll/animation pattern) → `Screen` (safe area, background, status bar) → `SafeAreaView`.

Reach for the highest layer that matches the context; drop down only when no upper layer fits. Add a new top layer when the same context-specific glue is being re-applied at more than one call site — a single use case does not earn a layer, a recurring one does.

## Reusable wrappers own their layout

A reusable wrapper component (screen builder, layout primitive, card/list/form shell) owns its own padding, spacing, and chrome. Do not expose `className`, `style`, `contentContainerClassName`, or similar props as a way to tweak its internal layout — the point of the wrapper is uniformity, and once one call site can pass `pb-44` the abstraction has drifted into N copies again.

If a wrapper renders a structural slot — a bottom bar, a sticky header, a fixed footer — it must reserve the matching content padding itself, not push that to every call site. Slots and behavioral props (`bottomBar`, `header`, `edges`, `numColumns`, `variant`) are how callers customize a wrapper; layout and spacing props are not.

A narrow exception exists for genuinely content-specific styling, e.g. how items inside a list are spaced (`gap-3` between cards via `contentContainerClassName` on a FlatList). Treat it as an escape hatch, not a default — and if the same value recurs across call sites, absorb it into the wrapper.

## Isolate high-frequency state in its own component

State that updates on a fast interval — timers, tickers, animation frames, mouse or scroll position — must live in its own small component. If it sits in a parent, every tick re-renders the entire subtree and siblings that don't depend on the value pay the cost. Push the fast-changing state as far down the tree as possible so only the leaf that displays it re-renders.

## Custom hooks

Name all custom hooks with the `use` prefix.

## Use UI components — never hand-style common patterns

Do not recreate recognizable UI patterns (badges, tooltips, avatars, alerts, etc.) with raw styling. Use the project's established component library instead.

## Design-system components — variants set style, className is for tweaks

When using a `_*` design-system component (e.g. `_Text`, `_Button`), the `variant` prop is the single source for its typography and shape (font size, weight, line-height, letter-spacing, padding, radius, default colors). Never reach for `className` at the call site to change any of those — that's bypassing the design system and lets typography drift component by component.

If no existing variant fits, add a new variant to the component (e.g. add `eyebrow` to `_Text`) instead of recreating its styles inline. `className` on `_*` components is reserved for things variants don't own: color tweaks that depend on local context (e.g. `text-primary-foreground` on a label inside a primary-filled button), `uppercase`/`lowercase` case transforms, `text-center`/`text-right` alignment, and layout-positional utilities (`flex-1`, `absolute`, etc.).

## Memoization

Do not use `React.memo`, `useMemo`, or `useCallback` by default. Apply them only when there is a demonstrated performance problem.

## useEffect — only for external synchronization

Use `useEffect` only to sync React with the outside world: subscriptions, event listeners, imperative library APIs, and mount-time data fetching. Do not use it to react to a state change by firing a side effect (navigation, hiding a splash screen, calling another handler). Fire those side effects directly from the event handler that caused the state to change.

Keep the number of effects minimal. If a component has more than one or two, most of them are probably reactions to state that belong in a handler.

## useState — minimize and combine related state

Don't scatter related fields across multiple `useState` calls that must stay in sync. Combine state that always changes together into a single object, and prefer a discriminated union over parallel flags that represent one status.

```tsx
type Session =
  | { status: "loading" }
  | { status: "authenticated"; token: string }
  | { status: "unauthenticated" };

const [session, setSession] = useState<Session>({ status: "loading" });
```

Also prefer deriving values during render over storing them in state.
