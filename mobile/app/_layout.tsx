import "~/global.css";

import "~/src/i18n/i18n";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { type Theme, ThemeProvider } from "@react-navigation/native";
import { SplashScreen, Stack, useRouter, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState, useCallback, useEffect } from "react";
import useMount from "react-use/lib/useMount";
import { Platform } from "react-native";
import { useTranslation } from "react-i18next";
import { NAV_THEME } from "~/lib/constants";
import { useColorScheme } from "~/lib/useColorScheme";
import { PortalHost } from "@rn-primitives/portal";
import { ThemeToggle } from "~/components/ThemeToggle";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

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

export default function RootLayout() {
    const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme();
    const [isColorSchemeLoaded, setIsColorSchemeLoaded] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();
    const pathName = usePathname();

    const { i18n, t } = useTranslation();

    const changeLanguage = useCallback(() =>   {
        const newLanguage = i18n.language === "en" ? "fr" : "en";

        i18n.changeLanguage(newLanguage).then(() => AsyncStorage.setItem("@language", newLanguage));
    }, [i18n]);

    useMount(() => {
        (async () => {
            const theme = await AsyncStorage.getItem("theme");
            const token = await AsyncStorage.getItem("@access_token");

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

            if (token)
                setIsAuthenticated(true);
        })().finally(() => {
            SplashScreen.hideAsync();
        });
    });

    useEffect(() => {
        if (isAuthenticated && pathName === "/login" || pathName === "/signup") {
            router.replace("/dashboard");
        }
    }, [isAuthenticated, pathName, router]);

    if (!isColorSchemeLoaded) return null;

    return (
        <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
            <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
            <Stack screenOptions={{
                headerLeft: () => (
                    <Button
                        variant="ghost"
                        onPress={changeLanguage}
                    >
                        <Text>{t("language")}</Text>
                    </Button>
                ),
                headerRight: () => <ThemeToggle />,
            }}>
                <Stack.Screen
                    name="(auth)/login"
                    options={{
                        title: "Login"
                    }}
                />
                <Stack.Screen
                    name="(auth)/signup"
                    options={{
                        title: "Signup"
                    }}
                />
                <Stack.Screen
                    name="(tabs)/dashboard"
                    options={{
                        title: "Home"
                    }}
                />
            </Stack>
            <PortalHost />
        </ThemeProvider>
    );
}
