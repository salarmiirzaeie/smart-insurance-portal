import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import translationEn from "./locales/en.json";
import translationFa from "./locales/fa.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: translationEn },
      fa: { translation: translationFa },
    },
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });

export default i18n;
