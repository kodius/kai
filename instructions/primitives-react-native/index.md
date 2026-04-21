# Layout Primitives — React Native

Layout primitives are thin `View` wrappers that handle spacing and direction. Use them instead of writing raw flexbox classes on `View` directly.

## Use primitives for spacing — never margin classes

Do not use margin utility classes (`m-*`, `mb-*`, `mt-*`, etc.) to create spacing between sibling elements. Spacing between elements is the parent container's job — use the appropriate primitive (usually `VStack` for vertical flow) and adjust its `gap` via `className` if needed.

## Missing primitives — install all, not one

Before using any primitive, check if `components/primitives/` exists in the project. If any primitive file is missing, ask the user to install **all** primitives — not just the one needed for the current task. Scaffold every primitive listed below into `components/primitives/` so the full set is available from the start.

## VStack

Vertical flex container with consistent gap. Use for stacking content blocks, form fields, card bodies, or any sequence of elements that flow top-to-bottom.

```tsx
<VStack>
  <Label />
  <Input />
  <HelperText />
</VStack>
```

### Source

```tsx
// components/primitives/vstack.tsx
import { View, type ViewProps } from "react-native";

export const VStack = (props: ViewProps) => {
  return (
    <View
      {...props}
      className={["flex-col gap-4", props.className].filter(Boolean).join(" ")}
    />
  );
};
```

## Cluster

Horizontal flex container that wraps. Use for groups of tags, badges, buttons, or any set of inline elements that should wrap to the next line when space runs out. Use Cluster for any horizontal grouping — never use a raw `<View className="flex-row items-center gap-*">` when Cluster does the same thing.

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
import { View, type ViewProps } from "react-native";

export const Cluster = (props: ViewProps) => {
  return (
    <View
      {...props}
      className={["flex-row flex-wrap gap-4", props.className]
        .filter(Boolean)
        .join(" ")}
    />
  );
};
```

## Split

Horizontal flex container with space between. Use for two-sided layouts: title + action button, label + value, nav left + nav right.

```tsx
<Split>
  <_Text variant="heading">Users</_Text>
  <_Button>Invite</_Button>
</Split>
```

### Source

```tsx
// components/primitives/split.tsx
import { View, type ViewProps } from "react-native";

export const Split = (props: ViewProps) => {
  return (
    <View
      {...props}
      className={["flex-row flex-wrap justify-between gap-4", props.className]
        .filter(Boolean)
        .join(" ")}
    />
  );
};
```

## Section

Titled content block with a heading and children. Use for any layout that pairs a title with content below it — screen headers, card sub-sections, settings panels. The title is rendered as `<_Text variant="heading">` so typography stays consistent across the app.

```tsx
<Section title="Profiles">
  <ProfileList />
</Section>

<Section
  title="Recent activity"
  description="Last 7 days"
>
  <ActivityFeed />
</Section>
```

When you have a title followed by content, always use `Section` instead of manually combining `_Text` with a `VStack`.

```tsx
// ✓ correct
<Section title="Profiles">
  <ProfileList />
</Section>

// ✗ avoid — ad-hoc title + content layout
<VStack>
  <_Text variant="heading">Profiles</_Text>
  <ProfileList />
</VStack>
```

Use the `action` prop to place a button or control inline with the section title. Never replace `Section` with raw primitives just to add an action.

### Source

```tsx
// components/primitives/section.tsx
import { View, type ViewProps } from "react-native";

import { Split } from "@/components/primitives/split";
import { _Text } from "@/components/ui/text";

type Props = {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  style?: ViewProps["style"];
  children: React.ReactNode;
};

export const Section = (props: Props) => {
  const heading = <_Text variant="heading">{props.title}</_Text>;
  const description = props.description ? (
    <_Text variant="muted">{props.description}</_Text>
  ) : null;
  const titleWithAction = (
    <Split className="items-center">
      {heading}
      {props.action}
    </Split>
  );

  return (
    <View
      className={["flex-col gap-4", props.className].filter(Boolean).join(" ")}
      style={props.style}
    >
      {props.action ? titleWithAction : heading}
      {description}
      {props.children}
    </View>
  );
};
```
