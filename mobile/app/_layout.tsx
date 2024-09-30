import "~/global.css";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { type Theme, ThemeProvider } from "@react-navigation/native";
import { SplashScreen, Stack } from "expo-router";
import { getLocales } from "expo-localization";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import useMount from "react-use/lib/useMount";
import { Platform } from "react-native";
import { NAV_THEME } from "~/lib/constants";
import { useColorScheme } from "~/lib/useColorScheme";
import { PortalHost } from "@rn-primitives/portal";
import { LocaleToggle } from "~/components/LocaleToggle";
import { ThemeToggle } from "~/components/ThemeToggle";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";
import { useI18nContext } from "~/src/i18n/i18n-react";
import { isLocale } from "~/src/i18n/i18n-util";
import { loadLocaleAsync } from "~/src/i18n/i18n-util.async";
import { getUserLocale } from "~/src/i18n/utils";
import type { Locales } from "~/src/i18n/i18n-types";
import TypesafeI18n from "~/src/i18n/i18n-react";

const DEFAULT_LOCALE = getLocales()
    .map(locale => locale.languageCode)
    .find(locale => locale);

const LIGHT_THEME: Theme = {
    dark: false,
    colors: NAV_THEME.light
};
const DARK_THEME: Theme = {
    dark: true,
    colors: NAV_THEME.dark
};

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary
} from "expo-router";

// Prevent the splash screen from auto-hiding before getting the color scheme.
SplashScreen.preventAutoHideAsync();

function Layout() {
    const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme();
    const [isColorSchemeLoaded, setIsColorSchemeLoaded] = useState(false);

    const { LL } = useI18nContext();

    useMount(() => {
        (async () => {
            const theme = await AsyncStorage.getItem("theme");

            if (Platform.OS === "web") {
                // Adds the background color to the html element to prevent white background on overscroll.
                document.documentElement.classList.add("bg-background");
            }
            if (!theme) {
                AsyncStorage.setItem("theme", colorScheme);
                setIsColorSchemeLoaded(true);
                return;
            }

            const colorTheme = theme === "dark" ? "dark" : "light";

            if (colorTheme !== colorScheme) {
                setColorScheme(colorTheme);
                setAndroidNavigationBar(colorTheme);
                setIsColorSchemeLoaded(true);
                return;
            }
            setAndroidNavigationBar(colorTheme);
            setIsColorSchemeLoaded(true);
        })().finally(() => {
            SplashScreen.hideAsync();
        });
    });

    if (!isColorSchemeLoaded) return null;

    return (
        <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
            <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
            <Stack>
                <Stack.Screen
                    name="index"
                    options={{
                        title: LL.HI({ name: "John" }),
                        headerRight: () => (
                            <div className="flex">
                                <LocaleToggle />
                                <ThemeToggle />
                            </div>
                        )
                    }}
                />
            </Stack>
            <PortalHost />
        </ThemeProvider>
    );
}

export default function RootLayout() {
    const [localeLoaded, setLocaleLoaded] = useState<Locales | null>(null);

    useMount(() => {
        getUserLocale(DEFAULT_LOCALE && isLocale(DEFAULT_LOCALE) ? DEFAULT_LOCALE : "en")
            .then(async locale => {
                await loadLocaleAsync(locale);
                return locale;
            }).then(setLocaleLoaded);
    });

    if (!localeLoaded) return null;

    return (
        <TypesafeI18n locale={localeLoaded}>
            <Layout />
        </TypesafeI18n>
    );
}
