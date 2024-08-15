<template>
  <SliceSimulator #default="{ slices }">
    <section class="bg-[#1b1d39]">
      <SliceZone :slices="slices" :components="components" />
    </section>
  </SliceSimulator>
</template>

<script setup lang="ts">
import { SliceSimulator } from "@slicemachine/adapter-nuxt/simulator";
import { components } from "~/slices";
</script>
