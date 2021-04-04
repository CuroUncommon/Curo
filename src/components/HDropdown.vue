<script lang="ts" setup>
import { defineEmit, defineProps, ref } from '@vue/runtime-core'
import { useVModel } from '@vueuse/core'

const props = defineProps<{
  modelValue: string
  options: string[]
}>()
const emit = defineEmit(['update:modelValue'])
const selected = useVModel(props, 'modelValue', emit)
const open = ref(false)
</script>

<template>
  <h-menu v-model="open" close-on-click>
    <template #activator="{ toggle }">
      <h-btn :variant="open ? 'filled' : 'outlined'" color="primary" v-bind="$attrs" @click="toggle">
        <slot />
      </h-btn>
    </template>
    <h-list class="w-full">
      <h-list-item
        v-for="option in props.options"
        :key="option"
        @click="selected = option"
      >
        {{ option }}
      </h-list-item>
    </h-list>
  </h-menu>
</template>
