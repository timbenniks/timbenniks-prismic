<script setup lang="ts">
import { type Content } from "@prismicio/client";

// The array passed to `getSliceComponentProps` is purely optional.
// Consider it as a visual hint for you when templating your slice.
const props = defineProps(
  getSliceComponentProps<Content.VideosSlice>([
    "slice",
    "index",
    "slices",
    "context",
  ])
);

const sliceProps = computed(() => {
  return props.slice.primary;
});

const videos = await useGetListItems({
  type: "video",
  limit: Number(sliceProps.value.limit),
  tag: sliceProps.value.tag,
});

const computedVideos = computed(() => {
  return videos.map((video: any) => {
    return {
      title: video.data.title,
      date: video.data.date,
      description: video.data.description,
      videoId: video.data.videoid,
      image: video.data?.image,
    };
  });
});
</script>

<template>
  <videosList
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
    :videos="computedVideos"
    :description="sliceProps.description"
    :extrasUrl="sliceProps.extras_url.url"
    :small="sliceProps.small"
    :firstFeatured="sliceProps.firstfeatured"
  />
</template>
