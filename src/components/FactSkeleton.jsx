import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "next-intl";

export default function FactSkeleton() {
  const t = useTranslations("IndexPage");

  return (
    <article
      className="w-full rounded-xl p-6 bg-white/70 border border-sky-200 shadow-md backdrop-blur-sm"
      aria-label="Loading fact skeleton"
    >
      <div className="space-y-3">
        <Skeleton className="h-6 w-full rounded-md" />
        <Skeleton className="h-4 w-1/3 rounded-md" />
      </div>
    </article>
  );
}
