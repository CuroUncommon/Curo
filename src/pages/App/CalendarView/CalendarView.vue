<script lang="ts" setup>
import { computed, ref } from 'vue'
import dayjs from 'dayjs'
import HBtn from '~/components/HBtn.vue'
import NewGoalMenu from '~/pages/App/NewGoalMenu/NewGoalMenu.vue'
import MonthView from '~/pages/App/CalendarView/MonthView.vue'
import WeekView from '~/pages/App/CalendarView/WeekView.vue'
import { appStore } from '~/store/app'
import { getAllEvents } from '~/logic/gapi'
import { updateGoals } from '~/logic/events'

const now = dayjs().startOf('day')

const newGoalMenuOpen = ref(false)
const selected = ref(now)
const range = ref<'month' | 'week'>('month')
const numDays = computed(() => selected.value.daysInMonth())
const today = computed(() => now.date())
const refreshing = ref(false)

const refreshClick = async() => {
  refreshing.value = true
  const goalCal = appStore.getGoalCal()
  appStore.setGoalEvents(await getAllEvents(goalCal!.id!))
  refreshing.value = false
}
</script>

<template>
  <new-goal-menu v-model="newGoalMenuOpen" :date="selected" />
  <div class="flex flex-col flex-1 p-5">
    <div class="flex justify-end">
      <h-dropdown v-model="range" :options="['month', 'week']" class="mr-3 mb-4">
        <template v-if="range === 'week'">
          <mdi-view-week class="mr-2" /> Week View
        </template>
        <template v-else-if="range === 'month'">
          <mdi-calendar-month class="mr-2" /> Month View
        </template>
      </h-dropdown>
      <h-btn variant="outlined" color="primary" class="mr-3 mb-4" @click="updateGoals">
        Update Goals
      </h-btn>
      <h-btn variant="outlined" color="primary" class="mr-3 mb-4" @click="newGoalMenuOpen = true">
        <mdi-plus class="mr-2" /> New Goal
      </h-btn>
      <h-btn variant="outlined" color="primary" class="mb-4" @click="refreshClick">
        <mdi-refresh v-if="!refreshing" class="mr-2" /> {{ refreshing ? 'Refreshing...' : 'Refresh' }}
      </h-btn>
    </div>
    <month-view v-if="range === 'month'" v-model="selected" :num-days="numDays" :today="today" />
    <week-view v-else-if="range === 'week'" v-model="selected" :today="today" />
  </div>
</template>
