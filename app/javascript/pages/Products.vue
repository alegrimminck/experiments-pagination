<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'

const page = ref(1)

const { data, isLoading, error } = useQuery({
  queryKey: ['products', page],
  queryFn: () => fetch(`/api/products?page=${page.value}`).then(res => res.json())
})

const products = computed(() => data.value?.products ?? [])
const meta = computed(() => data.value?.meta ?? { current_page: 1, total_pages: 1, total_count: 0 })
const hasPrev = computed(() => meta.value.current_page > 1)
const hasNext = computed(() => meta.value.current_page < meta.value.total_pages)

function prevPage() {
  if (hasPrev.value) page.value -= 1
}
function nextPage() {
  if (hasNext.value) page.value += 1
}
</script>

<template>
  <div>
    <p v-if="isLoading">Loading...</p>
    <p v-else-if="error">Error: {{ error?.message }}</p>
    <template v-else>
      <ul>
        <li v-for="product in products" :key="product.id">
          <strong>{{ product.name }}</strong> — {{ product.description }} ({{ product.price }})
        </li>
      </ul>
      <p v-if="!products.length">No products.</p>
      <nav>
        <button type="button" :disabled="!hasPrev" @click="prevPage">Previous</button>
        <span>Page {{ meta.current_page }} of {{ meta.total_pages }} ({{ meta.total_count }} total)</span>
        <button type="button" :disabled="!hasNext" @click="nextPage">Next</button>
      </nav>
    </template>
  </div>
</template>
