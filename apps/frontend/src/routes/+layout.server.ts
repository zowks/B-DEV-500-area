import type { LayoutServerLoad } from "./$types";
import * as i18nUtils from "$i18n/utils";

/**
 * Set the locale cookie to the locale passed in parameters and
 * pass locale information from "server-context" to "shared server + client context".
 * Also pass services and client information to the "shared server + client context".
 *
 * @param locale The locale to load.
 * @param services The available services to make AREAs.
 * @param client The client information.
 * @param cookies The cookies object.
 *
 * @returns The locale, services, and client.
 */
export const load: LayoutServerLoad = ({ locals: { locale, services, client }, cookies }) => {
    i18nUtils.setLocaleCookie(locale, cookies);

    return { locale, services, client };
};
