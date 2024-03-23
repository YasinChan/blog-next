<script setup>
import { reactive, computed } from 'vue';
import { useBlogType } from '@vuepress/plugin-blog/client'
import ParentLayout from '@vuepress/theme-default/layouts/Layout.vue'

const state = reactive({
  items: []
})

const timelines = useBlogType('archives');

const items = timelines.value?.items || [];

items.forEach(item => {
  const year = new Date(item.info.date).getFullYear();
  if (state.items[state.items.length - 1]?.[year]) {
    state.items[state.items.length - 1][year].push({
      date: item.info.date,
      title: item.info.title,
      path: item.path
    })
  } else {
    state.items.push({
      [year]: [
        {
          date: item.info.date,
          title: item.info.title,
          path: item.path
        }
      ]
    })
  }
});

</script>

<template>
  <ParentLayout>
    <template #page>
      <main class="page archives">
        <template v-for="item in state.items">
          <div class="archives-year">{{ Object.keys(item)[0] }}</div>
          <ul>
            <li v-for="i in Object.values(item)[0]" @click="$router.push(i.path)">
              <span class="archives-date">{{ new Date(i.date).toLocaleDateString() }}</span>
              <span class="archives-title">{{ i.title }}</span>
            </li>
          </ul>
        </template>
      </main>
    </template>
  </ParentLayout>
</template>

<style lang="scss">
@use '@vuepress/theme-default/styles/mixins';

.archives {
  @include mixins.content_wrapper;
  margin-top: 60px;
}
.archives-year {
  font-size: 18px;
  font-weight: bold;
  margin-top: 10px;
  margin-bottom: 10px;
}
.archives-date {
  margin-right: 10px;
}
.archives-title {
  color: var(--c-brand);
  cursor: pointer;
}
</style>
