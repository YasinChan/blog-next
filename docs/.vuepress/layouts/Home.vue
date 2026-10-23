<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import ParentLayout from '@vuepress/theme-default/layouts/Layout.vue';
import { useRoute, useRouter } from 'vuepress/client';
import ExploreView from '../components/ExploreView.vue';
import SpaceTitle from '../components/SpaceTitle.vue';
import SharedThemeToggle from '../components/SharedThemeToggle.vue';

const HOME_TITLE = 'YasinChan · 轨道手记';
const EXPLORE_TITLE = 'Explore | YasinChan · 轨道手记';
const TITLE_TRANSITION =
  'transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.25s ease';

const heroRef = ref(null);
const route = useRoute();
const router = useRouter();
const initialExplore = route.query.view === 'explore';
const leaving = ref(false);
const exploreOpen = ref(false);
const homeVisible = ref(!initialExplore);
const exploreListView = ref(false);
const explorePanelOpen = ref(false);
const exploreBloom = ref(false);
const exploreReverse = ref(false);
const closing = ref(false);
const titleBusy = ref(false);
const titleClip = ref('none');
let titleClipTimer = 0;
const reducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const sharedTitleStyle = ref({
  opacity: 0,
  transform: 'translate(0, 0) scale(1)',
  transition: 'none',
});
let exploreTimer = 0;
let exploreTargetRect = null;


const setDocumentTitle = (title) => {
  if (typeof document !== 'undefined') document.title = title;
};

const resetTilt = () => {
  if (!heroRef.value) return;
  heroRef.value.style.setProperty('--tilt-x', '0deg');
  heroRef.value.style.setProperty('--tilt-y', '0deg');
};

const onMove = (e) => {
  if (!heroRef.value) return;
  const { clientX, clientY } = e;
  const nx = clientX / window.innerWidth - 0.5;
  const ny = clientY / window.innerHeight - 0.5;
  heroRef.value.style.setProperty('--tilt-x', `${-ny * 3}deg`);
  heroRef.value.style.setProperty('--tilt-y', `${nx * 3.5}deg`);
};


const getHomeTitleRect = () => {
  const el = heroRef.value?.querySelector('.hero__name');
  const content = heroRef.value?.querySelector('.hero__content');
  if (!el || !content) return null;

  const prevTransition = content.style.transition;
  content.style.transition = 'none';
  resetTilt();
  void content.offsetHeight;
  const rect = el.getBoundingClientRect();
  content.style.transition = prevTransition;
  return rect;
};

const getExploreTitleRect = () => {
  const el = document.querySelector(
    '.explore-overlay .orbit-core__body strong',
  );
  return el?.getBoundingClientRect() ?? null;
};

const moveTitleHome = (animate) => {
  const home = getHomeTitleRect();
  if (!home) return;

  sharedTitleStyle.value = {
    opacity: 1,
    transform: `translate(${home.left}px, ${home.top}px) scale(1)`,
    clipPath: titleClip.value,
    transition: animate ? TITLE_TRANSITION : 'none',
  };
};

const moveTitleExplore = (animate, targetOverride = null) => {
  const home = getHomeTitleRect();
  const target = targetOverride || getExploreTitleRect();
  if (!home || !target || !home.width) return;

  exploreTargetRect = target;
  const scale = target.width / home.width;
  sharedTitleStyle.value = {
    opacity: 1,
    transform: `translate(${target.left}px, ${target.top}px) scale(${scale})`,
    clipPath: titleClip.value,
    transition: animate ? TITLE_TRANSITION : 'none',
  };
};

const hideSharedTitle = () => {
  sharedTitleStyle.value = {
    ...sharedTitleStyle.value,
    opacity: 0,
    transition: 'opacity 0.2s ease',
  };
};

const updateTitleClip = (delay = 0) => {
  window.clearTimeout(titleClipTimer);

  if (delay) {
    titleClipTimer = window.setTimeout(() => updateTitleClip(0), delay);
    return;
  }

  if (!explorePanelOpen.value) {
    titleClip.value = 'none';
    sharedTitleStyle.value = {
      ...sharedTitleStyle.value,
      clipPath: titleClip.value,
    };
    return;
  }

  const panel = document.querySelector('.explore-overlay .panel');
  const title = document.querySelector('.space-title');

  if (!panel || !title) {
    titleClip.value = 'none';
  } else {
    const rect = title.getBoundingClientRect();
    const panelLeft = window.innerWidth - panel.offsetWidth;
    const visible = Math.max(
      0,
      Math.min(1, (panelLeft - rect.left) / Math.max(rect.width, 1)),
    );
    titleClip.value =
      visible >= 1
        ? 'none'
        : `inset(0 ${((1 - visible) * 100).toFixed(2)}% 0 0)`;
  }

  sharedTitleStyle.value = {
    ...sharedTitleStyle.value,
    clipPath: titleClip.value,
  };
};

