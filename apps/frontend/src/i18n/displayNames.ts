import type { Locales } from "$i18n/i18n-types";

type DisplayName = {
    name: string;
    short: string;
};

const displayNames: Record<Locales, DisplayName> = {
    en: { name: "English", short: "🇬🇧" },
    fr: { name: "Français", short: "🇫🇷" }
};

export default displayNames;
