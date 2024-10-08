<script lang="ts">
    import "../app.css";
    import { ModeWatcher } from "mode-watcher";
    import { page } from "$app/stores";
    import type { LayoutData } from "./$types";
    import { baseLocale, locales } from "$i18n/i18n-util";
    import { setLocale } from "$i18n/i18n-svelte";
    import { replaceLocaleInUrl } from "$i18n/utils";

    export let data: LayoutData;

    setLocale(data.locale);
</script>

<svelte:head>
    {#each locales as locale}
        <link rel="alternate" hreflang={locale} href={replaceLocaleInUrl($page.url, locale, true)} />
    {/each}
    <link rel="alternate" hreflang="x-default" href={replaceLocaleInUrl($page.url, baseLocale, true)} />
</svelte:head>
<ModeWatcher />
<slot />
