<script setup>
import ParentLayout from '@vuepress/theme-default/layouts/Layout.vue';
import ExploreView from '../components/ExploreView.vue';
</script>

<template>
  <ParentLayout>
    <template #page>
      <ExploreView />
    </template>
  </ParentLayout>
</template>
