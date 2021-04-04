<script lang="ts" setup>
import { ref } from 'vue'
import HInput from '~/components/HInput.vue'
import HBtn from '~/components/HBtn.vue'
import HMenu from '~/components/HMenu.vue'
import HList from '~/components/HList.vue'

interface ITimePeriod {
  name: string;
  numSeconds: number;
}

const goalName = ref<string | undefined>(undefined)

// total time for goal (in minutes)
const timeGoal = ref<number | undefined>(undefined)

// minimum activity block length
const minBlockLength = ref<number | undefined>(undefined)
// max activity block length
const maxBlockLength = ref<number | undefined>(undefined)

// over what timespan the user wants the goal to be fulfilled (year, month, week, etc.)
const timePeriod = ref<string | undefined>(undefined)
const timePeriodMenuOpen = ref(false)

const timePeriods: ITimePeriod[] = [
  {
    name: 'year',
    numSeconds: 31536000,
  },
  {
    name: 'month',
    numSeconds: 0
  },
  {
     name: 'week', 
     numSeconds: 0
  }
]

const onSaveClicked = () => {
  /*
   * Create a new event inside of calendar
   * where there's space for it
   * at specified block length timeBlockLength
  */
}
</script>

<template>
  <div class="bg-gray-100 p-4 w-1/4 dark:bg-harmonydark-800">
    <h2 class="text-xl mb-3">Create a new goal</h2>
    <h-input label="Goal Name" class="mb-4" v-model="goalName" />
    <p class="mb-2">I want to do this activity for:</p>
    <h-input
      label="Time for goal (minutes)"
      class="mb-4"
      type="number"
      v-model.number="timeGoal"
    />
    <p class="mb-2">Over the course of a:</p>
    <h-menu v-model="timePeriodMenuOpen">
      <template #activator="{ toggle }">
        <h-btn variant="outlined" color="primary" class="mb-2" @click="toggle">
          {{
            timePeriod
              ? $t(`time-period.${timePeriod}`)
              : 'Please select a time period'
          }}
        </h-btn>
      </template>
      <h-list class="w-full">
        <h-list-item
          v-for="period in timePeriods"
          :key="period"
          v-t="`time-period.${period}`"
          @click="timePeriod = period"
        />
      </h-list>
    </h-menu>
    <h-input
      label="Activity block length (minutes)"
      class="mb-4"
      type="number"
    />
    <div class="flex justify-end">
      <h-btn variant="text" class="mr-2"> Cancel </h-btn>
      <h-btn variant="filled" color="primary" @click="onSaveClicked">
        Save
      </h-btn>
    </div>
  </div>
</template>
