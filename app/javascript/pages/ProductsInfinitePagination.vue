<script setup lang="ts">
import { computed, ref } from 'vue'
import { useInfiniteQuery } from '@tanstack/vue-query'
import { useIntersectionObserver } from '@vueuse/core'

const rootRef = ref<HTMLElement | null>(null)
const sentinelRef = ref<HTMLElement | null>(null)

const {
  data,
  error,
  hasNextPage,
} = useInfiniteQuery({
  queryKey: ['products'],
  queryFn: ({pageParam}) => {
    fetch(`/api/products?page=${pageParam}`).then(res => res.json())
  },
  initialPageParam: 1,
  getNextPageParam: ((lastPage) => {
    const meta = lastPage?.meta ?? {}
    if (meta.current_page < meta.total_pages) {
      return meta.current_page += 1
    }
    return undefined
  })
})

console.log(data)

</script>

<template>

  <div
    v-if="true"
  >
    AQUI
    <ul>
      <li
        v-for="product in data.value?.pages"
      >
        asd
      </li>
    </ul>
  </div>
  
</template>

<style scoped>


</style>
