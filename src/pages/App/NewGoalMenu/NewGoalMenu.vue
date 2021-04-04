<script lang="ts" setup>
import { ref } from 'vue'
import HInput from '~/components/HInput.vue'
import HBtn from '~/components/HBtn.vue'
import HMenu from '~/components/HMenu.vue'
import HList from '~/components/HList.vue'
import { getEvents } from '~/logic/gapi'
import { applyForDay, applyGoal } from '~/logic/events'

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

const onSaveClicked = async() => {
  /*
   * Create a new event inside of calendar
   * where there's space for it
   * at specified block length timeBlockLength
   */
  const events = (
    await getEvents('primary', new Date(), new Date(new Date().getTime() + timePeriod.value!.numDays * 1000 * 60 * 60 * 24))
  )?.filter(ev => !!ev.end?.dateTime && !!ev.start?.dateTime)
  console.log(events)
  if (!events) return
  try {
    await applyGoal(events, goalName.value!, timeGoal.value!, timePeriod.value!.numDays, minBlockLength.value!)
  }
  catch (e) {
    console.log(e)
  }
}
</script>

<template>
  <div class="bg-gray-100 p-4 w-1/4 dark:bg-harmonydark-800">
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
    <h-menu v-model="timePeriodMenuOpen">
      <template #activator="{ toggle }">
        <h-btn variant="outlined" color="primary" class="mb-2" @click="toggle">
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
    <h-input
      v-model.number="minBlockLength"
      label="Activity block length (minutes)"
      class="mb-4"
      type="number"
    />
    <div class="flex justify-end">
      <h-btn variant="text" class="mr-2">
        Cancel
      </h-btn>
      <h-btn variant="filled" color="primary" :disabled="!goalName" @click="onSaveClicked">
        Save
      </h-btn>
    </div>
  </div>
</template>
