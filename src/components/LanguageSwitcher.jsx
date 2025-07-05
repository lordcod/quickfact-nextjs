"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function LanguageSwitcher({ locale, onSelect }) {
  const t = useTranslations("IndexPage");

  return (
    <div className="flex gap-6 mb-10">
      {["en", "ru"].map((code) => (
        <Button
          key={code}
          variant={locale === code ? "default" : "outline"}
          onClick={() => onSelect(code)}
          className="min-w-[140px] text-lg font-medium transition-transform hover:scale-105 active:scale-95"
          aria-pressed={locale === code}
        >
          {t(`language.${code}`)}
        </Button>
      ))}
    </div>
  );
}
