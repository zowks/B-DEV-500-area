import { Pressable, View } from "react-native";
import { useCallback } from "react";
import { MoonStar } from "~/lib/icons/MoonStar";
import { Sun } from "~/lib/icons/Sun";
import { cn } from "~/lib/utils";
import { useI18nContext } from "~/src/i18n/i18n-react";
import { loadLocaleAsync } from "~/src/i18n/i18n-util.async";
import { setUserLocale } from "~/src/i18n/utils";

// TODO
export function LocaleToggle() {
    const { locale, setLocale } = useI18nContext();

    const onLocaleSelected = useCallback(() => {
        setUserLocale(locale === "en" ? "de" : "en")
            .then(async locale => {
                await loadLocaleAsync(locale);
                return locale;
            })
            .then(setLocale);
    }, [locale, setLocale]);

    return (
        <Pressable
            onPress={onLocaleSelected}
            className="web:ring-offset-background web:transition-colors web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2"
        >
            {({ pressed }) => (
                <View
                    className={cn(
                        "flex-1 aspect-square pt-0.5 justify-center items-start web:px-5",
                        pressed && "opacity-70"
                    )}
                >
                    {locale === "en" ? (
                        <MoonStar className="text-foreground" size={23} strokeWidth={1.25} />
                    ) : (
                        <Sun className="text-foreground" size={24} strokeWidth={1.25} />
                    )}
                </View>
            )}
        </Pressable>
    );
}
