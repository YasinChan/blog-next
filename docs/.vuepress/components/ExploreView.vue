<script setup>
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from 'vue';
import { useBlogType } from '@vuepress/plugin-blog/client';
import { useRoute } from 'vuepress/client';
import ExploreIcon from '../components/ExploreIcon.vue';
import SharedThemeToggle from '../components/SharedThemeToggle.vue';

const props = defineProps({
  embedded: Boolean,
  hideTitle: Boolean,
  bloom: Boolean,
  reverse: Boolean,
});
const emit = defineEmits(['close', 'state']);

const onBackHome = (event) => {
  if (!props.embedded) return;
  event.preventDefault();
  emit('close');
};

// Content for the Explore page lives in these blocks — edit freely.
const BASE_SECTIONS = [
  {
    key: 'writing',
    label: '写作',
    en: 'WRITING',
    sub: '笔记与踩坑记录',
  },
  {
    key: 'work',
    label: '工作',
    en: 'WORK',
    sub: 'AI 应用 · 前端',
  },
  {
    key: 'projects',
    label: '项目',
    en: 'PROJECTS',
    sub: '开源与个人作品',
  },
  {
    key: 'about',
    label: '关于',
    en: 'ABOUT',
    sub: '9 年研发轨迹',
  },
  {
    key: 'now',
    label: '现在',
    en: 'NOW',
    sub: '最近在忙什么',
  },
  {
    key: 'connect',
    label: '连接',
    en: 'CONNECT',
    sub: '邮箱、GitHub 和友链',
  },
];

const PROJECTS = [
  {
    name: 'Typing',
    tag: 'Vue · Vite · Koa2',
    desc: '一个打字练习网站，Vue + Vite + Koa2 + MySQL，60+ star。',
    url: 'https://typing.yasinchan.com',
  },
  {
    name: 'Quick Meet / 快见',
    tag: '小程序 · 工具',
    desc: '和朋友聚会时，快速找到一个大家都方便的地点。',
    url: 'https://qm.yasinchan.com',
  },
  {
    name: 'slate-canvas',
    tag: 'Canvas · 编辑器',
    desc: '基于 Canvas 渲染的 Slate 富文本编辑器。',
    url: 'https://github.com/YasinChan/slate-canvas',
  },
  {
    name: 'vue-verification-input',
    tag: 'Vue · 组件',
    desc: '短信验证码输入框，也可以自定义成别的样式。',
    url: 'https://github.com/YasinChan/vue-verification-input',
  },
  {
    name: 'vue-simple-lazyload',
    tag: 'Vue · 指令',
    desc: '一个简易的图片懒加载指令，带加载动效。',
    url: 'https://github.com/YasinChan/vue-simple-lazyload',
  },
  {
    name: 'vuepress-theme-inherit',
    tag: 'VuePress · 主题',
    desc: '继承自 default theme 的 VuePress 博客主题，支持归档和标签。',
    url: 'https://github.com/YasinChan/vuepress-theme-inherit',
  },
];

const WORK = [
  {
    time: '2025.10 — 现在',
    company: '心动',
    role: '研发工程师 · AI 应用方向',
  },
  {
    time: '2024.04 — 2025.09',
    company: '领健医疗',
    role: '资深前端开发工程师',
  },
  {
    time: '2018.10 — 2024.01',
    company: 'TapTap',
    role: '前端开发工程师',
  },
  {
    time: '2017.07 — 2018.10',
    company: '意派科技',
    role: '前端开发工程师',
  },
];

const CAREER = [
  {
    time: '2025.10 — 现在',
    company: '心动',
    role: '研发工程师 · AI 应用方向',
    url: 'https://www.xd.com/',
  },
  {
    time: '2024.04 — 2025.09',
    company: '领健医疗',
    role: '资深前端开发工程师',
    url: 'https://www.linkedcare.cn/',
  },
  {
    time: '2018.10 — 2024.01',
    company: 'TapTap',
    role: '前端开发工程师',
    url: 'https://taptap.cn',
  },
  {
    time: '2017.07 — 2018.10',
    company: '意派科技',
    role: '前端开发工程师',
    url: 'https://www.epub360.com/',
  },
];

