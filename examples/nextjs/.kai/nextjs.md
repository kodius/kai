# Next.js

## Layout-level components belong in `layout.tsx`

Layout-level components like headers, navigation, and footers should be placed in the `layout.tsx` file rather than in individual pages. This keeps pages focused on content and ensures layout is consistent across routes.

```tsx
// app/layout.tsx — ✓ correct
export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{props.children}</main>
        <Footer />
      </body>
    </html>
  );
}

// app/dashboard/page.tsx — ✗ avoid repeating layout in pages
export default function DashboardPage() {
  return (
    <>
      <Header />
      <DashboardContent />
      <Footer />
    </>
  );
}
```

## Stream async data with Suspense — never block the page

Async server components that fetch data must be wrapped in `<Suspense>` to stream the response. This prevents the entire page from blocking while data loads. Always use `<Spinner />` from shadcn as the default fallback — do not use `<Skeleton />`, `null`, or other placeholders unless the user explicitly requests it.

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

## Read search params in the page — never `useSearchParams` in client components

`searchParams` is a prop provided by the framework to the page. Read and await it there, then pass the resolved values down as props to client components. Do not call `useSearchParams()` in client components — it fragments the source of truth and couples components to the route.

Define and export two types per page: `{PageName}SearchParams` for the raw shape, and `{PageName}Props` that wraps it in a `Promise`. Reuse `{PageName}SearchParams` as the prop type on child components so the page and its children share the same source of truth.

```tsx
// app/page.tsx — ✓ correct
import { StatsPolling } from "@/features/dashboard/components/stats-polling";

export type HomePageSearchParams = { range?: "week" | "month" | "all" };
export type HomePageProps = { searchParams: Promise<HomePageSearchParams> };

export default async function HomePage(props: HomePageProps) {
  const searchParams = await props.searchParams;
  return <StatsPolling searchParams={searchParams} />;
}

// features/dashboard/components/stats-polling.tsx — ✓ correct
import type { HomePageSearchParams } from "@/app/page";

type Props = { searchParams: HomePageSearchParams };
export const StatsPolling = (props: Props) => { ... };
```

## Enable typed routes — always set typedRoutes in next.config

Next.js typed routes make `href` on `<Link>` statically type-checked against real routes. Always enable this so TypeScript catches broken links at compile time.

```ts
// next.config.mjs
const nextConfig = {
  typedRoutes: true,
};
```
