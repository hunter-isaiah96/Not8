import { useUserStore } from "~/store/user"

export default defineNuxtRouteMiddleware((to, from) => {
  const userStore = useUserStore()
  const { updateUser } = userStore
  // isAuthenticated() is an example method verifying if a user is authenticated
  if (isAuthenticated() === false) {
    return navigateTo("/auth/login")
  }
  const pb = usePocketbase()

  const userModel = pb.authStore.model
  if (userModel) {
    userModel.avatar = pb.getFileUrl(userModel, userModel.avatar, { thumb: "100x100" })
    updateUser(userModel)
  }
})