const SKILLS = [
  'LLM 应用开发',
  'AI Agent',
  'MCP',
  'Function Calling',
  '上下文压缩',
  'Prompt Cache',
  '成本治理',
  '多模态',
  '联网检索',
  '向量召回',
  '评测与回归',
  'TypeScript',
  'Node.js',
  'Vue 3',
  '微前端',
];

const NOW_UPDATED = '2026.10';

const NOW_ITEMS = [
  {
    label: 'WORK',
    title: 'AI Agent 平台',
    desc: '在心动做 AI Agent 平台。',
  },
  {
    label: 'BUILD',
    title: 'Typing / 这个博客',
    desc: '维护 Typing（Vue + Vite + Koa2 + MySQL，60+ star），也在重做这个博客的 3D 探索页。',
  },
  {
    label: 'FOCUS',
    title: '上下文工程与成本',
    desc: '最近在关注上下文压缩、Prompt Cache、Agent 评测，以及 AI 原生开发工作流。',
  },
];

const CONNECT_LINKS = [
  {
    label: 'GitHub',
    value: 'github.com/yasinchan',
    href: 'https://github.com/yasinchan',
  },
  {
    label: 'Typing',
    value: 'typing.yasinchan.com',
    href: 'https://typing.yasinchan.com',
  },
  {
    label: 'Quick Meet',
    value: 'qm.yasinchan.com',
    href: 'https://qm.yasinchan.com',
  },
  {
    label: '友链 / solarhell',
    value: 'solarhell.com',
    href: 'https://solarhell.com/',
  },
  {
    label: '友链 / 拉云',
    value: 'kalacloud.com',
    href: 'https://kalacloud.com/',
  },
];

const route = useRoute();

const viewMode = ref('orbit');
const activeKey = ref(null);

const postsData = useBlogType('post');
const posts = computed(() => {
  const items = postsData.value?.items ?? [];

  return items
    .map(({ info, path }) => {
      const parsed = info.date ? new Date(info.date) : null;
      const valid = parsed && !Number.isNaN(parsed.getTime());

      return {
        title: info.title || 'Untitled',
        path,
        tags: Array.isArray(info.tag) ? info.tag : [],
        year: valid ? parsed.getUTCFullYear() : '更早',
        day: valid
          ? `${String(parsed.getUTCMonth() + 1).padStart(2, '0')}.${String(
              parsed.getUTCDate(),
            ).padStart(2, '0')}`
          : '',
        timestamp: valid ? parsed.getTime() : 0,
      };
    })
    .sort((a, b) => b.timestamp - a.timestamp);
});

const postCount = computed(() => posts.value.length);
const postsByYear = computed(() => {
  const groups = new Map();

  for (const post of posts.value) {
    if (!groups.has(post.year)) groups.set(post.year, []);
    groups.get(post.year).push(post);
  }

  return [...groups.entries()].sort((a, b) => {
    const left = typeof a[0] === 'number' ? a[0] : 0;
    const right = typeof b[0] === 'number' ? b[0] : 0;
    return right - left;
  });
});
const postYears = computed(() => {
  const years = posts.value
    .map(({ year }) => year)
    .filter((year) => typeof year === 'number');

  if (!years.length) return '—';
  return `${Math.min(...years)}—${Math.max(...years)}`;
});

const sections = computed(() =>
  BASE_SECTIONS.map((section) =>
    section.key === 'writing'
      ? { ...section, sub: `${postCount.value} 篇笔记` }
      : section,
  ),
);

const activeSection = computed(
  () => sections.value.find(({ key }) => key === activeKey.value) ?? null,
);
const panelOpen = computed(() => Boolean(activeSection.value));
const closeButton = ref(null);
const lastTrigger = ref(null);

const activeIndex = computed(() =>
  Math.max(
    1,
    sections.value.findIndex(({ key }) => key === activeKey.value) + 1,
  ),
);