const syncSharedTitle = (animate = false) => {
  if (!heroRef.value) return;

  if (!exploreOpen.value || closing.value) {
    moveTitleHome(animate);
    return;
  }

  moveTitleExplore(animate);
};

const onExploreState = (state) => {
  exploreListView.value = state.view === 'list';
  const wasPanelOpen = explorePanelOpen.value;
  explorePanelOpen.value = Boolean(state.panel);
  if (titleBusy.value || closing.value || !exploreOpen.value) return;
  syncSharedTitle(false);

  if (explorePanelOpen.value && !wasPanelOpen) {
    nextTick(() => updateTitleClip());
  } else if (!explorePanelOpen.value && wasPanelOpen) {
    // Keep the clip while the panel slides out, then reveal the title fully.
    updateTitleClip(420);
  }
};

const openExplore = async (animate = true, updateUrl = true) => {
  if (exploreOpen.value) return;

  const isMobile = window.matchMedia('(max-width: 767px)').matches;
  const animateDesktop = animate && !reducedMotion && !isMobile;

  titleBusy.value = true;
  closing.value = false;
  exploreOpen.value = true;
  homeVisible.value = true;
  leaving.value = false;
  exploreBloom.value = false;
  exploreReverse.value = false;
  exploreListView.value = isMobile;
  explorePanelOpen.value = false;

  if (updateUrl) {
    await router.push({
      path: '/',
      query: { ...route.query, view: 'explore' },
    });
  }

  await nextTick();

  if (!animate || reducedMotion) {
    homeVisible.value = false;
    if (isMobile) {
      hideSharedTitle();
    } else {
      moveTitleExplore(false);
    }
    setDocumentTitle(EXPLORE_TITLE);
    titleBusy.value = false;
    return;
  }

  if (isMobile) {
    hideSharedTitle();
    leaving.value = true;
    exploreTimer = window.setTimeout(() => {
      homeVisible.value = false;
      setDocumentTitle(EXPLORE_TITLE);
      titleBusy.value = false;
    }, 360);
    return;
  }

  const home = getHomeTitleRect();
  const target = getExploreTitleRect();

  if (!home || !target || !home.width) {
    homeVisible.value = false;
    moveTitleExplore(false);
    setDocumentTitle(EXPLORE_TITLE);
    titleBusy.value = false;
    return;
  }

  exploreTargetRect = target;
  moveTitleHome(false);
  exploreBloom.value = true;
  leaving.value = true;
  setDocumentTitle(EXPLORE_TITLE);

  window.requestAnimationFrame(() => {
    moveTitleExplore(true, exploreTargetRect);
  });

  exploreTimer = window.setTimeout(() => {
    homeVisible.value = false;
    titleBusy.value = false;
    // Keep bloom on so individual node/ring entrance animations do not restart.
    syncSharedTitle(false);
  }, 820);
};

const closeExplore = async (updateUrl = true) => {
  if (!exploreOpen.value || closing.value) return;

  window.clearTimeout(exploreTimer);
  closing.value = true;
  titleBusy.value = true;
  exploreReverse.value = true;
  exploreListView.value = false;
  explorePanelOpen.value = false;
  titleClip.value = 'none';
  homeVisible.value = true;
  leaving.value = true;

  await nextTick();
  moveTitleHome(true);
  setDocumentTitle(HOME_TITLE);

  if (updateUrl && route.query.view) {
    void router.push({ path: '/', query: {} });
  }

  // Let the orbit fold for a beat before the home links and buttons return.
  window.setTimeout(() => {
    leaving.value = false;
  }, 300);

  window.setTimeout(() => {
    exploreOpen.value = false;
    exploreReverse.value = false;
    closing.value = false;
    titleBusy.value = false;
    homeVisible.value = true;
    leaving.value = false;
    moveTitleHome(false);
  }, 820);
};

const goExplore = (event) => {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();

  if (leaving.value || exploreOpen.value) return;
  void openExplore(true, true);
};

watch(
  () => route.query.view,
  (view) => {
    if (view === 'explore' && !exploreOpen.value) {
      void openExplore(true, false);
    } else if (view !== 'explore' && exploreOpen.value && !closing.value) {
      closeExplore(false);
    }
  },
);

const onResize = () => {
  if (titleBusy.value || closing.value) return;
  syncSharedTitle(false);
  if (explorePanelOpen.value) nextTick(() => updateTitleClip());
};

