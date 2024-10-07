import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent }) => {
    const { locale, services } = await parent();

    return { locale, services };
};
