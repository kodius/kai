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
