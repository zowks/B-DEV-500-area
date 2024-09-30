<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import LL from "$i18n/i18n-svelte";
</script>

<div class="flex items-center justify-center py-12">
    <div class="mx-auto grid w-[350px] gap-6">
        <div class="grid gap-2 text-center">
            <h1 class="text-3xl font-bold">{$LL.auth.signUp.title()}</h1>
            <p class="text-muted-foreground text-balance">
                {$LL.auth.signUp.subtitle()}
            </p>
        </div>
        <div class="grid gap-4">
            <div class="grid gap-2">
                <Label for="email">{$LL.auth.email()}</Label>
                <Input id="email" type="email" placeholder={$LL.auth.placeholders.email()} required />
            </div>
            <div class="grid gap-2">
                <Label for="password">{$LL.auth.password()}</Label>
                <Input id="password" type="password" placeholder="••••••••" required />
            </div>
            <Button type="submit" class="w-full">{$LL.auth.signUp.action()}</Button>
            <!-- TODO: OAuth buttons -->
        </div>
        <div class="mt-4 text-center text-sm">
            {$LL.auth.alreadyHaveAccount()}
            <a href="sign-in" class="underline"> {$LL.auth.signIn.title()} </a>
        </div>
    </div>
</div>
