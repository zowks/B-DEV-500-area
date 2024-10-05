<!-- TODO: make auth pages functional -->

<div class="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
    <div class="bg-muted hidden lg:block">
        <!-- TODO: Potentially replace this image -->
        <img
            src="https://cdn.prod.website-files.com/5d9bdb47e33988bf5815bfed/659c9a73c39d516f303a1cf8_workflows-automation.png"
            alt="workflow automation"
            width="1300"
            height="860"
            class="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
    </div>
    <slot />
</div>
