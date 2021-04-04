<script lang="ts" setup>
import { computed, defineProps, ref } from '@vue/runtime-core'
import { Dayjs } from 'dayjs'
import { appStore } from '~/store/app'
import { deleteAllEventsByID } from '~/logic/events'

const props = defineProps<{
  start: Dayjs
  end: Dayjs
  title: string
}>()

const getMinutesSinceMidnight = (time: Dayjs) => {
  return time.diff(time.startOf('day'), 'minute')
}

const percentDown = computed(() => (getMinutesSinceMidnight(props.start) / (24 * 60)) * 100)
const endPercentDown = computed(() => (getMinutesSinceMidnight(props.end) / (24 * 60)) * 100)
const height = computed(() => endPercentDown.value - percentDown.value)

const configOpen = ref(false)

const onDeleteClick = () => {
  deleteAllEventsByID(appStore.getGoalCal()!.id!, appStore.getGoals()[props.title].events.map(ev => ev.id))
}
</script>

<template>
  <div v-wave class="rounded-sm bg-red-600 mt-1 w-full p-1 ring-red-400 ring-1 overflow-hidden absolute" :style="{top: `${percentDown}%`, height: `${height}%`}" @click.stop="" @click="configOpen = !configOpen">
    <p class="text-xs leading-3">
      {{ props.title }}
    </p>
  </div>
  <h-dialog v-model="configOpen">
    <h1 class="text-xl mb-3">
      Edit Goal "{{ props.title }}"
    </h1>
    <h-btn variant="filled" color="primary" @click="onDeleteClick">
      Delete Goal
    </h-btn>
  </h-dialog>
</template>
