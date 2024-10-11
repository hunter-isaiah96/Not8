import PocketBase from "pocketbase"

const runtimeConfig = useRuntimeConfig()
const pb = new PocketBase(runtimeConfig.public.pocketbaseURL)

export const usePocketbase = () => pb
export const isAuthenticated = () => pb.authStore.isValid
