# React — Conditional Rendering

## Ternary for two branches, early return for guards

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

## Shared JSX — extract to a const

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

## Multi-line ternary branches — extract to consts

When a ternary inside JSX has branches that span multiple lines, extract each branch to a named `const` before the return. The ternary in JSX should read as a simple one-liner.
