<script setup lang="ts">
import { components } from "~/slices";

const prismic = usePrismic();
const route = useRoute();

const uid = route.params.uid ? route.params.uid : ("home" as string);

const { data: page } = useAsyncData(`[page-uid-${route.params.uid}]`, () =>
  prismic.client.getByUID("page", uid)
);

useHead({
  title: page.value?.data.meta_title,
  meta: [
    {
      name: "description",
      content: page.value?.data.meta_description,
    },
  ],
});
</script>

<template>
  <SliceZone
    wrapper="main"
    :slices="page?.data.slices ?? []"
    :components="components"
  />
</template>
