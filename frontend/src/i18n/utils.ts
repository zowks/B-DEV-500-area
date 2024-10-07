import type { RequestEvent, Cookies } from "@sveltejs/kit";
import { base } from "$app/paths";

//region Cookies utility functions

/**
 * Set the locale cookie.
 *
 * @param locale The locale to set in the cookie.
 * @param cookies The cookies object.
 */
export function setLocaleCookie(locale: string, cookies: Cookies) {
    cookies.set("locale", locale, { path: "/", expires: new Date("9999-12-31"), secure: false });
}

/**
 * Get the locale from the cookie.
 *
 * @param cookies The cookies object.
 *
 * @returns The locale from the cookie, or `undefined` if the locale is not found.
 */
export function getLocaleFromCookie(cookies: Cookies): string | undefined {
    return cookies.get("locale");
}

//endregion

//region URL utility functions

type ParsedPathname = {
    locale?: string;
    rest?: string;
};

/**
 * Parse the pathname information from the URL.
 * Get the locale and the rest of the pathname from the URL and return them.
 * For example, if the URL is "http://localhost:3000/en/foo", the result will be { locale: "en", rest: "foo" }.
 *
 * @param url The URL to parse.
 *
 * @returns {ParsedPathname} The parsed pathname.
 */
function parsePathname(url: URL): ParsedPathname {
    const [, locale, ...rest] = url.pathname.replace(new RegExp(`^${base}`), "").split("/");

    return { locale, rest: rest.join("/") };
}

/**
 * Get the current locale from the URL.
 * For example, if the URL is "http://localhost:3000/en/foo", the result will be "en".
 *
 * @param url The URL object.
 *
 * @returns The current locale, or `undefined` if the locale is not found.
 */
export function getCurrentLocale({ url }: RequestEvent): string | undefined {
    return parsePathname(url).locale;
}

/**
 * Replace the locale in the URL and return it.
 *
 * @param url The URL object.
 * @param locale The new locale.
 * @param full Whether to return the full URL or just the pathname.
 *
 * @returns The URL with the new locale.
 */
export function replaceLocaleInUrl(url: URL, locale: string, full = false): string {
    const newPathname = `/${locale}/${parsePathname(url).rest || ""}`;

    if (!full)
        return `${newPathname}${url.search}`;

    const newUrl = new URL(url.toString());

    newUrl.pathname = base + newPathname;
    return newUrl.toString();
}

//endregion
