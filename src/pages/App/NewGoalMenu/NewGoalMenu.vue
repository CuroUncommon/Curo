<script lang="ts" setup>
import { ref } from 'vue'
import HInput from '~/components/HInput.vue'
import HBtn from '~/components/HBtn.vue'
import HMenu from '~/components/HMenu.vue'
import HList from '~/components/HList.vue'

const timePeriod = ref<string | undefined>(undefined)
const timePeriodMenuOpen = ref(false)

const timePeriods = ['year', 'month', 'week']
</script>

<template>
  <div class="bg-gray-100 p-4 w-1/4 dark:bg-harmonydark-800">
    <h2 class="text-xl mb-3">
      Create a new goal
    </h2>
    <h-input label="Goal Name" class="mb-4" />
    <p class="mb-2">
      I want to do this activity for:
    </p>
    <h-input label="Time for goal (minutes)" class="mb-4" type="number" />
    <p class="mb-2">
      Over the course of a:
    </p>
    <h-menu v-model="timePeriodMenuOpen">
      <template #activator="{toggle}">
        <h-btn variant="outlined" color="primary" class="mb-2" @click="toggle">
          {{ timePeriod ? $t(`time-period.${timePeriod}`) : 'Please select a time period' }}
        </h-btn>
      </template>
      <h-list class="w-full">
        <h-list-item v-for="period in timePeriods" :key="period" v-t="`time-period.${period}`" @click="timePeriod = period" />
      </h-list>
    </h-menu>
    <h-input label="Activity block length (minutes)" class="mb-4" type="number" />
    <div class="flex justify-end">
      <h-btn variant="text" class="mr-2">
        Cancel
      </h-btn>
      <h-btn variant="filled" color="primary">
        Save
      </h-btn>
    </div>
  </div>
</template>
