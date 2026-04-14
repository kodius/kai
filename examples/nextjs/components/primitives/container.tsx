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
