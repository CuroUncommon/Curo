<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { onMounted, ref } from 'vue'

// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,
// they will be rendered correctly in the html results with vite-ssg
useHead({
  title: 'Vitesse',
  meta: [
    { name: 'description', content: 'Opinionated Vite Starter Template' },
  ],
})

const mounted = ref(false)

onMounted( async () => {
  await new Promise((resolve) => {
    gapi.load("client", resolve);
  })
  
  await gapi.client.init({
    apiKey: "AIzaSyBnQXDP5hR8tbxyFKCP_cUnzN4wKGhFfI8",
    clientId:
      "869858699920-6pgeenk8pbg6lf0mn4kpjmqde87uoeae.apps.googleusercontent.com",
    scope: "https://www.googleapis.com/auth/calendar",
  });

  await gapi.client.load('calendar', 'v3')
  mounted.value = true
})

</script>

<template>
  <router-view v-if="mounted" />
  <template v-else>
    <h1>Loading...</h1>
  </template>
</template>
