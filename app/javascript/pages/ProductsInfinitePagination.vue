<script setup lang="ts">
import { computed, ref } from 'vue'
import { useInfiniteQuery } from '@tanstack/vue-query'
import { useIntersectionObserver } from '@vueuse/core'

const rootRef = ref<HTMLElement | null>(null)
const sentinelRef = ref<HTMLElement | null>(null)

const {
  data,
  isLoading,
  error,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage
} = useInfiniteQuery({
  queryKey: ['products', 'infinite'],
  queryFn: ({ pageParam }) =>
    fetch(`/api/products?page=${pageParam}`).then((res) => res.json()),
  initialPageParam: 1,
  getNextPageParam: (lastPage) => {
    const meta = lastPage?.meta ?? {}
    if (meta.current_page < meta.total_pages) {
      return meta.current_page + 1
    }
    return undefined
  }
})

const products = computed(
  () => data.value?.pages.flatMap((p) => p.products ?? []) ?? []
)
const totalCount = computed(
  () => data.value?.pages[0]?.meta?.total_count ?? 0
)

useIntersectionObserver(
  sentinelRef,
  ([entry]) => {
    if (entry?.isIntersecting && !isFetchingNextPage.value && hasNextPage.value) {
      fetchNextPage()
    }
  },
  {
    root: rootRef,
    rootMargin: '0px',
    threshold: 0
  }
)
</script>

<template>
  <div>
    <p v-if="isLoading">Loading...</p>
    <p v-else-if="error">Error: {{ error?.message }}</p>
    <template v-else-if="data">
      <div ref="rootRef" class="list-wrapper">
        <ul>
          <li
            v-for="product in products"
            :key="product.id"
          >
            <strong>{{ product.name }}</strong> — {{ product.description }}
            ({{ product.price }})
          </li>
          <li ref="sentinelRef">
            <span v-if="isFetchingNextPage">Loading more…</span>
            <span v-else-if="hasNextPage">Load more</span>
            <span v-else>{{ products.length }} of {{ totalCount }} loaded</span>
          </li>
        </ul>
      </div>
    </template>
  </div>
</template>

<style scoped>
.list-wrapper {
  max-height: 70vh;
  overflow-y: auto;
}

</style>
