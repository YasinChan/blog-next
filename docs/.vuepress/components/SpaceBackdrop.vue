<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute } from 'vuepress/client';
import HeroParticles from './HeroParticles.vue';

const route = useRoute();
const backdropRef = ref(null);

// Keep the same particle field alive across home ↔ explore, so the background
// never cuts, flashes, or changes colour during the transition.
const active = computed(
  () => route.path === '/' || route.path.startsWith('/explore'),
);

const onPointerMove = (event) => {
  if (!backdropRef.value) return;
  const x = (event.clientX / window.innerWidth - 0.5) * 30;
  const y = (event.clientY / window.innerHeight - 0.5) * 30;
  backdropRef.value.style.setProperty('--mx', `${x}px`);
  backdropRef.value.style.setProperty('--my', `${y}px`);
};

const resetPointer = () => {
  if (!backdropRef.value) return;
  backdropRef.value.style.setProperty('--mx', '0px');
  backdropRef.value.style.setProperty('--my', '0px');
};

onMounted(() => {
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  document.documentElement.addEventListener('pointerleave', resetPointer);
});

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', onPointerMove);
  document.documentElement.removeEventListener('pointerleave', resetPointer);
});
</script>

<template>
  <div
    v-if="active"
    ref="backdropRef"
    class="space-backdrop"
    aria-hidden="true"
  >
    <div class="space-blobs">
      <span class="space-blob space-blob--a" />
      <span class="space-blob space-blob--b" />
      <span class="space-blob space-blob--c" />
    </div>
    <div class="space-grid" />
    <HeroParticles :density="0.8" />
  </div>
</template>

<style lang="scss">
.space-backdrop {
  --mx: 0px;
  --my: 0px;

  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  background: var(--vp-c-bg, #fff);
  transform: translate3d(0, 0, 0);
  will-change: transform;
  pointer-events: none;
}

.space-blobs {
  position: absolute;
  inset: 0;
  z-index: 0;
  filter: blur(80px);
  pointer-events: none;
}

.space-blob {
  position: absolute;
  display: block;
  border-radius: 50%;
  opacity: 0.55;
  mix-blend-mode: screen;
  transform: translate(var(--mx), var(--my));
  will-change: transform;
}

.space-blob--a {
  top: -10%;
  left: -5%;
  width: 50vw;
  height: 50vw;
  background: radial-gradient(circle, #6ee7ff 0%, transparent 60%);
  animation: space-float-a 14s ease-in-out infinite;
}

.space-blob--b {
  top: 20%;
  right: -10%;
  width: 55vw;
  height: 55vw;
  background: radial-gradient(circle, #a78bfa 0%, transparent 60%);
  animation: space-float-b 18s ease-in-out infinite;
}

.space-blob--c {
  bottom: -15%;
  left: 20%;
  width: 60vw;
  height: 60vw;
  background: radial-gradient(circle, #f472b6 0%, transparent 60%);
  animation: space-float-c 22s ease-in-out infinite;
}

html[data-theme='dark'] .space-blob {
  opacity: 0.4;
}

.space-grid {
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

.space-backdrop .hero-particles {
  position: absolute;
  inset: 0;
  z-index: 2;
  width: 100%;
  height: 100%;
}

@keyframes space-float-a {
  0%,
  100% {
    transform: translate(var(--mx), var(--my)) scale(1);
  }
  50% {
    transform: translate(calc(var(--mx) + 4vw), calc(var(--my) + 3vw))
      scale(1.15);
  }
}

@keyframes space-float-b {
  0%,
  100% {
    transform: translate(var(--mx), var(--my)) scale(1.05);
  }
  50% {
    transform: translate(calc(var(--mx) - 5vw), calc(var(--my) + 4vw))
      scale(0.95);
  }
}

@keyframes space-float-c {
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
  .space-blob {
    animation: none;
  }
}
</style>
