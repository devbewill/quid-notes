import { translations, type TranslationKey } from "@/lib/translations";

export function useTranslation() {
  const t = (key: TranslationKey): string => translations.en[key];
  return { t };
}
