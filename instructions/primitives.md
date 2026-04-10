# Layout Primitives

Layout primitives are low-level Tailwind wrappers that handle spacing, direction, and responsive columns. Use them instead of writing raw flexbox/grid classes directly in components.

## Use primitives for spacing — never margin classes

Do not use margin utility classes (`m-*`, `mb-*`, `mt-*`, etc.) to create spacing between sibling elements. Spacing between elements is the parent container's job — use the appropriate primitive (usually `Stack` for vertical flow) and adjust its `gap` via `className` if needed.

```tsx
// ✓ correct — Section handles title + content layout
<Section title="Exercises">
  <ExerciseList />
</Section>

// ✓ correct — Stack controls vertical spacing
<Stack className="p-6">
  <Header />
  <Content />
</Stack>

// ✗ avoid — raw div with margin classes for spacing
<div className="p-6">
  <h1 className="mb-6 text-lg font-medium">Exercises</h1>
  <ExerciseList />
</div>
```

## Wrap page content in Container — never override its built-in sizing

Page-level content must be wrapped in a `Container` to enforce a consistent max-width and horizontal centering. This ensures the content width can be adjusted project-wide from a single place.

Do not override Container's built-in `max-w-*` or `py-*` via `className` — those values are the whole point of the component. If you need a different max-width or vertical padding, change the Container source once rather than overriding per-usage.

```tsx
// ✓ correct
<Container>
  <PageContent />
</Container>

// ✗ avoid — overriding Container's built-in sizing
<Container className="max-w-4xl py-12">
  <PageContent />
</Container>
```

## Missing primitives — install all, not one

Before using any primitive, check if `components/primitives/` exists in the project. If any primitive file is missing, ask the user to install **all** primitives — not just the one needed for the current task. Scaffold every primitive listed below into `components/primitives/` so the full set is available from the start.

## Stack

Vertical flex container with consistent gap. Use for stacking content blocks, form fields, card bodies, or any sequence of elements that flow top-to-bottom.

```tsx
<Stack>
  <Label />
  <Input />
  <HelperText />
</Stack>
```

### Source

```tsx
// components/primitives/stack.tsx
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  children: React.ReactNode;
};

export const Stack = (props: Props) => {
  return (
    <div className={cn("flex flex-col gap-4", props.className)}>
      {props.children}
    </div>
  );
};
```

## Cluster

Horizontal flex container that wraps. Use for groups of tags, badges, buttons, or any set of inline elements that should wrap to the next line when space runs out. Use Cluster for any horizontal grouping — never use a raw `<div className="flex items-center gap-*">` when Cluster does the same thing.

```tsx
<Cluster>
  <Badge>Design</Badge>
  <Badge>React</Badge>
  <Badge>TypeScript</Badge>
</Cluster>
```

### Source

```tsx
// components/primitives/cluster.tsx
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  children: React.ReactNode;
};

export const Cluster = (props: Props) => {
  return (
    <div className={cn("flex flex-wrap gap-4", props.className)}>
      {props.children}
    </div>
  );
};
```

## Split

Horizontal flex container with space between. Use for two-sided layouts: title + action button, label + value, nav left + nav right.

```tsx
<Split>
  <h2>Users</h2>
  <Button>Invite</Button>
</Split>
```

### Source

```tsx
// components/primitives/split.tsx
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  children: React.ReactNode;
};

export const Split = (props: Props) => {
  return (
    <div className={cn("flex flex-wrap justify-between gap-4", props.className)}>
      {props.children}
    </div>
  );
};
```

## Switcher

Horizontal flex container where all children share equal width. Use for toolbars, segmented controls, or side-by-side panels that should fill the available width equally.

```tsx
<Switcher>
  <StatsCard label="Revenue" />
  <StatsCard label="Users" />
  <StatsCard label="Orders" />
</Switcher>
```

### Source

```tsx
// components/primitives/switcher.tsx
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  children: React.ReactNode;
};

export const Switcher = (props: Props) => {
  return (
    <div
      className={cn(
        "flex flex-row flex-wrap justify-start gap-4 [&>*]:flex-1",
        props.className,
      )}
    >
      {props.children}
    </div>
  );
};
```

## Grid

Responsive CSS grid with typed breakpoint props. Use for card grids, dashboards, or any layout that needs different column counts at different screen sizes.

```tsx
<Grid md={2} lg={3}>
  <ProductCard />
  <ProductCard />
  <ProductCard />
</Grid>
```

