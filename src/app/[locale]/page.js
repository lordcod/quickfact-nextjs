import { getTranslations } from "next-intl/server";
import QuickFactContent from "@/components/QuickFactContent";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({
    locale: locale,
    namespace: "IndexPage",
  });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function QuickFactPage({ params }) {
  const { locale } = await params;
  return <QuickFactContent locale={locale} />;
}
