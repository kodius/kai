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
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
};

export const Section = (props: Props) => {
  const title = <h2>{props.title}</h2>;
  const titleWithAction = (
    <Split>
      {title}
      {props.action}
    </Split>
  );

  return (
    <section className={cn(sectionVariants({ variant: props.variant }), props.className)}>
      {props.action ? titleWithAction : title}
      {props.children}
    </section>
  );
};
