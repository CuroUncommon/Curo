<script lang="ts" setup>
import { auth } from "~/firebase";
import { onMounted } from "vue";
import { ref } from "vue";

var userEmail = ref("yooo")

async function initClient() {
  await new Promise((resolve) => {
    gapi.load("client", resolve);
  })
  await gapi.client.init({
      apiKey: "AIzaSyBnQXDP5hR8tbxyFKCP_cUnzN4wKGhFfI8",
      clientId:
        "869858699920-6pgeenk8pbg6lf0mn4kpjmqde87uoeae.apps.googleusercontent.com",
      discoveryDocs: [
        "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
      ],
      scope: "https://www.googleapis.com/auth/calendar",
   });
}

function updateSignedInState(signedIn: boolean) {
  if (signedIn) {
    userEmail.value = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getEmail()
  } else {
    userEmail.value = "Not signed in yet"
  }
}
async function login() {
  await gapi.auth2.getAuthInstance().signIn();
  console.log("after", await gapi.auth2.getAuthInstance().isSignedIn.get())
}

async function logout() {
  await gapi.auth2.getAuthInstance().signOut(); 
}

onMounted(async () => {
  try {
    await initClient()
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignedInState);
    updateSignedInState(gapi.auth2.getAuthInstance().isSignedIn.get());
  } catch (e) {
    console.log(e)
  }
  
})
</script>
<template>
  <h1 class="text-xl">Hello</h1>
  <p>Currently signed in as {{ userEmail }}</p>
  <button @click="login">Sign In</button>
  <button @click="logout">Sign Out</button>
</template>
