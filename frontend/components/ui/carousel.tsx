import * as React from "react";

function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(" ");
}

interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode[];
  showAll?: boolean;
  onShowAll?: () => void;
}

export const Carousel: React.FC<CarouselProps> = ({
  children,
  showAll = false,
  onShowAll,
  className,
  ...props
}) => {
  const [start, setStart] = React.useState(0);
  const visibleCount = 3;
  const total = children.length;

  const handlePrev = () => setStart((s) => Math.max(0, s - 1));
  const handleNext = () => setStart((s) => Math.min(total - visibleCount, s + 1));

  React.useEffect(() => {
    if (showAll) setStart(0);
  }, [showAll]);

  return (
    <div className={cn("w-full", className)} {...props}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex gap-2">
          <button
            className="rounded-full bg-[#2563eb] text-white w-8 h-8 flex items-center justify-center disabled:opacity-50"
            onClick={handlePrev}
            disabled={start === 0 || showAll}
            aria-label="Previous"
          >
            &#8592;
          </button>
          <button
            className="rounded-full bg-[#2563eb] text-white w-8 h-8 flex items-center justify-center disabled:opacity-50"
            onClick={handleNext}
            disabled={start >= total - visibleCount || showAll}
            aria-label="Next"
          >
            &#8594;
          </button>
        </div>
        {onShowAll && (
          <button
            className="text-[#2563eb] font-semibold underline text-[16px]"
            onClick={onShowAll}
          >
            See All
          </button>
        )}
      </div>
      <div className="flex gap-6 overflow-x-auto scrollbar-hide">
        {(showAll ? children : children.slice(start, start + visibleCount)).map((child, idx) => (
          <div key={idx} className="flex-shrink-0">
            {child}
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-2 mt-2">
        {Array.from({ length: showAll ? 1 : total - visibleCount + 1 }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "inline-block w-2 h-2 rounded-full",
              start === i ? "bg-[#2563eb]" : "bg-[#e5e7eb]"
            )}
          />
        ))}
      </div>
    </div>
  );
}; 