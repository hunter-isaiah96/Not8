<template>
  <v-app>
    <v-main>
      <v-container class="fill-height">
        <v-row
          align="center"
          justify="center"
        >
          <v-col cols="3">
            <v-card color="primary">
              <v-card-title>Login</v-card-title>
              <v-card-text>
                <v-form
                  @submit.prevent="login"
                  id="login-form"
                >
                  <v-text-field
                    v-model="email"
                    label="Email"
                  ></v-text-field>
                  <v-text-field
                    v-model="password"
                    label="Password"
                  ></v-text-field>
                  <v-btn
                    flat
                    block
                    type="submit"
                    form="login-form"
                    :loading="isLoading"
                  >
                    Login
                  </v-btn>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>
<script setup>
const pb = usePocketbase()
const email = ref("")
const password = ref("")
const isLoading = ref(false)

const login = async function (e) {
  console.log(e)
  try {
    isLoading.value = true

    await pb.collection("users").authWithPassword(email.value, password.value)
    navigateTo("/")
  } catch (e) {
    console.log(e)
  } finally {
    isLoading.value = false
  }
}
</script>
