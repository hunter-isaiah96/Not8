<template>
  <v-menu transition="scale-transition">
    <template v-slot:activator="{ props }">
      <v-btn
        icon
        v-bind="props"
        >{{ selectedSpeed }}X</v-btn
      >
    </template>
    <v-list>
      <v-list-item
        v-for="speed in speeds"
        :key="speed"
        @click="setSpeed(speed)"
      >
        <v-list-item-title>{{ speed }}X</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup>
import { ref, defineEmits } from "vue"

const speeds = [0.25, 0.5, 0.75, 1, 1.5, 2, 3]
const selectedSpeed = ref(1)

const emit = defineEmits(["update-speed"])

const setSpeed = (speed) => {
  selectedSpeed.value = speed
  emit("update-speed", speed)
}
</script>
