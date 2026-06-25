<template>
  <v-img
    v-if="showImage"
    :src="src"
    :height="height"
    :cover="cover"
    :alt="alt"
    loading="lazy"
    @error="hasError = true"
  >
    <slot />
  </v-img>

  <div
    v-else
    class="product-image-placeholder"
    :class="{ 'product-image-placeholder--compact': compact }"
    :style="placeholderStyle"
    role="img"
    :aria-label="alt || 'Foto do bolo em breve'"
  >
    <v-icon :size="iconSize" color="primary" class="placeholder-icon">
      mdi-cake-variant-outline
    </v-icon>
    <span v-if="showLabel" class="placeholder-label">Foto em breve</span>
    <slot />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  src: {
    type: String,
    default: null,
  },
  alt: {
    type: String,
    default: '',
  },
  height: {
    type: [Number, String],
    default: 200,
  },
  cover: {
    type: Boolean,
    default: true,
  },
  showLabel: {
    type: Boolean,
    default: true,
  },
  compact: {
    type: Boolean,
    default: false,
  },
  iconSize: {
    type: [Number, String],
    default: 48,
  },
})

const hasError = ref(false)

const showImage = computed(() => Boolean(props.src) && !hasError.value)

const placeholderStyle = computed(() => {
  const height =
    typeof props.height === 'number' ? `${props.height}px` : props.height || '200px'

  return { minHeight: height, height }
})
</script>

<style scoped>
.product-image-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  background: linear-gradient(145deg, #fdf2f8 0%, #f5ebe8 100%);
  border-bottom: 1px solid rgba(196, 137, 138, 0.15);
}

.product-image-placeholder--compact {
  border-bottom: none;
  border-radius: inherit;
}

.placeholder-icon {
  opacity: 0.45;
}

.placeholder-label {
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-text-muted);
}
</style>
