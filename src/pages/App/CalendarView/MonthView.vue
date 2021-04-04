<script lang="ts" setup>
import { useVModel } from '@vueuse/core'
import { defineEmit, defineProps } from 'vue'
import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import { useMappedEvents } from '~/logic/events'

dayjs.extend(LocalizedFormat)

const props = defineProps<{
  numDays: number
  today: number
  modelValue: dayjs.Dayjs
}>()
const emit = defineEmit(['update:modelValue'])

const selected = useVModel(props, 'modelValue', emit)

const days = [
  'Su',
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
  <div class="bg-gray-100 flex-1 grid p-2 gap-1 grid-cols-7 grid-rows-5 dark:bg-harmonydark-800">
    <div v-for="day in props.numDays" :key="day" :class="{'calendar-day': true, selected: day === selected.date(), today: day === today}" @click="onCellClicked(day)">
      {{ day }}
      <div class="w-full">
        <p
          v-for="(ev, d) in mappedEvents?.[day]"
          :key="d"
          class="bg-blue-400 text-xs mb-0.5 p-1"
        >
          {{ ev.start.format('LT') }} - {{ ev.end.format('LT') }} - {{ ev.summary }}
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.calendar-day {
  @apply rounded-md bg-gray-300 dark:bg-harmonydark-700 p-4 cursor-pointer overflow-auto;
}

.selected {
  @apply ring ring-green-300 ring-2;
}

.today {
  @apply border-3 border-blue-400;
}
</style>
