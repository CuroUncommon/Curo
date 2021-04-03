<script lang="ts" setup>
import NewGoalMenu from '~/pages/App/NewGoalMenu/NewGoalMenu.vue'
import CalendarView from '~/pages/App/CalendarView/CalendarView.vue'
import CuroNavBar from '~/components/CuroNav.vue'
</script>

<template>
  <div class="flex flex-col h-full w-full">
    <curo-nav-bar />
    <div class="flex flex-1">
      <new-goal-menu />
      <calendar-view />
    </div>
  </div>
</template>
