import type { Locales } from "$i18n/i18n-types";

/**
 * @property pathname The public path which is accessible without authentication (regular expression).
 * @property privates List of private paths corresponding to the public path (not regular expression).
 * The paths must not include the locale: "/en/auth/sign-out" -> "auth/sign-out".
 * If it starts with a slash, the locale will not be added.
 */
type PublicPath = {
    pathname: string;
    privates?: string[];
}

const PUBLIC_PATHS: PublicPath[] = [
    { pathname: "/client.apk" },
    { pathname: "apk" },
    {
        pathname: "auth/.*", // All authentification paths
        privates: ["auth/sign-out"]
    }
];

export default function isPublicPath(pathname: string, locale: Locales) {
    return PUBLIC_PATHS.some(path => {
        if (path.pathname.startsWith("/"))
            return path.pathname === pathname && !path.privates?.some(privatePath => `/${locale}/${privatePath}` === pathname);
        return (new RegExp(`^/${locale}/${path.pathname}`)).test(pathname) && !path.privates?.some(privatePath => `/${locale}/${privatePath}` === pathname);
    });
}
