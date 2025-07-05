"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import LanguageSwitcher from "@/components/LanguageSwitcher";
import { motion } from "framer-motion";

import FactSkeleton from "@/components/FactSkeleton";
import ErrorMessage from "@/components/ErrorMessage";
import { getFact } from "@/api/requests";
import { Button } from "@/components/ui/button";

export default function QuickFactContent({ locale }) {
  const t = useTranslations("IndexPage");
  const router = useRouter();

  const [fact, setFact] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFact = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFact();
      setFact(data);
    } catch (e) {
      setError(e.message || "Error");
      setFact(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFact();
  }, [fetchFact]);

  const localization = useMemo(() => {
    return fact?.localizations?.find((d) => d.lang === locale);
  }, [fact, locale]);

  const changeLocale = (newLocale) => {
    router.push(`/${newLocale}`);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-100 via-white to-sky-200 flex items-center justify-center p-4">
      <div className="backdrop-blur-md bg-white/60 border border-sky-200 rounded-3xl shadow-2xl p-8 w-full max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 text-blue-800 relative after:absolute after:content-[''] after:w-12 after:h-1 after:bg-blue-600 after:left-1/2 after:-translate-x-1/2 after:bottom-[-8px]">
          {t("title")}
        </h1>

        <div className="flex justify-center mb-6">
          <LanguageSwitcher locale={locale} onSelect={changeLocale} />
        </div>

        <div className="mb-6 min-h-[120px] w-full">
          {loading && <FactSkeleton />}
          {error && !loading && <ErrorMessage message={error} />}
          {fact && localization && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white/70 rounded-xl shadow-md p-6 backdrop-blur-sm"
            >
              <p className="text-xl text-gray-800 font-medium mb-2">
                {localization.text}
              </p>
              <span className="text-sm text-gray-600">
                {localization.category}
              </span>
            </motion.div>
          )}
        </div>

        <div className="flex justify-center">
          <Button
            className="min-w-[200px] text-lg font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 hover:scale-105 transition-transform shadow-md"
            onClick={fetchFact}
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? t("loading") : t("getAnotherFact")}
          </Button>
        </div>
      </div>
    </main>
  );
}
