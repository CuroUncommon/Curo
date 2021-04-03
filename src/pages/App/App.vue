<script lang="ts" setup>
import HBtn from '~/components/HBtn.vue'
import NewGoalMenu from '~/pages/App/NewGoalMenu/NewGoalMenu.vue'
import CalendarView from '~/pages/App/CalendarView/CalendarView.vue'
import { toggleDark } from '~/logic/dark'
</script>

<template>
  <div class="flex flex-col h-full w-full">
    <div class="bg-black flex bg-opacity-5 shadow-lg p-4 items-center dark:bg-white dark:bg-opacity-5">
      <h1 class="font-bold text-2xl">
        Curo
      </h1>
      <div class="flex-grow" />
      <h-btn variant="text" icon @click="toggleDark">
        <mdi-theme-light-dark />
      </h-btn>
    </div>
    <div class="flex flex-1">
      <new-goal-menu />
      <calendar-view />
    </div>
  </div>
</template>
