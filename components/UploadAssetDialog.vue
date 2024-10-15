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
          <v-textarea
            label="Description"
            v-model="uploadForm.description"
            :disabled="uploadingAsset"
          ></v-textarea>
          <v-file-input
            v-model="uploadForm.media"
            ref="mediaUpload"
            accept="video/*"
            label="Media"
            @change="selectFile"
            :disabled="uploadingAsset"
          ></v-file-input>
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
  description: "",
  media: null,
  metadata: {},
  version: 1,
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
const selectFile = async function (event) {
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
            uploadForm.title = generalMetadata.Title
          }
          uploadForm.metadata.format = generalMetadata.Format

          if (file.type.startsWith("video/")) {
            uploadForm.type = "video"
            uploadForm.metadata.duration = videoMetadata.duration
            uploadForm.metadata.height = videoMetadata.Height
            uploadForm.metadata.width = videoMetadata.Width
            uploadForm.metadata.aspectRatio = useFilters().getAspectRatioString(videoMetadata.Width, videoMetadata.Height)
            uploadForm.metadata.frameCount = videoMetadata.FrameCount
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
  }
}
</script>