const rotation = ref(-Math.PI / 2);
const sweep = ref(-Math.PI / 2 + 0.18);
const orbitNodes = computed(() =>
  sections.value.map((section, index) => {
    const angle =
      rotation.value + (index * Math.PI * 2) / sections.value.length;
    const depth = (Math.sin(angle) + 1) / 2;

    return {
      ...section,
      angle,
      style: {
        left: `${50 + Math.cos(angle) * 38.5}%`,
        top: `${50 + Math.sin(angle) * 31}%`,
        zIndex: String(12 + Math.round(depth * 10)),
        '--depth': depth.toFixed(3),
        '--scale': (0.9 + depth * 0.14).toFixed(3),
        '--i': index,
      },
    };
  }),
);

const scannerStyle = computed(() => {
  const angle = sweep.value;
  const tangent = Math.atan2(
    31 * Math.cos(angle),
    -38.5 * Math.sin(angle),
  );

  return {
    left: `${50 + Math.cos(angle) * 38.5}%`,
    top: `${50 + Math.sin(angle) * 31}%`,
    '--scan-tangent': `${tangent}rad`,
  };
});

const scannedKey = computed(() => {
  if (reducedMotion || viewMode.value !== 'orbit' || activeKey.value) {
    return null;
  }

  let closest = null;
  let closestDistance = Infinity;

  for (const node of orbitNodes.value) {
    const delta = Math.atan2(
      Math.sin(node.angle - sweep.value),
      Math.cos(node.angle - sweep.value),
    );
    const distance = Math.abs(delta);
    if (distance < closestDistance) {
      closestDistance = distance;
      closest = node.key;
    }
  }

  return closestDistance < 0.3 ? closest : null;
});

const stageRef = ref(null);
const hovered = ref(false);
const dragging = ref(false);
let dragCandidate = false;
let dragStartX = 0;
let dragStartY = 0;
let suppressClick = false;
const reducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let rafId = 0;
let lastFrame = 0;
let velocity = 0;
let dragOrigin = 0;
let lastMoveAt = 0;
let resumeAt = 0;

const openSection = async (key, event) => {
  lastTrigger.value = event?.currentTarget ?? null;
  activeKey.value = key;
  await nextTick();
  closeButton.value?.focus();
};

const closePanel = () => {
  activeKey.value = null;
};

const toggleView = () => {
  viewMode.value = viewMode.value === 'orbit' ? 'list' : 'orbit';
};

const openRandomPost = () => {
  if (!posts.value.length) return;
  const post = posts.value[Math.floor(Math.random() * posts.value.length)];
  window.location.assign(post.path);
};

const onPointerDown = (event) => {
  if (viewMode.value !== 'orbit' || activeKey.value) return;
  if (event.button !== 0) return;

  dragCandidate = true;
  dragStartX = event.clientX;
  dragStartY = event.clientY;
  dragOrigin = event.clientX;
  lastMoveAt = performance.now();
  velocity = 0;
};

const onPointerMove = (event) => {
  if (!dragCandidate) return;

  if (!dragging.value) {
    if (
      Math.abs(event.clientX - dragStartX) < 4 &&
      Math.abs(event.clientY - dragStartY) < 4
    ) {
      return;
    }
    dragging.value = true;
  }

  const now = performance.now();
  const delta = event.clientX - dragOrigin;
  const elapsed = Math.max(0.008, (now - lastMoveAt) / 1000);

  dragOrigin = event.clientX;
  lastMoveAt = now;
  rotation.value += delta * 0.0045;
  velocity = Math.max(-2.2, Math.min(2.2, (delta * 0.0045) / elapsed));
};

const onPointerUp = () => {
  dragCandidate = false;
  if (!dragging.value) return;

  dragging.value = false;
  resumeAt = performance.now() + 2200;
  suppressClick = true;
  window.setTimeout(() => {
    suppressClick = false;
  }, 80);
};

const onSceneClickCapture = (event) => {
  if (!suppressClick) return;
  event.preventDefault();
  event.stopPropagation();
  suppressClick = false;
};

const onKeydown = (event) => {
  if (event.key === 'Escape' && activeKey.value) closePanel();
};

