import type { LayoutLoad } from "./$types";
import type { Locales } from "$i18n/i18n-types";
import { loadLocaleAsync } from "$i18n/i18n-util.async";
import type { Services, Client } from "~/app";

/**
 * Load locale dictionary into memory and pass locale to the "rendering context".
 * Also pass services and client information to the "rendering context".
 *
 * @param locale The locale to load.
 * @param services The available services to make AREAs.
 * @param client The client information.
 *
 * @returns The locale, services, and client.
 */
export const load: LayoutLoad<{ locale: Locales, services: Services | null, client: Client | null }> = async ({ data: { locale, services, client } }) => {
    await loadLocaleAsync(locale);

    return { locale, services, client };
};
