<template>
  <span class="space-title" data-text="YasinChan" aria-hidden="true">
    YasinChan
  </span>
</template>

<style lang="scss">
.space-title {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 5;
  display: block;
  margin: 0;
  font-size: clamp(3.5rem, 12vw, 9rem);
  font-weight: 900;
  letter-spacing: -0.04em;
  line-height: 1;
  white-space: nowrap;
  background: linear-gradient(120deg, #6ee7ff 0%, #a78bfa 45%, #f472b6 100%);
  background-size: 100% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  transform-origin: top left;
  pointer-events: none;
  will-change: transform, opacity;
}

.space-title::after {
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
  pointer-events: none;
}
</style>
