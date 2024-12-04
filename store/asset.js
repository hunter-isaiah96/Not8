import { defineStore } from "pinia"
import * as webvtt from "node-webvtt"

export const useAssetStore = defineStore("assetStore", () => {
  const pb = usePocketbase()
  const asset = ref({})
  const captions = ref(null)
  const loadAsset = async function (id) {
    try {
      const assetResult = await pb.collection("assets").getOne(id)
      asset.value = assetResult
      asset.value.mediaURL = pb.files.getUrl(assetResult, assetResult.media)
      if (asset.value.type == "video" && asset.value.captions) {
        const captionURL = await pb.getFileUrl(asset.value, asset.value.captions)
        asset.value.captionsURL = captionURL
        getCaptions(captionURL)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const getCaptions = async function (captionsURL) {
    const subtitles = await fetch(captionsURL)
    const subtitleText = await subtitles.text()
    const vtt = webvtt.parse(subtitleText)
    captions.value = vtt.cues
  }
  return { asset, captions, loadAsset }
})
