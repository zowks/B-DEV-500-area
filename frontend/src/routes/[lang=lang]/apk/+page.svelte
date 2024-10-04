<script lang="ts">
    import { onMount } from "svelte";
    import QRCode from "qrcode";
    import LL from "$i18n/i18n-svelte";
    import { buttonVariants } from "$lib/components/ui/button";

    let qrCodeUrl: string = "";

    onMount(() => QRCode.toDataURL(window.location.href).then((url) => qrCodeUrl = url).catch(() => qrCodeUrl = ""));
</script>

<div class="flex flex-col items-center justify-center space-y-10 h-[600px]">
    <h1 class="font-bold text-2xl">{$LL.apk.title()}</h1>
    {#if qrCodeUrl}
        <img src={qrCodeUrl} alt={window.location.href} class="dark:invert" />
    {/if}
    <a href="/apk/client.apk" download class={buttonVariants()}>
        {$LL.apk.download()}
    </a>
</div>
