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