Requires `class-variance-authority` (`pnpm add class-variance-authority`).

### Source

```tsx
// components/primitives/grid.tsx
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const gridVariants = cva("grid gap-4", {
  variants: {
    sm: {
      1: "sm:grid-cols-1", 2: "sm:grid-cols-2", 3: "sm:grid-cols-3",
      4: "sm:grid-cols-4", 5: "sm:grid-cols-5", 6: "sm:grid-cols-6",
    },
    md: {
      1: "md:grid-cols-1", 2: "md:grid-cols-2", 3: "md:grid-cols-3",
      4: "md:grid-cols-4", 5: "md:grid-cols-5", 6: "md:grid-cols-6",
    },
    lg: {
      1: "lg:grid-cols-1", 2: "lg:grid-cols-2", 3: "lg:grid-cols-3",
      4: "lg:grid-cols-4", 5: "lg:grid-cols-5", 6: "lg:grid-cols-6",
    },
    xl: {
      1: "xl:grid-cols-1", 2: "xl:grid-cols-2", 3: "xl:grid-cols-3",
      4: "xl:grid-cols-4", 5: "xl:grid-cols-5", 6: "xl:grid-cols-6",
    },
  },
});

type GridVariants = VariantProps<typeof gridVariants>;

type Props = GridVariants & {
  className?: string;
  children: React.ReactNode;
};

export const Grid = (props: Props) => {
  const { className, sm, md, lg, xl, ...rest } = props;
  return (
    <div
      className={cn(gridVariants({ sm, md, lg, xl }), className)}
      {...rest}
    />
  );
};
```

## Section

Titled content block with a heading and children. Use for any layout that pairs a title with content below it — page headers, card sub-sections, sidebar groups, settings panels. Variants control the visual scale so the same component works everywhere.

```tsx
<Section title="Exercises">
  <ExerciseList />
</Section>

<Section title="Recent Activity" variant="default">
  <ActivityFeed />
</Section>
```

When you have a title followed by content, always use `Section` instead of manually combining a heading element with a `Stack`.

```tsx
// ✓ correct
<Section title="Exercises">
  <ExerciseList />
</Section>

// ✗ avoid — ad-hoc title + content layout
<Stack>
  <h1 className="text-lg font-medium">Exercises</h1>
  <ExerciseList />
</Stack>
```

Use the `action` prop to place a button or control inline with the section title. Never replace `Section` with raw primitives just to add an action.

```tsx
// ✓ correct — action prop keeps Section intact
<Section
  title="Exercises"
  action={
    <Button asChild>
      <Link href="/exercises/new">New Exercise</Link>
    </Button>
  }
>
  <ExerciseList />
</Section>

// ✗ avoid — removing Section to manually compose title + action
<Stack>
  <Split>
    <h2 className="text-lg font-medium">Exercises</h2>
    <Button asChild>
      <Link href="/exercises/new">New Exercise</Link>
    </Button>
  </Split>
  <ExerciseList />
</Stack>
```

Requires `class-variance-authority` (`pnpm add class-variance-authority`).

### Source

```tsx
// components/primitives/section.tsx
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Split } from "@/components/primitives/split";

const sectionVariants = cva("flex flex-col", {
  variants: {
    variant: {
      default: "gap-4 [&>h2]:text-lg [&>h2]:font-medium",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

type SectionVariants = VariantProps<typeof sectionVariants>;

type Props = SectionVariants & {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
};

export const Section = (props: Props) => {
  const title = <h2>{props.title}</h2>;
  const description = props.description ? (
    <p className="text-sm text-muted-foreground">{props.description}</p>
  ) : null;
  const titleWithAction = (
    <Split>
      {title}
      {props.action}
    </Split>
  );

  return (
    <section className={cn(sectionVariants({ variant: props.variant }), props.className)}>
      {props.action ? titleWithAction : title}
      {description}
      {props.children}
    </section>
  );
};
```

## Container

Centered max-width wrapper. Use to constrain page content to a consistent width and center it horizontally. Adjust `max-w-5xl` in one place to change the content width project-wide.

```tsx
<Container>
  <Section title="Exercises">
    <ExerciseList />
  </Section>
</Container>
```

### Source

```tsx
// components/primitives/container.tsx
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  children: React.ReactNode;
};

export const Container = (props: Props) => {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-6 py-6", props.className)}>
      {props.children}
    </div>
  );
};
```
