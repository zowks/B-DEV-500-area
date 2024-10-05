import type { Translations } from "./i18n-types";

export type ApiError = keyof Translations["error"]["api"];
