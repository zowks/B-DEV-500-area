import type { LayoutLoad } from "./$types";
import type { Locales } from "$i18n/i18n-types";
import { loadLocaleAsync } from "$i18n/i18n-util.async";
import type { Services } from "~/app";

/**
 * Load locale dictionary into memory and pass locale to the "rendering context".
 *
 * @param locale The locale to load.
 * @param services The available services to make AREAs.
 *
 * @returns The locale.
 */
export const load: LayoutLoad<{ locale: Locales, services: Services | null }> = async ({ data: { locale, services } }) => {
    await loadLocaleAsync(locale);

    return { locale, services };
};