onMounted(() => {
  document.documentElement.classList.add('home-lock');
  window.addEventListener('mousemove', onMove);
  window.addEventListener('resize', onResize);
  document.documentElement.addEventListener('mouseleave', resetTilt);

  nextTick(() => {
    if (initialExplore) {
      void openExplore(false, false);
    } else {
      moveTitleHome(false);
    }
  });
});

onUnmounted(() => {
  document.documentElement.classList.remove('home-lock');
  window.removeEventListener('mousemove', onMove);
  window.removeEventListener('resize', onResize);
  document.documentElement.removeEventListener('mouseleave', resetTilt);
  window.clearTimeout(exploreTimer);
  window.clearTimeout(titleClipTimer);
});
</script>

<template>
  <ParentLayout>
    <template #page>
      <main
        ref="heroRef"
        class="hero"
        :class="{ 'is-leaving': leaving, 'is-hidden': !homeVisible }"
      >
        <div class="hero__content">
          <h1 class="hero__name" data-text="YasinChan">YasinChan</h1>

          <div class="hero__links">
            <a
              href="https://github.com/yasinchan"
              target="_blank"
              rel="noopener"
              class="hero__link"
              aria-label="GitHub"
            >
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="currentColor"
              >
                <path
                  d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1-.02-1.97-3.2.7-3.87-1.54-3.87-1.54-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.24 3.34.95.1-.74.4-1.24.72-1.53-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.16 1.18a10.96 10.96 0 0 1 5.76 0c2.2-1.49 3.16-1.18 3.16-1.18.62 1.58.23 2.75.11 3.04.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.13 0 1.54-.01 2.78-.01 3.16 0 .31.21.68.8.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z"
                />
              </svg>
              <span>GitHub</span>
            </a>

            <a
              href="https://typing.yasinchan.com"
              target="_blank"
              rel="noopener"
              class="hero__link"
              aria-label="Typing"
            >
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <rect x="2" y="6" width="20" height="13" rx="2" />
                <path
                  d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10"
                  stroke-linecap="round"
                />
              </svg>
              <span>Typing</span>
            </a>
          </div>

          <a
            href="/explore/"
            class="hero__enter"
            @click="goExplore"
            @pointerenter="preloadExplore"
            @focus="preloadExplore"
          >
            <span>EXPLORE</span>
            <svg
              viewBox="0 0 24 24"
              width="22"
              height="22"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                d="M5 12h14M13 5l7 7-7 7"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </a>
        </div>
      </main>

      <SpaceTitle :style="sharedTitleStyle" />
      <SharedThemeToggle />

      <div v-if="exploreOpen" class="explore-overlay">
        <ExploreView
          embedded
          hide-title
          :bloom="exploreBloom"
          :reverse="exploreReverse"
          @state="onExploreState"
          @close="closeExplore()"
        />
      </div>
    </template>
  </ParentLayout>
</template>

<style lang="scss">
html.home-lock,
html.home-lock body {
  overflow: hidden;
}

.explore-overlay {
  position: fixed;
  inset: 0;
  z-index: 1;
  overflow: hidden;
}

.explore-overlay > .explore {
  width: 100vw;
  min-height: 100vh;
  margin-left: 0;
}

/* The panel is a modal; keep the shared title out of its way. */
html:has(.explore-overlay .explore[data-view='list']) .space-title {
  opacity: 0 !important;
  transition: opacity 0.2s ease;
}

.home-page {
  .vp-page,
  .page,
  .theme-default-content {
    max-width: none !important;
    padding: 0 !important;
    margin: 0 !important;
    background: transparent !important;
  }
}

.hero.is-hidden {
  visibility: hidden;
  pointer-events: none;
}

.hero {
  --tilt-x: 0deg;
  --tilt-y: 0deg;

  position: relative;
  z-index: 2;
  perspective: 1400px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  min-height: 100vh;
  overflow: hidden;
  background: transparent;
}

