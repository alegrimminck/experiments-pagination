<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useInfiniteQuery } from '@tanstack/vue-query'

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

const observerCallback = (entries: IntersectionObserverEntry[]) => {
  if (entries[0]?.isIntersecting && !isFetchingNextPage.value && hasNextPage.value) {
    fetchNextPage()
  }
}

watch(
  [rootRef, sentinelRef],
  ([root, sentinel]) => {
    if (!root || !sentinel) return
    const options: IntersectionObserverInit = {
      root,
      rootMargin: '0px',
      threshold: 0
    }
    const observer = new IntersectionObserver(observerCallback, options)
    observer.observe(sentinel)
    return () => observer.disconnect()
  },
  { flush: 'post' }
)
</script>

<template>
  <div>
    <p v-if="isLoading">Loading...</p>
    <p v-else-if="error">Error: {{ error?.message }}</p>
    <template v-else-if="data">
      <div ref="rootRef" class="list-wrapper">
        <ul class="list">
          <li
            v-for="product in products"
            :key="product.id"
            class="list-item"
          >
            <strong>{{ product.name }}</strong> — {{ product.description }}
            ({{ product.price }})
          </li>
          <li ref="sentinelRef" class="sentinel">
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

.list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.list-item {
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}

.sentinel {
  padding: 1rem;
  text-align: center;
  color: #666;
}
</style>
