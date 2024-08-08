<script setup lang="ts">
import { type Content } from "@prismicio/client";

// The array passed to `getSliceComponentProps` is purely optional.
// Consider it as a visual hint for you when templating your slice.
const props = defineProps(
  getSliceComponentProps<Content.HeroSlice>([
    "slice",
    "index",
    "slices",
    "context",
  ])
);

const sliceProps = computed(() => {
  return props.slice.primary;
});
</script>

<template>
  <Hero
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
    :title="sliceProps.title"
    :titletag="sliceProps.title_tag"
    :description="sliceProps.sub_title"
    :subtitletag="sliceProps.sub_title_tag"
    :right="sliceProps.right"
    :smallertitle="sliceProps.smaller_title"
  >
    <template #image>
      <NuxtImg
        v-if="sliceProps.image"
        fetchpriority="high"
        fit="thumbnail"
        :alt="sliceProps.title"
        loading="eager"
        provider="cloudinaryFetch"
        sizes="sm:100vw"
        :src="sliceProps.image.url"
        :width="sliceProps.image.dimensions.width"
        :height="sliceProps.image.dimensions.height"
      />
    </template>

    <!-- <template #ctas>
        <cta
          v-for="{ cta } in ctas"
          :key="cta.url.href"
          :url="cta.url.href"
          :text="cta.url.title"
          :target="cta.target"
        />
      </template> -->
  </Hero>
</template>
