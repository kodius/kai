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
