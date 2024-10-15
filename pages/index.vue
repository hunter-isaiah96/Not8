<template>
  <v-app>
    <v-app-bar color="primary">
      <v-app-bar-title href="/">Title</v-app-bar-title>
      <v-spacer></v-spacer>

      <v-btn
        @click="uploadDialog = true"
        icon
      >
        <v-icon> mdi-upload </v-icon>
      </v-btn>
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn
            icon="mdi-dots-vertical"
            variant="text"
            v-bind="props"
          >
            <v-avatar>
              <v-img
                :alt="user.username"
                :src="avatar"
              ></v-img>
            </v-avatar>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="logout"> Logout </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <NuxtPage></NuxtPage>
      </v-container>
    </v-main>
    <UploadAssetDialog v-model="uploadDialog" />
  </v-app>
</template>
<script setup>
definePageMeta({
  middleware: "auth",
})

const pb = usePocketbase()
const user = pb.authStore.model
const avatar = pb.files.getUrl(user, user.avatar, { thumb: "100x100" })
const uploadDialog = ref(false)

const logout = function () {
  pb.authStore.clear()
  navigateTo("/auth/login")
}
</script>
