<template>
  <footer class="app-footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-brand">
          <span class="logo-text">inove.<span>ai</span></span>
        </div>
        <p class="copyright">
          © {{ currentYear }} inove.ai. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
.app-footer {
  background-color: var(--color-surface);
  border-top: 1px solid var(--color-outline-variant);
  padding: var(--spacing-lg) 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.footer-brand {
  display: flex;
  align-items: center;
}

.logo-text {
  color: white;
  font-family: var(--font-family);
  font-size: 1.25rem; /* Made smaller */
  font-weight: 700;
}

.logo-text span {
  font-weight: 200;
}

.copyright {
  color: var(--color-text-secondary);
  font-size: var(--font-size-body-small);
  margin: 0;
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    justify-content: center;
    text-align: center;
  }
}
</style>

