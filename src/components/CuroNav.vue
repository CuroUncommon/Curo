<script lang="ts" setup>
import { toggleDark } from '~/logic/dark'
import HBtn from '~/components/HBtn.vue'
</script>

<template>
  <div class="bg-black flex bg-opacity-5 shadow-lg p-4 items-center dark:bg-white dark:bg-opacity-5">
    <h1 class="font-bold text-2xl">
      Curo
    </h1>
    <div class="flex-grow" />
    <h-btn variant="text" icon @click="toggleDark">
      <mdi-theme-light-dark />
    </h-btn>
    <slot />
  </div>
</template>
