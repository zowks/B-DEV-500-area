import "~/global.css";

import "~/src/i18n/i18n";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { type Theme, ThemeProvider } from "@react-navigation/native";
import { SplashScreen, Stack, useRouter, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState, useCallback, useEffect } from "react";
import useMount from "react-use/lib/useMount";
import { Platform, View } from "react-native";
import { useTranslation } from "react-i18next";
import { NAV_THEME } from "~/lib/constants";
import { useColorScheme } from "~/lib/useColorScheme";
import { PortalHost } from "@rn-primitives/portal";
import { ThemeToggle } from "~/components/ThemeToggle";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import api from "area-common/src/api/api";
import { LogOut } from "lucide-react-native";

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

    const getToken = (): Promise<string | null> => {
        return AsyncStorage.getItem("@access_token");
    };

    const logout = async () => {
        const token = await getToken();
        if (!token)
            return;

        const res = await api.auth.signOut(process.env.EXPO_PUBLIC_API_URL, token);

        if (!res.success) {
            switch (res.status) {
            case 401:
                AsyncStorage.removeItem("@access_token");
                router.navigate("/(auth)/login");
                break;
            case 500:
                console.log("An internal error happened.");
                break;
            }
            return;
        }
        AsyncStorage.removeItem("@access_token");
        router.navigate("/(auth)/login");
    };

    useEffect(() => {
        const updateAuth = async () => {
            const token = await getToken();

            if (isColorSchemeLoaded) {
                if (token && (pathName === "/login" || pathName === "/signup")) {
                    const res = await api.users.me(process.env.EXPO_PUBLIC_API_URL, token);

                    if (res.status === 401)
                        router.replace("/(auth)/login");
                    else
                        router.replace("/dashboard");
                } else if (!token && pathName !== "/login" && pathName !== "/signup") {
                    router.replace("/(auth)/login");
                }
            }
        };

        updateAuth();
    }, [pathName, router, isColorSchemeLoaded]);

    if (!isColorSchemeLoaded) return null;

    return (
        <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
            <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
            <Stack screenOptions={{
                headerLeft: () => (
                    <Text className="font-bold text-4xl ml-2">
                        AREA
                    </Text>
                ),
                headerRight: () => (
                    <View className="flex flex-row">
                        <Button
                            className="mt-2 mr-1"
                            variant="outline"
                            size="icon"
                            onPress={changeLanguage}
                        >
                            <Text>{t("language")}</Text>
                        </Button>
                        <ThemeToggle />
                        {isColorSchemeLoaded && pathName !== "/login" && pathName !== "/signup" && (
                            <Button
                                className="mt-2 mr-2"
                                variant="secondary"
                                size="icon"
                                onPress={() => logout()}
                            >
                                <LogOut
                                    className="text-primary"
                                />
                            </Button>
                        )}
                    </View>
                ),
            }}>
                <Stack.Screen
                    name="(auth)/login"
                    options={{
                        title: ""
                    }}
                />
                <Stack.Screen
                    name="(auth)/signup"
                    options={{
                        title: ""
                    }}
                />
                <Stack.Screen
                    name="(tabs)/dashboard"
                    options={{
                        title: ""
                    }}
                />
            </Stack>
            <PortalHost />
        </ThemeProvider>
    );
}
