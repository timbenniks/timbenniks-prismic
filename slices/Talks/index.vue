<script setup lang="ts">
import { type Content } from "@prismicio/client";

// The array passed to `getSliceComponentProps` is purely optional.
// Consider it as a visual hint for you when templating your slice.
const props = defineProps(
  getSliceComponentProps<Content.TalksSlice>([
    "slice",
    "index",
    "slices",
    "context",
  ])
);

const sliceProps = computed(() => {
  return props.slice.primary;
});

const talks = await useGetListItems({
  type: "talk",
  limit: Number(sliceProps.value.limit),
});

const computedTalks = computed(() => {
  return talks.map((talk: any) => {
    return {
      date: talk.data.date,
      talk: talk.data.talk,
      conference: talk.data.conference,
      location: talk.data.location,
      link: talk.data?.link?.url,
    };
  });
});
</script>

<template>
  <talksList
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
    :talks="computedTalks"
    :title="sliceProps.title"
    :small="sliceProps.small"
  />
</template>
