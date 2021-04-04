<script lang="ts" setup>
/* global gapi */
import { defineEmit, defineProps, ref, onMounted, computed } from 'vue'
import { useVModel } from '@vueuse/core'
import dayjs, { Dayjs } from 'dayjs'
import HInput from '~/components/HInput.vue'
import HBtn from '~/components/HBtn.vue'
import HMenu from '~/components/HMenu.vue'
import HList from '~/components/HList.vue'
import { getCalendars, getEvents } from '~/logic/gapi'
import { applyGoal } from '~/logic/events'
import HDialog from '~/components/HDialog.vue'
import { appStore } from '~/store/app'
import type { IEvent } from '~/types'

const props = defineProps<{
  modelValue: boolean
  date: Dayjs
}>()
const emit = defineEmit(['update:modelValue'])
const open = useVModel(props, 'modelValue', emit)

const goalCalendarListMenuOpen = ref(false)

const readCalendarListMenuOpen = ref(false)

interface ITimePeriod {
  name: string
  numDays: number
}

const goalName = ref<string | undefined>(undefined)

// total time for goal (in minutes)
const timeGoal = ref<number | undefined>(undefined)

// minimum activity block length
const minBlockLength = ref<number | undefined>(undefined)

// over what timespan the user wants the goal to be fulfilled (year, month, week, etc.)
const timePeriod = ref<ITimePeriod | undefined>(undefined)
const timePeriodMenuOpen = ref(false)

const timePeriods: ITimePeriod[] = [
  {
    name: 'year',
    numDays: 365,
  },
  {
    name: 'month',
    numDays: 30,
  },
  {
    name: 'week',
    numDays: 7,
  },
]

const readCal = computed(() => appStore.getUserCal())
const goalCal = computed(() => appStore.getGoalCal())
const cals = computed(() => appStore.getCalendars())

const onSaveClicked = async() => {
  /*
   * Create a new event inside of calendar
   * where there's space for it
   * at specified block length timeBlockLength
   */
  console.log(props.date)
  const date = props.date
  const personal_events = await getEvents(readCal.value!.id!, date, date.add(timePeriod.value!.numDays, 'days'))
  const goal_events = await getEvents(goalCal.value!.id!, date, date.add(timePeriod.value!.numDays, 'days'))

  const events = personal_events?.concat(goal_events!)
    .filter(ev => !!ev.end?.dateTime && !!ev.start?.dateTime)
    .sort((a, b) => {
      const first = new Date(a.start!.dateTime!)
      const second = new Date(b.start!.dateTime!)

      if (first < second) return -1
      if (first > second) return 1
      return 0
    })
    .map<IEvent>(ev => ({
      start: dayjs(ev.start?.dateTime),
      end: dayjs(ev.end?.dateTime),
      summary: ev.summary || 'unknown name',
      id: ev.id!,
    }))
  console.log(events)
  if (!events) return
  await applyGoal(
    goalCal.value!.id!,
    events,
    goalName.value!,
    date,
    timeGoal.value!,
    timePeriod.value!.numDays,
    minBlockLength.value!,
  )

  open.value = false
}

onMounted(async() => {
  appStore.setCalendars(await getCalendars())
})
</script>

<template>
  <h-dialog v-model="open">
    <h2 class="text-xl mb-3">
      Create a new goal
    </h2>
    <h-input v-model="goalName" label="Goal Name" class="mb-4" />
    <p class="mb-2">
      I want to do this activity for:
    </p>
    <h-input
      v-model.number="timeGoal"
      label="Time for goal (minutes)"
      class="mb-4"
      type="number"
    />
    <p class="mb-2">
      Over the course of a:
    </p>
    <h-menu v-model="timePeriodMenuOpen" close-on-click>
      <template #activator="{ toggle }">
        <h-btn variant="outlined" color="primary" class="mb-2 w-full" @click="toggle">
          {{
            timePeriod
              ? $t(`time-period.${timePeriod.name}`)
              : 'Please select a time period'
          }}
        </h-btn>
      </template>
      <h-list class="w-full">
        <h-list-item
          v-for="period in timePeriods"
          :key="period"
          v-t="`time-period.${period.name}`"
          @click="timePeriod = period"
        />
      </h-list>
    </h-menu>
    <h-menu v-model="readCalendarListMenuOpen" close-on-click>
      <template #activator="{ toggle }">
        <h-btn variant="outlined" color="primary" class="mb-2 w-full" @click="toggle">
          {{
            readCal
              ? `read from: ${readCal.summary}`
              : 'Select a calendar to read appointments from'
          }}
        </h-btn>
      </template>
      <h-list class="w-full">
        <h-list-item
          v-for="calendar in cals"
          :key="calendar"
          @click="appStore.setReadCalendar(calendar)"
        >
          {{ calendar.summary }}
        </h-list-item>
      </h-list>
    </h-menu>
    <h-menu v-model="goalCalendarListMenuOpen" close-on-click>
      <template #activator="{ toggle }">
        <h-btn variant="outlined" color="primary" class="mb-2 w-full" @click="toggle">
          {{
            goalCal
              ? `write to: ${goalCal.summary}`
              : 'Select a calendar to write your schedule to'
          }}
        </h-btn>
      </template>
      <h-list class="w-full">
        <h-list-item
          v-for="calendar in cals"
          :key="calendar"
          @click="appStore.setGoalCalendar(calendar)"
        >
          {{ calendar.summary }}
        </h-list-item>
      </h-list>
    </h-menu>
    <h-input
      v-model.number="minBlockLength"
      label="Activity block length (minutes)"
      class="mb-4"
      type="number"
    />
    <div class="flex justify-end">
      <h-btn variant="text" class="mr-2" color="secondary" @click="open = false">
        Cancel
      </h-btn>
      <h-btn variant="filled" color="primary" :disabled="(!goalName || !goalCal || !readCal || !timePeriod)" @click="onSaveClicked">
        Save
      </h-btn>
    </div>
  </h-dialog>
</template>