const tick = (now) => {
  const dt = Math.min((now - (lastFrame || now)) / 1000, 0.05);
  lastFrame = now;

  if (!reducedMotion && viewMode.value === 'orbit' && !activeKey.value) {
    sweep.value += 0.38 * dt;
  }

  if (!dragging.value && !document.hidden) {
    if (!reducedMotion && Math.abs(velocity) > 0.001) {
      rotation.value += velocity * dt;
      velocity *= Math.exp(-2.4 * dt);
    } else if (!reducedMotion) {
      velocity = 0;
      const focusInside = stageRef.value?.contains(document.activeElement);
      const canAuto =
        viewMode.value === 'orbit' &&
        !hovered.value &&
        !focusInside &&
        !activeKey.value &&
        now > resumeAt;

      if (canAuto) rotation.value += 0.035 * dt;
    }
  }

  rafId = requestAnimationFrame(tick);
};

watch(
  activeKey,
  async (key) => {
    if (typeof document === 'undefined') return;

    document.body.style.overflow = key ? 'hidden' : '';

    if (!key) {
      await nextTick();
      lastTrigger.value?.focus?.();
      lastTrigger.value = null;
    }
  },
);


const updateScrollLock = () => {
  if (typeof document === 'undefined') return;
  const lock =
    viewMode.value === 'orbit' &&
    window.matchMedia('(min-width: 768px)').matches;
  document.documentElement.classList.toggle('explore-orbit-lock', lock);
};

watch(viewMode, updateScrollLock);

watch([viewMode, activeKey], () => {
  emit('state', { view: viewMode.value, panel: !!activeKey.value });
});

onMounted(() => {
  rafId = requestAnimationFrame(tick);
  updateScrollLock();
  emit('state', { view: viewMode.value, panel: !!activeKey.value });
  window.addEventListener('resize', updateScrollLock);

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerup', onPointerUp);
  window.addEventListener('pointercancel', onPointerUp);
  window.addEventListener('keydown', onKeydown);

  // Query state is applied after hydration so static HTML and the client
  // render exactly the same tree first.
  if (route.query.view === 'list') {
    viewMode.value = 'list';
  }

  if (
    typeof route.query.section === 'string' &&
    BASE_SECTIONS.some(({ key }) => key === route.query.section)
  ) {
    activeKey.value = route.query.section;
    document.body.style.overflow = 'hidden';
    nextTick(() => closeButton.value?.focus());
  }

});

onBeforeUnmount(() => {
  cancelAnimationFrame(rafId);
  document.documentElement.classList.remove('explore-orbit-lock');
  window.removeEventListener('resize', updateScrollLock);
  window.removeEventListener('pointermove', onPointerMove);
  window.removeEventListener('pointerup', onPointerUp);
  window.removeEventListener('pointercancel', onPointerUp);
  window.removeEventListener('keydown', onKeydown);

  if (typeof document !== 'undefined') {
    document.body.style.overflow = '';
  }
});
</script>

