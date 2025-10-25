import { ArrowRightIcon } from "@radix-ui/react-icons";
import { ComponentPropsWithoutRef, ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BentoGridProps extends ComponentPropsWithoutRef<"div"> {
children: ReactNode;
className?: string;
}

interface BentoCardProps extends ComponentPropsWithoutRef<"div"> {
name: string;
className: string;
background: ReactNode;
Icon: React.ElementType;
description: string;
cta: string;
nameClassName?: string;
descriptionClassName?: string;
cardClassName?: string;
ctaClassName?: string;
iconClassName?: string;
}

const BentoGrid = ({ children, className, ...props }: BentoGridProps) => {
return (
  <div
    className={cn(
      "grid w-full auto-rows-[22rem] grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3",
      className,
    )}
    {...props}
  >
    {children}
  </div>
);
};

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  cta,
  nameClassName,
  descriptionClassName,
  cardClassName,
  ctaClassName,
  iconClassName,
  ...props
}: BentoCardProps) => (
  <div
    key={name}
    className={cn(
      "group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-3xl transition-all duration-300",
      cardClassName,
      className,
    )}
    {...props}
  >
    <div>{background}</div>
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-80 bg-gradient-to-t from-black/80 to-transparent" />
    
    <div className="pointer-events-none z-10 flex transform-gpu flex-col gap-1 p-6 transition-all duration-300 group-hover:-translate-y-10">
      <Icon className={cn("h-12 w-12 origin-left transform-gpu transition-all duration-300 ease-in-out group-hover:scale-75", iconClassName)} />
      <h3 className={cn("text-xl font-semibold", nameClassName)}>
        {name}
      </h3>
      <p className={cn("max-w-lg", descriptionClassName)}>{description}</p>
    </div>

    <div
      className={cn(
        "pointer-events-none absolute bottom-0 flex w-full translate-y-10 transform-gpu flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 z-10",
      )}
    >
      <Button variant="ghost" asChild size="sm" className="pointer-events-auto">
        <a className={ctaClassName}>
          {cta}
          <ArrowRightIcon className="ms-2 h-4 w-4 rtl:rotate-180" />
        </a>
      </Button>
    </div>
    <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-black/[.03] group-hover:dark:bg-neutral-800/10 z-1" />
  </div>
);

export { BentoCard, BentoGrid, type BentoCardProps };