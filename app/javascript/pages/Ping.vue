<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'

const { data, isLoading, error } = useQuery({
  queryKey: ['ping'],
  queryFn: () => fetch('/api/ping').then(res => res.json())
})
</script>

<template>
  <div>
    <p v-if="isLoading">Loading...</p>
    <p v-else-if="error">Error: {{ error.message }}</p>
    <p v-else>Backend status: {{ data?.status }} at {{ data?.timestamp }}</p>
  </div>
</template>
