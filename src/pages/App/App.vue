<script lang="ts" setup>
import { useRouter } from 'vue-router'
import CalendarView from '~/pages/App/CalendarView/CalendarView.vue'
import CuroNavBar from '~/components/CuroNav.vue'

const router = useRouter()
</script>

<template>
  <div class="flex flex-col h-full w-full">
    <curo-nav-bar>
      <h-btn variant="text" icon @click="router.push('/')">
        <mdi-logout />
      </h-btn>
    </curo-nav-bar>
    <div class="flex flex-1">
      <calendar-view />
    </div>
  </div>
</template>
