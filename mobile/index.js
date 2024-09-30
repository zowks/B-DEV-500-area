import { registerRootComponent } from "expo";
import { ExpoRoot } from "expo-router";
import { useState, useEffect } from "react";
import { loadLocaleAsync } from "./src/i18n/i18n-util.async";
import TypesafeI18n from "./src/i18n/i18n-react";

// https://docs.expo.dev/router/reference/troubleshooting/#expo_router_app_root-not-defined

// Must be exported or Fast Refresh won't update the context
export function App() {
    const locale = "en"; // TODO: store in AsyncStorage
    const [localesLoaded, setLocalesLoaded] = useState(false);

    useEffect(() => {
        loadLocaleAsync(locale).then(() => setLocalesLoaded(true));
    }, [locale]);

    if (!localesLoaded) return null;

    const ctx = require.context("./app");

    return (
        <TypesafeI18n locale={locale}>
            <ExpoRoot context={ctx} />
        </TypesafeI18n>
    );
}

registerRootComponent(App);
