<template>
  <div class="additional__actions"></div>
  <FilterConfiguratorTable v-if="filters.length" :filters="filters"></FilterConfiguratorTable>
  <div class="footer__blocks"></div>
</template>

<script setup>

defineProps({
  filters: {
    type: Array,
    required: true,
  }
})

</script>

<style scoped>

</style>
