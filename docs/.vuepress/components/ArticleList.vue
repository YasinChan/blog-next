<script setup>
import { computed } from 'vue'

const props = defineProps({
  /** Article items */
  items: {
    type: Array,
    required: true,
  },
  /** Whether is timeline or not */
  isTimeline: Boolean,
})

const articles = computed(() =>
  props.items.map(({ info, path }) => ({
    info,
    path,
    formattedDate: info.date ? new Date(info.date).toLocaleDateString() : '',
    tags: Array.isArray(info.tag) ? info.tag : [],
  })),
)
</script>

<template>
  <div class="article-wrapper">
    <div v-if="!items.length" class="empty">Nothing in here.</div>

    <article
      v-for="({ info, path, formattedDate, tags }, idx) in articles"
      :key="path"
      class="article"
      :style="{ '--i': idx }"
      @click="$router.push(path)"
    >
      <span class="article__accent" />

      <div class="article__head">
        <span v-if="formattedDate" class="article__date">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path d="M3 9h18M8 3v4M16 3v4" stroke-linecap="round" />
          </svg>
          {{ formattedDate }}
        </span>
        <span class="article__arrow" aria-hidden="true">→</span>
      </div>

      <h2 class="article__title">{{ info.title }}</h2>

      <div v-if="info.excerpt" class="article__excerpt" v-html="info.excerpt" />

      <div v-if="tags.length" class="article__tags">
        <span v-for="t in tags" :key="t" class="tag-chip">#{{ t }}</span>
      </div>
    </article>
  </div>
</template>

<style lang="scss">
@use '@vuepress/theme-default/styles/mixins';

.article-wrapper {
  @include mixins.content_wrapper;
}

.empty {
  text-align: center;
  color: var(--vp-c-text-mute, #888);
  padding: 4rem 0;
}

.article {
  --i: 0;

  position: relative;
  box-sizing: border-box;
  width: 100%;
  margin: 0 0 1.5rem;
  padding: 1.5rem 1.75rem;
  border-radius: 16px;
  background: var(--vp-c-bg-alt, rgba(127, 127, 127, 0.04));
  border: 1px solid rgba(127, 127, 127, 0.12);
  cursor: pointer;
  overflow: hidden;
  transition:
    transform 0.3s ease,
    border-color 0.3s ease,
    box-shadow 0.3s ease,
    background 0.3s ease;
  animation: fadeUp 0.5s ease both;
  animation-delay: calc(var(--i) * 60ms);

  @media (max-width: 419px) {
    padding: 1.2rem 1rem;
    border-radius: 12px;
  }

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(135deg, #6ee7ff, #a78bfa, #f472b6);
    -webkit-mask:
      linear-gradient(#000 0 0) content-box,
      linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-3px);
    border-color: transparent;
    box-shadow: 0 14px 40px -18px rgba(167, 139, 250, 0.45);

    &::before {
      opacity: 1;
    }

    .article__accent {
      opacity: 1;
      transform: scaleY(1);
    }

    .article__title {
      background-position: 100% 50%;
    }

    .article__arrow {
      opacity: 1;
      transform: translateX(0);
    }
  }
}

.article__accent {
  position: absolute;
  top: 1.5rem;
  bottom: 1.5rem;
  left: 0;
  width: 3px;
  border-radius: 0 3px 3px 0;
  background: linear-gradient(to bottom, #6ee7ff, #a78bfa, #f472b6);
  opacity: 0;
  transform: scaleY(0.4);
  transform-origin: center;
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.article__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.6rem;
}

.article__date {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.78rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  color: var(--vp-c-text-mute, #6b7280);
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  background: rgba(127, 127, 127, 0.08);

  svg {
    opacity: 0.7;
  }
}

.article__arrow {
  font-size: 1.25rem;
  color: var(--vp-c-text-mute, #6b7280);
  opacity: 0;
  transform: translateX(-6px);
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.article__title {
  margin: 0 0 0.6rem;
  font-size: 1.45rem;
  line-height: 1.35;
  font-weight: 700;
  color: var(--vp-c-text, inherit);
  background: linear-gradient(90deg, var(--vp-c-text, #1f2937) 0%, var(--vp-c-text, #1f2937) 50%, #a78bfa 75%, #f472b6 100%);
  background-size: 200% 100%;
  background-position: 0% 50%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  transition: background-position 0.5s ease;

  @media (max-width: 419px) {
    font-size: 1.2rem;
  }
}

.article__excerpt {
  font-size: 0.95rem;
  line-height: 1.65;
  color: var(--vp-c-text-mute, #6b7280);
  margin-bottom: 1rem;

  h1 {
    display: none;
  }

  h2 {
    font-size: 1rem;
    font-weight: 600;
    margin: 0.5rem 0 0.25rem;
    color: inherit;
  }

  h3 {
    font-size: 0.95rem;
    font-weight: 600;
    margin: 0.5rem 0 0.25rem;
    color: inherit;
  }

  p {
    margin: 0.4rem 0;
  }

  > :last-child {
    margin-bottom: 0;
  }
}

.article__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.tag-chip {
  display: inline-block;
  padding: 0.2rem 0.65rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--vp-c-text-mute, #6b7280);
  background: rgba(127, 127, 127, 0.08);
  border: 1px solid rgba(127, 127, 127, 0.12);
  transition:
    color 0.25s ease,
    background 0.25s ease,
    border-color 0.25s ease;
}

.article:hover .tag-chip {
  color: #a78bfa;
  background: rgba(167, 139, 250, 0.08);
  border-color: rgba(167, 139, 250, 0.3);
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .article {
    animation: none;
  }
}
</style>
