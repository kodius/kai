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
