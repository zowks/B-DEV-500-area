import { redirect, type Handle, type RequestEvent } from "@sveltejs/kit";
import { initAcceptLanguageHeaderDetector } from "typesafe-i18n/detectors";
import isPublicPath from "$lib/utils/isPublicPath";
import getClient from "$lib/utils/getClient";
import getServices from "$lib/utils/getServices";
import type { Locales } from "$i18n/i18n-types.js";
import { detectLocale, i18n, isLocale } from "$i18n/i18n-util";
import { loadAllLocales } from "$i18n/i18n-util.sync";
import * as i18nUtils from "$i18n/utils";

loadAllLocales();

const L = i18n();

/**
 * Get the preferred locale for the current request.
 * - First, check if the locale is set in the cookies.
 * - If not, detect the preferred language from the Accept-Language header.
 *
 * @param {RequestEvent} event The current request event, containing the request and cookies.
 *
 * @returns {Locales} The preferred locale.
 */
function getPreferredLocale({ request, cookies }: RequestEvent): Locales {
    const locale = i18nUtils.getLocaleFromCookie(cookies);

    if (locale && isLocale(locale)) return locale;

    return detectLocale(initAcceptLanguageHeaderDetector(request));
}

/**
 * Handle the request.
 * - Get the current locale from the URL.
 * - If it's not set, redirect to the preferred locale.
 * - Else, bind the locale and translation functions to the current request, and replace the html lang attribute.
 * - Also get the access token and store it in the locals.
 *
 * @param event The current request event.
 * @param resolve The resolve function to continue the request.
 */
export const handle: Handle = async ({ event, resolve }) => {
    const currentLocale = i18nUtils.getCurrentLocale(event);

    if (!currentLocale)
        return redirect(307, `/${getPreferredLocale(event)}/dashboard`);

    const locale = isLocale(currentLocale) ? currentLocale : getPreferredLocale(event);
    const accessToken = event.cookies.get("accessToken");

    // TODO: avoid fetching client and services at each page change

    if (!event.locals.client) {
        const client = await getClient(accessToken);

        if (!client && !isPublicPath(event.url.pathname, locale))
            return redirect(302, `/${locale}/auth/sign-in`);
        event.locals.client = client;
    }

    if (event.locals.client && !event.locals.services)
        event.locals.services = await getServices();

    event.locals.locale = locale;
    event.locals.LL = L[locale];
    return resolve(event, { transformPageChunk: ({ html }) => html.replace("%lang%", locale) });
};
