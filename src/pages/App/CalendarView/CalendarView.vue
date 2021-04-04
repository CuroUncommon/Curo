<script lang="ts" setup>
import { getEvents } from "~/getCalEvents";
import { onMounted } from 'vue'

const today = new Date()

const numDays = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()

const days = [
  'Su',
  'Mon',
  'Tue',
  'Wed',
  'Thurs',
  'Fri',
  'Sat',
]

const data = {}

onMounted(async () => {
  console.log(await getEvents('primary'))
})
</script>

<template>
  <div class="flex flex-col flex-1 p-5">
    <div class="bg-harmonydark-600 grid py-3 grid-cols-7">
      <div v-for="day in days" :key="day" class="text-center">
        {{ day }}
      </div>
    </div>
    <div class="bg-harmonydark-800 flex-1 grid p-2 gap-2 grid-cols-7 grid-rows-5">
      <div v-for="day in numDays" :key="day" class="rounded-md bg-harmonydark-700 p-4">
        {{ day }}
      </div>
    </div>
  </div>
</template>