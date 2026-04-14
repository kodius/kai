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
