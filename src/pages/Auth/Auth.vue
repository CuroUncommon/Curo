<script lang="ts" setup>
// import { auth } from "~/firebase";
/* global gapi */

import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import HBtn from '~/components/HBtn.vue'
import CuroNavBar from '~/components/CuroNav.vue'
import { getGAPI } from '~/logic/gapi'

const router = useRouter()

const userEmail = ref<string | undefined>(undefined)
const userAvatar = ref<string | undefined>(undefined)
const isSignedIn = ref<boolean | undefined>(undefined)

async function updateSignedInState(signedIn: boolean) {
  isSignedIn.value = signedIn
  if (signedIn) {
    const profile = (await getGAPI()).auth2.getAuthInstance().currentUser.get().getBasicProfile()
    userEmail.value = profile.getEmail()
    userAvatar.value = profile.getImageUrl()
  }
  else { userEmail.value = undefined }
}
async function login() {
  await (await getGAPI()).auth2.getAuthInstance().signIn()
  console.log('after', await (await getGAPI()).auth2.getAuthInstance().isSignedIn.get())
}

async function logout() {
  await (await getGAPI()).auth2.getAuthInstance().signOut()
}

async function onContinueClick() {
  router.push({ path: '/app' })
}

onMounted(async() => {
  (await getGAPI()).auth2.getAuthInstance().isSignedIn.listen(updateSignedInState)
  updateSignedInState((await getGAPI()).auth2.getAuthInstance().isSignedIn.get())
})
</script>
<template>
  <div class="flex flex-col h-full w-full">
    <curo-nav-bar />
    <div class="flex flex-1 items-center justify-center background">
      <div class="bg-gray-100 shadow-lg text-center ml-4 p-4 dark:bg-harmonydark-800">
        <template v-if="isSignedIn">
          <h1 class="text-xl mb-4">
            Continue as <strong>{{ userEmail }}</strong>?
          </h1>
          <img :src="userAvatar" class="rounded-full mx-auto mb-4" />
          <h-btn variant="filled" color="primary" class="mb-2 w-full" @click="onContinueClick">
            Continue
          </h-btn>
          <h-btn variant="text" class="w-full" @click="logout">
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
          <h-btn variant="filled" color="primary" class="mb-2 w-full" @click="login">
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
