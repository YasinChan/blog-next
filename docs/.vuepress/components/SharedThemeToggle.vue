<script setup>
import { useDarkMode } from '@vuepress/theme-default/client';

const isDark = useDarkMode();

const toggleTheme = () => {
  isDark.value = !isDark.value;
};
</script>

<template>
  <button
    class="shared-theme-toggle"
    type="button"
    :aria-label="isDark ? '切换到日间模式' : '切换到夜间模式'"
    @click="toggleTheme"
  >
    <svg
      v-if="!isDark"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path
        d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
      />
    </svg>
    <svg
      v-else
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  </button>
</template>

<style lang="scss">
.shared-theme-toggle {
  position: fixed;
  top: 1.35rem;
  right: 1.5rem;
  z-index: 7;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  -webkit-appearance: none;
  appearance: none;
  font-family: inherit;
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
    opacity 0.25s ease;

  &:hover {
    color: #a78bfa;
    border-color: rgba(167, 139, 250, 0.5);
    transform: rotate(20deg);
    box-shadow: 0 8px 24px -10px rgba(167, 139, 250, 0.5);
  }
}

@media (width <= 767px) {
  .shared-theme-toggle {
    top: 1rem;
  }
}

html[data-theme='dark'] .shared-theme-toggle {
  background: rgba(28, 28, 32, 0.55);
  border-color: rgba(255, 255, 255, 0.1);
  color: #c4b5fd;

  &:hover {
    color: #ddd6fe;
    border-color: rgba(196, 181, 253, 0.55);
  }
}

/* The side panel owns the right edge while open. */
html:has(.panel) .shared-theme-toggle {
  opacity: 0;
  pointer-events: none;
}
</style>