<template>
  <SharedThemeToggle v-if="!embedded" />

  <main
        class="explore"
        :data-view="viewMode"
        :class="{
          'is-panel-open': panelOpen,
          'hide-title': props.hideTitle,
          bloom: props.bloom,
          reverse: props.reverse,
        }"
      >
        <h1 class="sr-only">Explore — YasinChan 的个人站点</h1>

        <div
          class="explore__scene"
          :inert="panelOpen"
          :class="{ 'is-dragging': dragging }"
          @pointerdown="onPointerDown"
          @click.capture="onSceneClickCapture"
          @dragstart.prevent
        >
          <header class="explore__header">
            <a href="/" class="explore__brand">
              <span class="explore__mark">YC</span>
              <span class="explore__brand-text">
                <strong>YasinChan</strong>
                <small>AI APPLICATION</small>
              </span>
            </a>

            <div class="explore__actions">

              <button
                class="view-toggle"
                type="button"
                @click="toggleView"
              >
                <ExploreIcon :name="viewMode === 'orbit' ? 'grid' : 'orbit'" />
                <span>{{ viewMode === 'orbit' ? '列表' : '轨道' }}</span>
              </button>
              <a href="/" class="back-home" @click="onBackHome">← 返回首页</a>
            </div>
          </header>

          <div class="explore__main">
            <div class="orbit-wrap">
              <div
                ref="stageRef"
                class="orbit-stage"
                @pointerenter="hovered = true"
                @pointerleave="hovered = false"
              >
                <svg
                  class="orbit-rings"
                  viewBox="0 0 1000 620"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient
                      id="explore-ring"
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="1"
                    >
                      <stop offset="0%" stop-color="#6ee7ff" stop-opacity=".7" />
                      <stop offset="48%" stop-color="#a78bfa" stop-opacity=".34" />
                      <stop offset="100%" stop-color="#f472b6" stop-opacity=".6" />
                    </linearGradient>
                  </defs>
                  <ellipse
                    cx="500"
                    cy="310"
                    rx="385"
                    ry="192"
                    fill="none"
                    stroke="url(#explore-ring)"
                    stroke-width="1.3"
                  />
                  <ellipse
                    cx="500"
                    cy="310"
                    rx="292"
                    ry="146"
                    fill="none"
                    stroke="url(#explore-ring)"
                    stroke-width="1"
                    stroke-dasharray="3 9"
                    opacity=".55"
                  />
                  <ellipse
                    cx="500"
                    cy="310"
                    rx="462"
                    ry="231"
                    fill="none"
                    stroke="url(#explore-ring)"
                    stroke-width="1"
                    stroke-dasharray="1 13"
                    opacity=".28"
                  />
                </svg>

                <span
                  v-if="!reducedMotion"
                  class="orbit-scanner"
                  :style="scannerStyle"
                  aria-hidden="true"
                >
                  <span class="orbit-scanner__trail" />
                  <span class="orbit-scanner__dot" />
                </span>

                <button
                  class="orbit-core"
                  type="button"
                  aria-label="查看关于 YasinChan"
                  @click="openSection('about', $event)"
                >
                  <span class="orbit-core__halo" aria-hidden="true" />
                  <span class="orbit-core__ring" aria-hidden="true" />
                  <span class="orbit-core__body">
                    <span class="orbit-core__eyebrow">
                      AI APPLICATION
                    </span>
                    <strong data-text="YasinChan">YasinChan</strong>
                    <span class="orbit-core__sub">
                      把 AI 落到业务里，也做点好玩的东西
                    </span>
                    <span class="orbit-core__meta">
                      9 YEARS&nbsp;&nbsp;·&nbsp;&nbsp;4 COMPANIES&nbsp;&nbsp;·&nbsp;&nbsp;{{
                        String(sections.length).padStart(2, '0')
                      }}
                      SECTORS
                    </span>
                  </span>
                </button>

                <button
                  v-for="(node, index) in orbitNodes"
                  :key="node.key"
                  class="orbit-node"
                  :class="{
                    'is-active': activeKey === node.key,
                    'is-scanned': scannedKey === node.key,
                  }"
                  type="button"
                  :style="node.style"
                  :aria-label="`进入${node.label}`"
                  @click="openSection(node.key, $event)"
                >
                  <span class="orbit-node__inner">
                    <span class="orbit-node__icon">
                      <ExploreIcon :name="node.key" />
                    </span>
                    <span class="orbit-node__text">
                      <span class="orbit-node__en">
                        <b class="orbit-node__index">0{{ index + 1 }}</b>
                        {{ node.en }}
                      </span>
                      <span class="orbit-node__label">{{ node.label }}</span>
                    </span>
                  </span>
                </button>
              </div>
            </div>

            <div class="list-wrap">
              <div class="list-head">
                <div>
                  <span class="eyebrow">EXPLORE / INDEX</span>
                  <h2>选择要去的地方</h2>
                </div>
                <span class="list-count">{{ String(sections.length).padStart(2, '0') }} SECTORS</span>
              </div>

              <div class="list-grid">
                <button
                  v-for="(section, index) in sections"
                  :key="section.key"
                  class="section-card"
                  type="button"
                  :style="{ '--i': index }"
                  @click="openSection(section.key, $event)"
                >
                  <span class="section-card__top">
                    <span class="section-card__index">0{{ index + 1 }}</span>
                    <span class="section-card__icon">
                      <ExploreIcon :name="section.key" />
                    </span>
                  </span>
                  <span class="section-card__en">{{ section.en }}</span>
                  <strong>{{ section.label }}</strong>
                  <span class="section-card__sub">{{ section.sub }}</span>
                  <span class="section-card__arrow">→</span>
                </button>
              </div>
            </div>
          </div>

          <footer class="explore__footer">
            <span class="footer-hint">
              <span class="hint-dot" />
              {{
                viewMode === 'orbit'
                  ? '拖动页面旋转 · 点击节点进入'
                  : '点击卡片进入'
              }}
            </span>

            <button
              class="footer-random"
              type="button"
              :disabled="!postCount"
              @click="openRandomPost"
            >
              <ExploreIcon name="shuffle" />
              随机翻一篇旧文章
            </button>
          </footer>
        </div>

        <Transition name="panel">
          <div v-if="activeSection" class="panel-layer">
            <div class="panel-backdrop" @click="closePanel" />

            <aside
              class="panel"
              role="dialog"
              aria-modal="true"
              :aria-label="`${activeSection.label} - ${activeSection.en}`"
            >
              <header class="panel__head">
                <div class="panel__heading">
                  <span class="panel__icon">
                    <ExploreIcon :name="activeSection.key" />
                  </span>
                  <div>
                    <span class="panel__eyebrow">
                      {{ activeSection.en }} / {{ String(activeIndex).padStart(2, '0') }}
                    </span>
                    <h1>{{ activeSection.label }}</h1>
                  </div>
                </div>

                <button
                  ref="closeButton"
                  class="panel__close"
                  type="button"
                  aria-label="关闭"
                  @click="closePanel"
                >
                  <ExploreIcon name="close" />
                </button>
              </header>

              <div class="panel__body">
                <div v-if="activeKey === 'writing'" class="pane">
                  <p class="pane__lead">
                    {{ postCount }} 篇笔记，跨度 {{ postYears }}。写得不多，
                    但都是当时认真踩过的坑。
                  </p>

                  <div class="mini-stats">
                    <span>
                      <strong>{{ postCount }}</strong>
                      <small>NOTES</small>
                    </span>
                    <span>
                      <strong>{{ postsByYear.length }}</strong>
                      <small>YEARS</small>
                    </span>
                    <span>
                      <strong>{{ postYears }}</strong>
                      <small>RANGE</small>
                    </span>
                  </div>

                  <div class="writing-list">
                    <section
                      v-for="[year, yearPosts] in postsByYear"
                      :key="year"
                      class="year-block"
                    >
                      <h2>{{ year }}</h2>

                      <a
                        v-for="post in yearPosts"
                        :key="post.path"
                        :href="post.path"
                        class="post-row"
                        @click="closePanel"
                      >
                        <span class="post-row__date">{{ post.day }}</span>
                        <span class="post-row__main">
                          <span class="post-row__title">{{ post.title }}</span>
                          <span
                            v-if="post.tags.length"
                            class="post-row__tags"
                          >
                            {{ post.tags.slice(0, 3).join(' / ') }}
                          </span>
                        </span>
                        <span class="post-row__arrow">↗</span>
                      </a>
                    </section>
                  </div>

                  <a href="/post/" class="pane__more" @click="closePanel">
                    查看全部文章
                    <span>→</span>
                  </a>
                </div>

                <div v-else-if="activeKey === 'work'" class="pane">
                  <p class="pane__lead">
                    9 年研发经验，主要经历如下。
                  </p>

                  <div class="work-list">
                    <article
                      v-for="job in WORK"
                      :key="job.company"
                      class="work-row"
                    >
                      <div class="work-row__head">
                        <span class="work-row__time">{{ job.time }}</span>
                        <strong>{{ job.company }}</strong>
                        <span class="work-row__role">{{ job.role }}</span>
                      </div>
                    </article>
                  </div>

                  <div class="pane__links">
                    <a href="/about/me.html" @click="closePanel">完整关于页 →</a>
                  </div>
                </div>

                <div v-else-if="activeKey === 'projects'" class="pane">
                  <p class="pane__lead">
                    一些自己做来用、或者纯粹想试试的东西。
                  </p>

                  <div class="project-grid">
                    <a
                      v-for="project in PROJECTS"
                      :key="project.name"
                      :href="project.url"
                      class="project-card"
                      target="_blank"
                      rel="noopener"
                    >
                      <span class="project-card__tag">{{ project.tag }}</span>
                      <h2>{{ project.name }}</h2>
                      <p>{{ project.desc }}</p>
                      <span class="project-card__link">打开 ↗</span>
                    </a>
                  </div>

                  <a
                    href="https://github.com/yasinchan"
                    class="pane__more"
                    target="_blank"
                    rel="noopener"
                  >
                    在 GitHub 上看更多
                    <span>→</span>
                  </a>
                </div>

                <div v-else-if="activeKey === 'about'" class="pane">
                  <p class="pane__lead">
                    陈耀耀 / YasinChan，9 年研发经验。现在在心动做
                    AI 应用，也继续写前端。
                  </p>

                  <div class="mini-stats">
                    <span>
                      <strong>9</strong>
                      <small>YEARS</small>
                    </span>
                    <span>
                      <strong>{{ CAREER.length }}</strong>
                      <small>COMPANIES</small>
                    </span>
                    <span>
                      <strong>{{ PROJECTS.length }}</strong>
                      <small>PROJECTS</small>
                    </span>
                  </div>

                  <div class="skill-section">
                    <span class="pane__label">SKILLS</span>
                    <div class="skill-row">
                      <span v-for="skill in SKILLS" :key="skill">
                        {{ skill }}
                      </span>
                    </div>
                  </div>

                  <div class="timeline">
                    <a
                      v-for="job in CAREER"
                      :key="job.company"
                      :href="job.url"
                      class="timeline__item"
                      target="_blank"
                      rel="noopener"
                    >
                      <span class="timeline__time">{{ job.time }}</span>
                      <span class="timeline__body">
                        <strong>{{ job.company }}</strong>
                        <small>{{ job.role }}</small>
                      </span>
                      <span class="timeline__arrow">↗</span>
                    </a>
                  </div>


                  <div class="pane__links">
                    <a href="/about/me.html" @click="closePanel">完整关于页 →</a>
                    <a href="mailto:yasinchan2016@gmail.com">写封邮件</a>
                  </div>
                </div>

                <div v-else-if="activeKey === 'now'" class="pane">
                  <p class="pane__lead">
                    最近在做 AI Agent 平台，也在维护自己的小项目。
                    这个页面会不定期更新。
                  </p>

                  <div class="now-grid">
                    <article
                      v-for="item in NOW_ITEMS"
                      :key="item.label"
                      class="now-card"
                    >
                      <span class="now-card__label">{{ item.label }}</span>
                      <h2>{{ item.title }}</h2>
                      <p>{{ item.desc }}</p>
                    </article>
                  </div>

                  <p class="pane__note">
                    Last synced: {{ NOW_UPDATED }} · 生活比博客更新得快。
                  </p>
                </div>

                <div v-else-if="activeKey === 'connect'" class="pane">
                  <p class="pane__lead">
                    想聊 AI 应用、前端、编辑器、打字工具，或者交换友链，
                    都可以找我。
                  </p>

                  <a
                    class="mail-card"
                    href="mailto:yasinchan2016@gmail.com"
                  >
                    <span class="mail-card__eyebrow">SAY HI</span>
                    <strong>yasinchan2016@gmail.com</strong>
                    <span class="mail-card__hint">写封邮件 ↗</span>
                  </a>

                  <div class="connect-list">
                    <a
                      v-for="link in CONNECT_LINKS"
                      :key="link.label"
                      :href="link.href"
                      class="connect-row"
                      target="_blank"
                      rel="noopener"
                    >
                      <span>{{ link.label }}</span>
                      <strong>{{ link.value }}</strong>
                      <span class="connect-row__arrow">↗</span>
                    </a>
                  </div>

                  <p class="pane__note">
                    欢迎交换友链，邮件里带上你的站点和一句介绍就行。
                  </p>
                </div>
              </div>

              <footer class="panel__foot">
                <span>ESC 关闭</span>
                <span>{{ activeSection.en }} · YASINCHAN</span>
              </footer>
            </aside>
          </div>
        </Transition>
  </main>
</template>
