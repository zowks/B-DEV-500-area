import type { LayoutLoad } from "./$types";
import type { Locales } from "$i18n/i18n-types";
import { loadLocaleAsync } from "$i18n/i18n-util.async";

/**
 * Load locale dictionary into memory and pass locale to the "rendering context".
 *
 * @param locale The locale to load.
 *
 * @returns The locale.
 */
export const load: LayoutLoad<{ locale: Locales }> = async ({ data: { locale } }) => {
    await loadLocaleAsync(locale);

    return { locale };
};
