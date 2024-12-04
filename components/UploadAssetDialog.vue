<template>
  <v-dialog
    v-model="props.value"
    width="auto"
    @click:outside="closeDialog"
  >
    <v-card
      min-width="600"
      max-width="1000"
      prepend-icon="mdi-update"
      title="Upload New Asset"
      :loading="uploadingAsset"
    >
      <v-form>
        <v-card-text>
          <v-text-field
            label="Title"
            v-model="uploadForm.title"
            :disabled="uploadingAsset"
          ></v-text-field>
          <v-row>
            <v-col cols="6">
              <v-file-input
                v-model="uploadForm.media"
                ref="mediaUpload"
                accept="video/*"
                label="Media"
                @change="selectMediaFile"
                :disabled="uploadingAsset"
              ></v-file-input>
            </v-col>
            <v-col cols="6">
              <v-img
                v-if="uploadForm.thumbnailURL"
                :src="uploadForm.thumbnailURL"
                max-height="155"
              ></v-img>
            </v-col>
          </v-row>
          <v-row v-if="uploadForm.type == 'video'">
            <v-col>
              <v-file-input
                v-model="uploadForm.captions"
                ref="mediaUpload"
                label="Caption File"
                :disabled="uploadingAsset"
              ></v-file-input>
            </v-col>
          </v-row>
        </v-card-text>
      </v-form>
      <template v-slot:actions>
        <v-btn
          text="Cancel"
          @click="closeDialog"
          :disabled="uploadingAsset"
        ></v-btn>
        <v-btn
          text="Create"
          @click="uploadAsset"
          :disabled="uploadingAsset"
        ></v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, reactive, defineProps, defineEmits } from "vue"
const pb = usePocketbase()
const filters = useFilters()

const props = defineProps({
  value: {
    type: Boolean,
    default: false,
  },
})

const uploadingAsset = ref(false)
const user = pb.authStore.model
const emit = defineEmits(["update:modelValue"])

const uploadForm = reactive({
  title: "",
  media: null,
  captions: null,
  metadata: {},
  type: null,
  version: 1,
  thumbnailURL: null,
  thumbnail: null,
})

// Method to close the dialog
const closeDialog = () => {
  emit("update:modelValue", false)
}

// Upload Asset
const uploadAsset = async function () {
  try {
    uploadingAsset.value = true
    const formData = {
      ...uploadForm,
      user: user.id,
    }
    const createdAsset = await pb.collection("assets").create(formData)
    closeDialog()
    navigateTo(`/asset/view/${createdAsset.id}`)
  } catch (error) {
    console.log(error)
  } finally {
    uploadingAsset.value = false
  }
}

// Select File
const selectMediaFile = async function (event) {
  const fileInput = event.target
  const file = fileInput.files?.[0]

  if (file) {
    // Initialize MediaInfo
    MediaInfo.mediaInfoFactory({}, (mediainfo) => {
      const readChunk = async (chunkSize, offset) => new Uint8Array(await file.slice(offset, offset + chunkSize).arrayBuffer())

      mediainfo
        .analyzeData(file.size, readChunk)
        .then((result) => {
          const generalMetadata = result.media.track[0]
          const videoMetadata = result.media.track[1]
          const audioMetaData = result.media.track[2]
          uploadForm.metadata.fileName = file.name
          if (uploadForm.title === "") {
            uploadForm.title = file.name.split(".")[0]
          }
          uploadForm.metadata.format = generalMetadata.Format

          if (file.type.startsWith("video/")) {
            uploadForm.type = "video"
            uploadForm.metadata.size = filters.formatBytes(file.size)
            uploadForm.metadata.duration = generalMetadata.Duration
            uploadForm.metadata.height = videoMetadata.Height
            uploadForm.metadata.width = videoMetadata.Width
            uploadForm.metadata.aspectRatio = filters.getAspectRatioString(videoMetadata.Width, videoMetadata.Height)
            uploadForm.metadata.frameCount = Math.round(generalMetadata.Duration * videoMetadata.FrameRate)
            uploadForm.metadata.fps = videoMetadata.FrameRate
            uploadForm.metadata.audioFormat = audioMetaData.Format
            uploadForm.metadata.audioSampleRate = audioMetaData.SamplingRate
            uploadForm.metadata.audioCompression = audioMetaData.CompressionMode
          }
        })
        .catch((error) => {
          console.error(`An error occurred: ${error.stack}`)
        })
    })

    const thumbnail = await getVideoThumbnail(file)
    const thumbnailURL = URL.createObjectURL(thumbnail)

    uploadForm.thumbnailURL = thumbnailURL
    uploadForm.thumbnail = thumbnail
  }
}
</script>
