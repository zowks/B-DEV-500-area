<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import LL from "$i18n/i18n-svelte";
</script>

<div class="p-4">
    <form method="GET" action="dashboard/create">
        <Button type="submit" variant="outline">
            {$LL.area.createArea()}
        </Button>
    </form>
</div>
