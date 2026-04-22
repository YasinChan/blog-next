<script setup>
import { computed } from 'vue'
import { useBlogCategory } from '@vuepress/plugin-blog/client'
import ParentLayout from '@vuepress/theme-default/layouts/Layout.vue'
import { RouteLink, useRoute } from 'vuepress/client'
import ArticleList from '../components/ArticleList.vue'

const route = useRoute()
const tagMap = useBlogCategory('tags')

const tagCount = computed(() => Object.keys(tagMap.value?.map ?? {}).length)
</script>

<template>
  <ParentLayout>
    <template #page>
      <main class="page tags-page">
        <header class="tags-header">
          <span class="tags-header__eyebrow">— TAGS</span>
          <h1 class="tags-header__title">
            <span data-text="Tags">Tags</span>
          </h1>
          <p class="tags-header__meta">
            共 <strong>{{ tagCount }}</strong> 个标签
          </p>
        </header>

        <div class="tag-cloud">
          <RouteLink
            v-for="({ items, path }, name) in tagMap.map"
            :key="name"
            :to="path"
            :active="route.path === path"
            class="tag-cloud__item"
          >
            <span class="tag-cloud__name">#{{ name }}</span>
            <span class="tag-cloud__num">{{ items.length }}</span>
          </RouteLink>
        </div>

        <ArticleList :items="tagMap.currentItems ?? []" />
      </main>
    </template>
  </ParentLayout>
</template>

<style lang="scss">
.tags-page {
  padding-top: calc(var(--navbar-height, 3.6rem) + 2.5rem);
}

.tags-header {
  text-align: center;
  margin: 0 auto 2rem;
  padding: 0 1.5rem;
}

.tags-header__eyebrow {
  display: inline-block;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.4em;
  color: var(--vp-c-text-mute, #6b7280);
  margin-bottom: 0.75rem;
}

.tags-header__title {
  position: relative;
  margin: 0;
  font-size: clamp(2.5rem, 7vw, 4.5rem);
  font-weight: 900;
  letter-spacing: -0.03em;
  line-height: 1;

  > span {
    position: relative;
    background: linear-gradient(120deg, #6ee7ff 0%, #a78bfa 50%, #f472b6 100%);
    background-size: 200% 200%;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    animation: tags-shine 6s ease-in-out infinite;
  }

  > span::after {
    content: attr(data-text);
    position: absolute;
    inset: 0;
    background: inherit;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    filter: blur(20px);
    opacity: 0.55;
    z-index: -1;
  }
}

.tags-header__meta {
  margin: 1rem 0 0;
  font-size: 0.95rem;
  color: var(--vp-c-text-mute, #6b7280);
  letter-spacing: 0.05em;

  strong {
    color: var(--vp-c-text, #1f2937);
    font-weight: 700;
    margin: 0 0.15em;
  }
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.6rem;
  max-width: 760px;
  margin: 0 auto 3rem;
  padding: 0 1.5rem;
}

.tag-cloud__item {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.45rem 0.95rem;
  border-radius: 999px;
  font-size: 0.88rem;
  font-weight: 500;
  color: var(--vp-c-text-mute, #6b7280) !important;
  background: rgba(127, 127, 127, 0.06);
  border: 1px solid rgba(127, 127, 127, 0.18);
  text-decoration: none !important;
  transition:
    color 0.25s ease,
    background 0.25s ease,
    border-color 0.25s ease,
    transform 0.25s ease;

  &:hover {
    color: var(--vp-c-text, #111) !important;
    border-color: rgba(167, 139, 250, 0.5);
    background: rgba(167, 139, 250, 0.08);
    transform: translateY(-2px);
  }

  &.route-link-active {
    color: #fff !important;
    border-color: transparent;
    background: linear-gradient(120deg, #6ee7ff 0%, #a78bfa 50%, #f472b6 100%);
    box-shadow: 0 8px 24px -8px rgba(167, 139, 250, 0.6);

    .tag-cloud__num {
      background: rgba(255, 255, 255, 0.25);
      color: #fff;
    }
  }
}

.tag-cloud__num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.3rem;
  height: 1.3rem;
  padding: 0 0.4rem;
  border-radius: 999px;
  background: rgba(127, 127, 127, 0.12);
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--vp-c-text-mute, #6b7280);
}

@keyframes tags-shine {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .tags-header__title > span {
    animation: none;
  }
}
</style>
