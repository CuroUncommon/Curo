<script lang="ts" setup>
import { useVModel } from '@vueuse/core'
import { defineEmit, defineProps } from 'vue'
import dayjs from 'dayjs'
import TimeSegment from './TimeSegment.vue'
import { useMappedEvents } from '~/logic/events'

const props = defineProps<{
  today: number
  modelValue: dayjs.Dayjs
}>()
const emit = defineEmit(['update:modelValue'])

const selected = useVModel(props, 'modelValue', emit)

const days = [
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thurs',
  'Fri',
  'Sat',
]

const mappedEvents = useMappedEvents()

const onCellClicked = (day: number) => {
  selected.value = dayjs().date(day).startOf('day')
}
</script>

<template>
  <div class="bg-gray-300 grid py-3 grid-cols-7 dark:bg-harmonydark-600">
    <div v-for="dayOfWeek in days" :key="dayOfWeek" class="text-center">
      {{ dayOfWeek }}
    </div>
  </div>
  <div class="bg-gray-100 flex-1 grid p-2 gap-1 grid-cols-7 grid-rows-1 dark:bg-harmonydark-800">
    <div v-for="day in 7" :key="day" :class="{'calendar-day': true, selected: (today + day -1) === selected.date(), today: (today + day -1) === today}" @click="onCellClicked((today + day -1))">
      {{ today + day - 1 }}
      <div class="h-full w-full relative">
        <time-segment
          v-for="(ev, d) in mappedEvents?.[today + day - 1]"
          :key="d"

          :title="ev.summary || ''"
          :start="dayjs(ev.start?.dateTime)"
          :end="dayjs(ev.end?.dateTime)"
        />
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.calendar-day {
  @apply rounded-md bg-gray-300 dark:bg-harmonydark-700 p-4 cursor-pointer relative;
}

.selected {
  @apply ring ring-green-300 ring-2;
}

.today {
  @apply border-3 border-blue-400;
}
</style>
