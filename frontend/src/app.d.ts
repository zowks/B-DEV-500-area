import type { UserInfo } from "@common/types/users/interfaces/user.interface";
import type { Locales, TranslationFunctions } from "$i18n/i18n-types";

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

export type Client = UserInfo & {
    accessToken: string;
};

declare global {
    namespace App {
        // interface Error {}
        interface Locals {
            locale: Locales;
            LL: TranslationFunctions;
            client: Client | null;
        }

        // interface PageData {}
        // interface PageState {}
        // interface Platform {}
    }
}

export {};
