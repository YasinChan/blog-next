<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import ParentLayout from '@vuepress/theme-default/layouts/Layout.vue';

const heroRef = ref(null);
const isDark = ref(false);

const onMove = (e) => {
  if (!heroRef.value) return;
  const { clientX, clientY } = e;
  const x = (clientX / window.innerWidth - 0.5) * 30;
  const y = (clientY / window.innerHeight - 0.5) * 30;
  heroRef.value.style.setProperty('--mx', `${x}px`);
  heroRef.value.style.setProperty('--my', `${y}px`);
};

const applyTheme = (dark) => {
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  try {
    localStorage.setItem('vuepress-color-scheme', dark ? 'dark' : 'light');
  } catch {}
};

const toggleTheme = () => {
  isDark.value = !isDark.value;
  applyTheme(isDark.value);
};

onMounted(() => {
  window.addEventListener('mousemove', onMove);

  // Sync initial state with theme storage
  const stored = (() => {
    try {
      return localStorage.getItem('vuepress-color-scheme');
    } catch {
      return null;
    }
  })();
  if (stored === 'dark' || stored === 'light') {
    isDark.value = stored === 'dark';
  } else {
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
});
onUnmounted(() => {
  window.removeEventListener('mousemove', onMove);
});
</script>

<template>
  <ParentLayout>
    <template #page>
      <main ref="heroRef" class="hero">
        <button
          class="hero__theme-toggle"
          type="button"
          :aria-label="isDark ? '切换到日间模式' : '切换到夜间模式'"
          @click="toggleTheme"
        >
          <svg v-if="!isDark" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
          </svg>
          <svg v-else viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        </button>

        <div class="hero__bg">
          <span class="blob blob--a" />
          <span class="blob blob--b" />
          <span class="blob blob--c" />
        </div>

        <div class="hero__grid" />

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

          <a href="/post/" class="hero__enter">
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
    </template>
  </ParentLayout>
</template>

<style lang="scss">
.home-page {
  .vp-page,
  .page,
  .theme-default-content {
    max-width: none !important;
    padding: 0 !important;
    margin: 0 !important;
  }
}

.hero {
  --mx: 0px;
  --my: 0px;

  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  min-height: 100vh;
  overflow: hidden;
  background: var(--vp-c-bg, #fff);
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
    box-shadow 0.25s ease;

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

.hero__bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  filter: blur(80px);
  pointer-events: none;
}

.blob {
  position: absolute;
  display: block;
  border-radius: 50%;
  opacity: 0.55;
  mix-blend-mode: screen;
  transform: translate(var(--mx), var(--my));
  transition: transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
  will-change: transform;
}

.blob--a {
  top: -10%;
  left: -5%;
  width: 50vw;
  height: 50vw;
  background: radial-gradient(circle, #6ee7ff 0%, transparent 60%);
  animation: float-a 14s ease-in-out infinite;
}

.blob--b {
  top: 20%;
  right: -10%;
  width: 55vw;
  height: 55vw;
  background: radial-gradient(circle, #a78bfa 0%, transparent 60%);
  animation: float-b 18s ease-in-out infinite;
}

.blob--c {
  bottom: -15%;
  left: 20%;
  width: 60vw;
  height: 60vw;
  background: radial-gradient(circle, #f472b6 0%, transparent 60%);
  animation: float-c 22s ease-in-out infinite;
}

html[data-theme='dark'] .blob {
  opacity: 0.4;
}

.hero__grid {
  position: absolute;
  inset: 0;
  z-index: 1;
  background-image: linear-gradient(
      to right,
      rgba(127, 127, 127, 0.08) 1px,
      transparent 1px
    ),
    linear-gradient(to bottom, rgba(127, 127, 127, 0.08) 1px, transparent 1px);
  background-size: 56px 56px;
  mask-image: radial-gradient(ellipse at center, #000 30%, transparent 75%);
  -webkit-mask-image: radial-gradient(
    ellipse at center,
    #000 30%,
    transparent 75%
  );
  pointer-events: none;
}

.hero__content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 0 1.5rem;
}

.hero__name {
  position: relative;
  margin: 0;
  font-size: clamp(3.5rem, 12vw, 9rem);
  font-weight: 900;
  letter-spacing: -0.04em;
  line-height: 1;
  background: linear-gradient(120deg, #6ee7ff 0%, #a78bfa 45%, #f472b6 100%);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: shine 6s ease-in-out infinite;
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
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;

  svg {
    transition: transform 0.3s ease;
  }

  &:hover {
    transform: translateY(-2px);
    border-color: transparent;
    box-shadow: 0 0 0 1px rgba(167, 139, 250, 0.5),
      0 10px 40px -10px rgba(167, 139, 250, 0.6);

    svg {
      transform: translateX(6px);
    }
  }
}

@keyframes shine {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

@keyframes float-a {
  0%,
  100% {
    transform: translate(var(--mx), var(--my)) scale(1);
  }
  50% {
    transform: translate(calc(var(--mx) + 4vw), calc(var(--my) + 3vw))
      scale(1.15);
  }
}

@keyframes float-b {
  0%,
  100% {
    transform: translate(var(--mx), var(--my)) scale(1.05);
  }
  50% {
    transform: translate(calc(var(--mx) - 5vw), calc(var(--my) + 4vw))
      scale(0.95);
  }
}

@keyframes float-c {
  0%,
  100% {
    transform: translate(var(--mx), var(--my)) scale(0.95);
  }
  50% {
    transform: translate(calc(var(--mx) + 3vw), calc(var(--my) - 4vw))
      scale(1.1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .blob,
  .hero__name {
    animation: none;
  }
}
</style>
