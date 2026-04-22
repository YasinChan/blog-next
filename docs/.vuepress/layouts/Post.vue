<script setup>
import { computed } from 'vue'
import { useBlogType } from '@vuepress/plugin-blog/client'
import ParentLayout from '@vuepress/theme-default/layouts/Layout.vue'
import ArticleList from '../components/ArticleList.vue'

const articles = useBlogType('post')
const count = computed(() => articles.value?.items?.length ?? 0)
</script>

<template>
  <ParentLayout>
    <template #page>
      <main class="page post-page">
        <header class="post-header">
          <span class="post-header__eyebrow">— BLOG</span>
          <h1 class="post-header__title">
            <span data-text="Posts">Posts</span>
          </h1>
          <p class="post-header__meta">
            共 <strong>{{ count }}</strong> 篇文章 · 记录技术与生活
          </p>
        </header>

        <ArticleList :items="articles.items" />
      </main>
    </template>
  </ParentLayout>
</template>

<style lang="scss">
.post-page {
  padding-top: 40px;
}

.post-header {
  text-align: center;
  margin: 0 auto 3rem;
  padding: 0 1.5rem;
}

.post-header__eyebrow {
  display: inline-block;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.4em;
  color: var(--vp-c-text-mute, #6b7280);
  margin-bottom: 0.75rem;
}

.post-header__title {
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
    animation: post-shine 6s ease-in-out infinite;
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

.post-header__meta {
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

@keyframes post-shine {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .post-header__title > span {
    animation: none;
  }
}
</style>
