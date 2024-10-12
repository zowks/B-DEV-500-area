<script>
    import { page } from "$app/stores";
    import { Button } from "$lib/components/ui/button";
    import LL from "$i18n/i18n-svelte";
</script>

<div class="flex items-center justify-center h-screen">
    <div class="space-y-8 text-center">
        <div class="space-y-4">
            <h1 class="text-5xl font-bold">{$page.status}</h1>
            <p class="text-muted-foreground">{$page.error?.message}</p>
        </div>
        <Button href="/" class="w-80">{$LL.error.goHome()}</Button>
    </div>
</div>
