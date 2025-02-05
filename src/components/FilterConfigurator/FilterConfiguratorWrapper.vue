<template>
  <div class="additional__actions"></div>
  <FilterConfiguratorTable @filters-updated="emit('filters-updated')" :filters="filters"></FilterConfiguratorTable>
  <div class="footer__blocks"></div>
</template>

<script setup>

defineProps({
  filters: {
    type: Array,
    required: true,
  }
})
const emit = defineEmits(['filters-updated'])

</script>

<style scoped>

</style>
