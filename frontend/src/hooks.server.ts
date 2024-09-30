import { redirect, type Handle, type RequestEvent } from "@sveltejs/kit";
import { base } from "$app/paths";
import type { Locales } from "$i18n/i18n-types.js";
import { detectLocale, i18n, isLocale } from "$i18n/i18n-util";
import { loadAllLocales } from "$i18n/i18n-util.sync";
import { initAcceptLanguageHeaderDetector } from "typesafe-i18n/detectors";
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
 *
 * @param event The current request event.
 * @param resolve The resolve function to continue the request.
 */
export const handle: Handle = async ({ event, resolve }) => {
    const currentLocale = i18nUtils.getCurrentLocale(event);

    if (!currentLocale)
        throw redirect(307, `${base}/${getPreferredLocale(event)}`);

    const locale = isLocale(currentLocale) ? (currentLocale as Locales) : getPreferredLocale(event);
    const LL = L[locale];

    event.locals.locale = locale;
    event.locals.LL = LL;

    return resolve(event, { transformPageChunk: ({ html }) => html.replace("%lang%", locale) });
};
