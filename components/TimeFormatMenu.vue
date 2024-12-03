<template>
  <v-menu
    transition="scale-transition"
    location="top"
  >
    <template v-slot:activator="{ props, isActive }">
      <v-btn
        v-bind="props"
        class="text-capitalize"
        :append-icon="isActive ? 'mdi-chevron-up' : 'mdi-chevron-down'"
      >
        {{ timeFormat }}
      </v-btn>
    </template>
    <v-list>
      <v-list-item
        v-for="format in timeFormats"
        :key="format"
        @click="setFormat(format)"
      >
        <v-list-item-title>{{ format }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup>
import { defineEmits } from "vue"

const props = defineProps({
  timeFormat: Array,
  currentTime: String,
  totalTime: String,
  videoPlayerTime: Number,
  fps: Number,
})

const timeFormats = ["Standard", "Frames"]
const timeFormat = computed(() =>
  props.timeFormat[0] == "Standard" ? `${props.currentTime} / ${props.totalTime}` : `${Math.round(props.videoPlayerTime * parseFloat(props.fps))}`
)

const emit = defineEmits(["updateFormat"])

const setFormat = (format) => {
  emit("updateFormat", format)
}
</script>
