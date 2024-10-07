import type { UserInfo } from "@common/types/users/interfaces/user.interface";
import { AboutJson } from "@common/types/about/interfaces/about.interface";
import type { Locales, TranslationFunctions } from "$i18n/i18n-types";

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

export type Client = UserInfo & {
    accessToken: string;
};

export type Services = AboutJson["server"]["services"];

declare global {
    namespace App {
        // interface Error {}
        interface Locals {
            locale: Locales;
            LL: TranslationFunctions;
            client: Client | null;
            services: Services | null;
        }

        // interface PageData {}
        // interface PageState {}
        // interface Platform {}
    }
}

export {};
