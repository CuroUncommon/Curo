<script lang="ts" setup>
/* global gapi */

import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import HBtn from '~/components/HBtn.vue'
import CuroNavBar from '~/components/CuroNav.vue'

const router = useRouter()

const userEmail = ref<string | undefined>(undefined)
const userAvatar = ref<string | undefined>(undefined)
const isSignedIn = ref<boolean | undefined>(undefined)

async function initClient() {
  await new Promise((resolve) => {
    gapi.load('client', resolve)
  })
  await gapi.client.init({
    apiKey: 'AIzaSyBnQXDP5hR8tbxyFKCP_cUnzN4wKGhFfI8',
    clientId:
        '869858699920-6pgeenk8pbg6lf0mn4kpjmqde87uoeae.apps.googleusercontent.com',
    discoveryDocs: [
      'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
    ],
    scope: 'https://www.googleapis.com/auth/calendar',
  })
}

function updateSignedInState(signedIn: boolean) {
  isSignedIn.value = signedIn
  if (signedIn) {
    const profile = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile()
    userEmail.value = profile.getEmail()
    userAvatar.value = profile.getImageUrl()
  }
  else { userEmail.value = undefined }
}
async function login() {
  await gapi.auth2.getAuthInstance().signIn()
  console.log('after', await gapi.auth2.getAuthInstance().isSignedIn.get())
}

async function logout() {
  await gapi.auth2.getAuthInstance().signOut()
}

async function onContinueClick() {
  router.push({ path: '/app' })
}

onMounted(async() => {
  await initClient()
  gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignedInState)
  updateSignedInState(gapi.auth2.getAuthInstance().isSignedIn.get())
})
</script>
<template>
  <div class="flex flex-col h-full w-full">
    <curo-nav-bar />
    <div class="flex flex-1 items-center justify-center background">
      <div class="bg-gray-100 shadow-lg text-center ml-4 p-4 w-1/5 dark:bg-harmonydark-800">
        <template v-if="isSignedIn">
          <h1 class="text-xl mb-4">
            Continue as <strong>{{ userEmail }}</strong>?
          </h1>
          <img :src="userAvatar" class="rounded-full mx-auto mb-4" />
          <h-btn variant="filled" color="primary" class="mb-2" @click="onContinueClick">
            Continue
          </h-btn>
          <h-btn variant="text" @click="logout">
            Sign Out
          </h-btn>
        </template>
        <template v-else-if="isSignedIn === false">
          <h1 class="mb-2 text-2xl">
            Sign in to manage your calendar
          </h1>
          <p class="text-sm mb-4 text-gray-500 dark:text-gray-400">
            Sign in with Google to gain access to Curo's time management tool
          </p>
          <h-btn variant="filled" color="primary" class="mb-2" @click="login">
            Sign In
          </h-btn>
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
  .background {
  background: repeating-linear-gradient(
    45deg,
    rgba(127, 127, 127, 0.05),
    rgba(127, 127, 127, 0.05) 10px,
    transparent 10px,
    transparent 20px
  );
  background-repeat: repeat;
  fill: black;
}
</style>
