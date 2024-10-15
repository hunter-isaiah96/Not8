import { defineStore } from "pinia"

export const useUserStore = defineStore("userStore", () => {
  const user = reactive({})

  function updateUser(newUser) {
    Object.assign(user, newUser) // Merge new data into the empty object
  }

  return { user, updateUser }
})
