import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "expo-localization";
import translations from "~/src/i18n/translations";

i18n.use(initReactI18next)
    .init({
        resources: translations,
        lng: getLocales()[0]?.languageCode || "en",

        interpolation: {
            escapeValue: false // react already safes from xss
        },
        compatibilityJSON: "v3"
    });

export default i18n;
