# Next.js

## Stream async data with Suspense — never block the page

Async server components that fetch data must be wrapped in `<Suspense>` to stream the response. This prevents the entire page from blocking while data loads. Use `<Spinner />` from shadcn as the fallback.

The **exception** is `searchParams` and `params` from Next.js — these are resolved by the framework and do not need Suspense wrapping.

```tsx
// ✓ correct — async component streamed with Suspense
import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";

export default function DashboardPage() {
  return (
    <Container>
      <Section title="Exercises">
        <Suspense fallback={<Spinner />}>
          <ExerciseList />
        </Suspense>
      </Section>
    </Container>
  );
}

// ✓ correct — searchParams/params don't need Suspense
export default async function UserPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  return <UserProfile id={id} />;
}

// ✗ avoid — async component renders without Suspense, blocks the page
export default function DashboardPage() {
  return (
    <Container>
      <Section title="Exercises">
        <ExerciseList />
      </Section>
    </Container>
  );
}
```

## Enable typed routes — always set typedRoutes in next.config

Next.js typed routes make `href` on `<Link>` statically type-checked against real routes. Always enable this so TypeScript catches broken links at compile time.

```ts
// next.config.mjs
const nextConfig = {
  typedRoutes: true,
};
```
