<script setup>
import { computed } from 'vue'
import { useBlogType } from '@vuepress/plugin-blog/client'
import ParentLayout from '@vuepress/theme-default/layouts/Layout.vue'
import { useRouter } from 'vuepress/client'

const router = useRouter()
const timelines = useBlogType('archives')

const groups = computed(() => {
  const items = timelines.value?.items ?? []
  const map = new Map()
  for (const item of items) {
    const year = new Date(item.info.date).getFullYear()
    if (!map.has(year)) map.set(year, [])
    map.get(year).push({
      date: item.info.date,
      title: item.info.title,
      path: item.path,
    })
  }
  return [...map.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([year, list]) => ({
      year,
      list: list.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      ),
    }))
})

const totalCount = computed(() =>
  groups.value.reduce((s, g) => s + g.list.length, 0),
)
</script>

<template>
  <ParentLayout>
    <template #page>
      <main class="page archives-page">
        <header class="archives-header">
          <span class="archives-header__eyebrow">— ARCHIVES</span>
          <h1 class="archives-header__title">
            <span data-text="Archives">Archives</span>
          </h1>
          <p class="archives-header__meta">
            共 <strong>{{ totalCount }}</strong> 篇文章 ·
            <strong>{{ groups.length }}</strong> 个年份
          </p>
        </header>

        <div class="timeline">
          <section
            v-for="group in groups"
            :key="group.year"
            class="timeline__group"
          >
            <div class="timeline__year">
              <span class="timeline__year-num">{{ group.year }}</span>
              <span class="timeline__year-count">{{ group.list.length }} posts</span>
            </div>

            <ul class="timeline__list">
              <li
                v-for="item in group.list"
                :key="item.path"
                class="timeline__item"
                @click="router.push(item.path)"
              >
                <span class="timeline__dot" />
                <time class="timeline__date">
                  {{ new Date(item.date).toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }) }}
                </time>
                <span class="timeline__title">{{ item.title }}</span>
                <span class="timeline__arrow" aria-hidden="true">→</span>
              </li>
            </ul>
          </section>
        </div>
      </main>
    </template>
  </ParentLayout>
</template>

<style lang="scss">
.archives-page {
  padding-top: calc(var(--navbar-height, 3.6rem) + 2.5rem);
  padding-bottom: 4rem;
}

.archives-header {
  text-align: center;
  margin: 0 auto 3rem;
  padding: 0 1.5rem;
}

.archives-header__eyebrow {
  display: inline-block;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.4em;
  color: var(--vp-c-text-mute, #6b7280);
  margin-bottom: 0.75rem;
}

.archives-header__title {
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
    animation: archives-shine 6s ease-in-out infinite;
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

.archives-header__meta {
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

.timeline {
  max-width: 720px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.timeline__group {
  margin-bottom: 3rem;
}

.timeline__year {
  display: flex;
  align-items: baseline;
  gap: 0.8rem;
  padding-bottom: 1rem;
  margin-bottom: 0.5rem;
  border-bottom: 1px dashed rgba(127, 127, 127, 0.25);
}

.timeline__year-num {
  font-size: clamp(2rem, 4vw, 2.8rem);
  font-weight: 900;
  letter-spacing: -0.02em;
  background: linear-gradient(120deg, #a78bfa, #f472b6);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.timeline__year-count {
  font-size: 0.78rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  color: var(--vp-c-text-mute, #6b7280);
  text-transform: uppercase;
}

.timeline__list {
  list-style: none;
  padding: 0;
  margin: 0;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0.6rem;
    bottom: 0.6rem;
    left: 5px;
    width: 1px;
    background: linear-gradient(to bottom, transparent, rgba(167, 139, 250, 0.35), transparent);
  }
}

.timeline__item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.7rem 0.5rem 0.7rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  color: var(--vp-c-text, inherit);
  transition:
    background 0.25s ease,
    transform 0.25s ease;

  &:hover {
    background: rgba(167, 139, 250, 0.06);
    transform: translateX(4px);

    .timeline__dot {
      transform: scale(1.4);
      box-shadow: 0 0 0 4px rgba(167, 139, 250, 0.18);
    }

    .timeline__title {
      color: transparent;
      background: linear-gradient(90deg, #a78bfa, #f472b6);
      -webkit-background-clip: text;
      background-clip: text;
    }

    .timeline__arrow {
      opacity: 1;
      transform: translateX(0);
    }
  }
}

.timeline__dot {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: var(--vp-c-bg, #fff);
  border: 2px solid #a78bfa;
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

.timeline__date {
  flex-shrink: 0;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.85rem;
  color: var(--vp-c-text-mute, #6b7280);
  letter-spacing: 0.02em;
}

.timeline__title {
  flex: 1;
  font-size: 1rem;
  font-weight: 500;
  transition: color 0.25s ease;

  @media (max-width: 419px) {
    font-size: 0.95rem;
  }
}

.timeline__arrow {
  flex-shrink: 0;
  font-size: 1.1rem;
  color: #a78bfa;
  opacity: 0;
  transform: translateX(-6px);
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

@keyframes archives-shine {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .archives-header__title > span {
    animation: none;
  }
}
</style>
