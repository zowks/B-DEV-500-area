<script lang="ts">
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import LL from "$i18n/i18n-svelte";

    export let emailError: string | undefined = undefined;
</script>

<div class="grid gap-2">
    <Label for="email">{$LL.auth.email()}</Label>
    <Input id="email" name="email" type="email" autocomplete="email" placeholder={$LL.auth.placeholders.email()} required />
    {#if emailError}
        <p class="text-sm text-red-500">{emailError}</p>
    {/if}
</div>
