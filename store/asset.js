import { defineStore } from "pinia"

export const useAssetStore = defineStore("assetStore", () => {
  const pb = usePocketbase()
  const asset = ref({})
  const loadAsset = async function (id) {
    try {
      const assetResult = await pb.collection("assets").getOne(id)
      asset.value = assetResult
      asset.value.mediaURL = pb.files.getUrl(assetResult, assetResult.media)
    } catch (error) {
      console.log(error)
    }
  }
  return { asset, loadAsset }
})
