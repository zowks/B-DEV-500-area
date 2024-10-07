export const load = async ({ parent }) => {
    const { locale, services } = await parent();

    return { locale, services };
};
