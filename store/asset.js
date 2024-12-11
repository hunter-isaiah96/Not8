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
      if (asset.value.type == "video" && asset.value.captions.length != 0) {
        await getCaptions(asset.value, asset.value.captions)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getCaptions = async (assetObj, captionsId) => {
    const captionURL = await pb.getFileUrl(assetObj, captionsId)
    asset.value.captionsURL = captionURL
    generateCaptionCues(captionURL)
  }

  const uploadCaptions = async function (file) {
    console.log(file)
    // const captionResults = await pb.collection("assets").update(asset.value.id, {
    //   captions: captionsFile,
    // })
    // console.log(captionResults)
  }

  const generateCaptionCues = async function (captionsURL) {
    const subtitles = await fetch(captionsURL)
    const subtitleText = await subtitles.text()
    const vtt = webvtt.parse(subtitleText)
    captions.value = vtt.cues
  }
  return { asset, captions, loadAsset, uploadCaptions }
})