.hero__theme-toggle {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  z-index: 3;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  padding: 0;
  border-radius: 50%;
  border: 1px solid rgba(127, 127, 127, 0.18);
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: saturate(180%) blur(10px);
  -webkit-backdrop-filter: saturate(180%) blur(10px);
  color: var(--vp-c-text-mute, #6b7280);
  cursor: pointer;
  transition:
    color 0.25s ease,
    border-color 0.25s ease,
    transform 0.4s ease,
    box-shadow 0.25s ease,
    translate 0.4s cubic-bezier(0.2, 0.8, 0.2, 1),
    rotate 0.4s cubic-bezier(0.2, 0.8, 0.2, 1),
    opacity 0.35s ease;

  &:hover {
    color: #a78bfa;
    border-color: rgba(167, 139, 250, 0.5);
    transform: rotate(20deg);
    box-shadow: 0 8px 24px -10px rgba(167, 139, 250, 0.5);
  }
}

html[data-theme='dark'] .hero__theme-toggle {
  background: rgba(28, 28, 32, 0.55);
  border-color: rgba(255, 255, 255, 0.1);
  color: #c4b5fd;

  &:hover {
    color: #ddd6fe;
    border-color: rgba(196, 181, 253, 0.55);
  }
}

.hero__content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 0 1.5rem;
  transform: rotateX(var(--tilt-x)) rotateY(var(--tilt-y));
  transform-style: preserve-3d;
  transition:
    transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1),
    translate 0.35s cubic-bezier(0.2, 0.8, 0.2, 1),
    scale 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.hero.is-leaving {
  pointer-events: none;

  .hero__name {
    transform: translateZ(0);
    translate: var(--morph-x, 0px) var(--morph-y, 0px);
    scale: var(--morph-scale, 1);
  }

  .hero__links {
    translate: 0 60vh;
    opacity: 0;
  }

  .hero__enter {
    translate: 0 70vh;
    opacity: 0;
  }

  .hero__theme-toggle {
    translate: 0 -10vh;
    rotate: -90deg;
    opacity: 0;
  }
}


.hero__name {
  position: relative;
  margin: 0;
  font-size: clamp(3.5rem, 12vw, 9rem);
  font-weight: 900;
  letter-spacing: -0.04em;
  line-height: 1;
  background: linear-gradient(120deg, #6ee7ff 0%, #a78bfa 45%, #f472b6 100%);
  background-size: 100% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  opacity: 0;
  transform: none;
  pointer-events: none;
}

.hero__name::after {
  content: attr(data-text);
  position: absolute;
  inset: 0;
  background: inherit;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  filter: blur(28px);
  opacity: 0.6;
  z-index: -1;
}

.hero__links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
  margin: 2rem 0 2.75rem;
  transform: translateZ(18px);
  transition:
    translate 0.5s cubic-bezier(0.2, 0.8, 0.2, 1),
    opacity 0.45s ease;
}

.hero__link {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.55rem 1rem;
  border-radius: 999px;
  font-size: 0.9rem;
  font-weight: 500;
  text-decoration: none !important;
  color: var(--vp-c-text-mute, #6b7280);
  background: rgba(127, 127, 127, 0.06);
  border: 1px solid rgba(127, 127, 127, 0.18);
  backdrop-filter: blur(6px);
  transition: color 0.25s ease, border-color 0.25s ease, background 0.25s ease,
    transform 0.25s ease;

  svg {
    transition: transform 0.25s ease;
  }

  &:hover {
    color: var(--vp-c-text, #111);
    border-color: rgba(167, 139, 250, 0.55);
    background: rgba(167, 139, 250, 0.08);
    transform: translateY(-2px);

    svg {
      transform: scale(1.1);
    }
  }
}

.hero__enter {
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.95rem 2rem;
  border-radius: 999px;
  font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto,
    sans-serif;
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  text-decoration: none !important;
  color: var(--vp-c-text, #1f2937);
  background: var(--vp-c-bg, #fff);
  border: 1px solid rgba(127, 127, 127, 0.25);
  backdrop-filter: blur(8px);
  transform: translateZ(9px);
  transition:
    transform 0.3s ease,
    translate 0.5s cubic-bezier(0.2, 0.8, 0.2, 1),
    opacity 0.45s ease,
    box-shadow 0.3s ease,
    border-color 0.3s ease;

  svg {
    transition: transform 0.3s ease;
  }

  &:hover {
    transform: translateZ(9px) translateY(-2px);
    border-color: transparent;
    box-shadow: 0 0 0 1px rgba(167, 139, 250, 0.5),
      0 10px 40px -10px rgba(167, 139, 250, 0.6);

    svg {
      transform: translateX(6px);
    }
  }
}

@media (max-width: 767px) {
  .hero.is-leaving .hero__content {
    translate: 0 -1.4rem;
    scale: 0.98;
  }

  .hero.is-leaving .hero__name {
    transform: translateZ(32px);
    translate: 0;
    scale: 1;
  }

  .hero.is-leaving .hero__links,
  .hero.is-leaving .hero__enter {
    translate: 0;
    scale: 1;
  }

  .hero.is-leaving .hero__theme-toggle {
    translate: 0;
    rotate: 0deg;
  }
}

@media (prefers-reduced-motion: reduce), (hover: none) {
  .hero__content,
  .hero__name,
  .hero__links,
  .hero__enter {
    transform: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero__name {
    animation: none;
  }
}
</style>
