import AsyncStorage from "@react-native-async-storage/async-storage";
import { Locales } from "~/src/i18n/i18n-types";
import { isLocale } from "~/src/i18n/i18n-util";

const LOCALE_KEY = "@user-locale";

/**
 * Gets the locale previously stored into the async storage.
 *
 * @return The locale that was stored, or the passed-in default if none was stored
 * or an error occurred.
 */
export async function getUserLocale(defaultLocale: Locales) {
    try {
        const value = await AsyncStorage.getItem(LOCALE_KEY);

        if (value !== null && isLocale(value))
            return value;
        return defaultLocale;
    } catch {
        return defaultLocale;
    }
}

/**
 * Sets a locale into the async storage.
 *
 * @return The locale back if it was stored successfully, or rejects the promise if not.
 *
 * @throws error If an error occurs while storing the locale.
 */
export async function setUserLocale(value: Locales) {
    try {
        await AsyncStorage.setItem(LOCALE_KEY, value);
        return value;
    } catch (error) {
        console.error("Error reading from async storage", error);
        throw error;
    }
}
