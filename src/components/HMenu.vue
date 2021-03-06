<script setup lang="ts">
import {
  debouncedWatch,
  onClickOutside,
  useVModel,
  useWindowSize,
} from '@vueuse/core'
import { computed, nextTick, ref, defineProps, defineEmit } from 'vue'

const props = defineProps<{
  modelValue: boolean
  closeOnClick?: boolean
}>()
const emit = defineEmit(['update:modelValue'])

const open = useVModel(props, 'modelValue', emit)

const { width, height } = useWindowSize()

const x = ref(0)
const y = ref(0)
const elWidth = ref(0)
const menu = ref<HTMLDivElement | null>(null)
const activator = ref<Element | null>(null)

onClickOutside(menu, () => {
  open.value = false
})

function updateMenuPos() {
  const activatorBbox = activator.value!.getBoundingClientRect()
  const menuBbox = menu.value!.getBoundingClientRect()

  elWidth.value = activatorBbox.width
  // we want a slight offset (12) to make menus look nicer when on the edge
  x.value = Math.max(
    activatorBbox.x,
    12,
  )
  y.value = Math.max(activatorBbox.y + activatorBbox.height, 0)
}

async function toggle(ev: MouseEvent) {
  open.value = true
  await nextTick()
  const el = ev.currentTarget as Element
  activator.value = el
  updateMenuPos()
}

debouncedWatch(
  [width, height],
  () => {
    if (props.modelValue && activator) updateMenuPos()
  },
  {
    debounce: 150,
  },
)

const menuStyle = computed(() => {
  return {
    top: `${y.value}px`,
    left: `${x.value}px`,
    width: `${elWidth.value}px`,
  }
})

const onMenuClick = () => {
  if (props.closeOnClick)
    open.value = false
}
</script>

<template>
  <slot name="activator" :toggle="toggle" />
  <Teleport to="#app">
    <transition name="menu">
      <div
        v-show="open"
        ref="menu"
        class="z-50 fixed"
        :style="menuStyle"
        v-bind="$attrs"
        @click="onMenuClick"
      >
        <slot />
      </div>
    </transition>
  </Teleport>
</template>

<style lang="postcss" scoped>
.menu-enter-active,
.menu-leave-active {
  @apply transform;
  transition: opacity 0.05s linear, transform 0.05s linear;
}

.menu-enter-from,
.menu-leave-to {
  @apply opacity-0 -translate-y-2;
}
</style>
