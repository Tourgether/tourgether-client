import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import ko from "./locales/ko/translation.json";
import en from "./locales/en/translation.json";
import ja from "./locales/ja/translation.json";
import zh_cn from "./locales/zh-cn/translation.json";

const savedLang = localStorage.getItem("languageCode") || "ko";

i18n.use(initReactI18next).init({
  resources: {
    ko: { translation: ko },
    en: { translation: en },
    ja: { translation: ja },
    "zh-CN": { translation: zh_cn },
  },
  lng: savedLang,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
