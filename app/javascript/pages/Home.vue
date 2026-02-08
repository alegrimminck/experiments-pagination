<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <h1>Hello World</h1>
  <nav>
    <button type="button" @click="router.push('/products/pagination')">
      Products (pagination)
    </button>
    <button type="button" @click="router.push('/products/infinite')">
      Products (infinite scroll)
    </button>
  </nav>
</template>
