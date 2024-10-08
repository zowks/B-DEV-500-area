<script lang="ts">
    import { resetMode, setMode, toggleMode } from "mode-watcher";
    import Sun from "lucide-svelte/icons/sun";
    import Moon from "lucide-svelte/icons/moon";
    import ArrowDown from "lucide-svelte/icons/arrow-down";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
    import { Button, buttonVariants } from "$lib/components/ui/button";
    import { Separator } from "$lib/components/ui/separator";
    import { cn } from "$lib/utils";
    import { invalidateAll } from "$app/navigation";
    import { browser } from "$app/environment";
    import { page } from "$app/stores";
    import type { Locales } from "$i18n/i18n-types";
    import LL, { locale, setLocale } from "$i18n/i18n-svelte";
    import { locales } from "$i18n/i18n-util";
    import { loadLocaleAsync } from "$i18n/i18n-util.async";
    import * as i18nUtils from "$i18n/utils";
    import { default as i18nDisplayNames } from "$i18n/displayNames";

    const switchLocale = async (newLocale: Locales) => {
        if (!newLocale || $locale === newLocale) return;

        await loadLocaleAsync(newLocale);
        setLocale(newLocale);
        await invalidateAll();
    };

    $: if (browser)
        document.querySelector("html")?.setAttribute("lang", $locale);

    /**
     * Update locale when page store changes.
     */
    $: if (browser)
        switchLocale($page.params.lang as Locales);
</script>

<header>
    <div class="grid grid-cols-2 m-2">
        <a href="/">
            <h1 class="font-bold text-4xl">AREA</h1>
        </a>
        <div class="flex justify-end items-center space-x-2">
            <a href="/{$locale}/apk" class={cn(buttonVariants(), "max-mobile:hidden")}>
                {$LL.apk.title()}
            </a>
            <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild let:builder>
                    <Button builders={[builder]} variant="outline" size="icon">
                        <p class="h-[1.2rem] w-[1.2rem]">
                            {i18nDisplayNames[$locale].short}
                        </p>
                        <span class="sr-only">{$LL.header.selectLanguage()}</span>
                    </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                    {#each locales as locale}
                        <DropdownMenu.Item href={i18nUtils.replaceLocaleInUrl($page.url, locale)}>
                            {i18nDisplayNames[locale].name}
                        </DropdownMenu.Item>
                    {/each}
                </DropdownMenu.Content>
            </DropdownMenu.Root>
            <div class="flex items-center">
                <Button on:click={toggleMode} variant="outline" size="icon" class="rounded-r-none">
                    <Sun
                        class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon
                        class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span class="sr-only">{$LL.header.toggleTheme()}</span>
                </Button>
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild let:builder>
                        <Button builders={[builder]} variant="outline" class="px-0.5 rounded-l-none border-l-0">
                            <ArrowDown class="h-[1.2rem] w-[1.2rem]" />
                            <span class="sr-only">{$LL.header.selectTheme()}</span>
                        </Button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content align="end">
                        <DropdownMenu.Item on:click={() => setMode("light")}>{$LL.header.light()}</DropdownMenu.Item>
                        <DropdownMenu.Item on:click={() => setMode("dark")}>{$LL.header.dark()}</DropdownMenu.Item>
                        <DropdownMenu.Item on:click={() => resetMode()}>{$LL.header.system()}</DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Root>
            </div>
        </div>
    </div>
    <Separator />
</header>
