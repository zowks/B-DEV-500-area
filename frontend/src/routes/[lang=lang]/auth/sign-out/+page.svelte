<!-- TODO: implement or remove it -->

<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import LL from "$i18n/i18n-svelte";
</script>

<div class="flex items-center justify-center py-12">
    <div class="mx-auto grid w-[350px] gap-6">
        <div class="text-center">
            <h1 class="text-3xl font-bold">{$LL.auth.signOut.title()}</h1>
        </div>
        <Button type="submit" class="w-full">{$LL.auth.signOut.action()}</Button>
    </div>
</div>
