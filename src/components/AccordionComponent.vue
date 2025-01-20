<template>
  <Accordion v-if="filters" :value="[]" multiple>
    <AccordionPanel
        v-for="filter in filters"
        :key="filter._id"
        :value="filter._id"
    >
      <AccordionHeader>
        <div class="header-container">
          {{ filter.name.ru }} / {{ filter.name.uk }}
          <Button
              type="button"
              icon="pi pi-ellipsis-v"
              @click.stop="(event) => toggle(event, filter)"
              aria-haspopup="true"
              aria-controls="overlay_menu"
          />
        </div>
      </AccordionHeader>
      <AccordionContent>
        <p v-if="!filter.children || filter.children.length === 0" class="m-0">
          No child filters available.
        </p>
        <AccordionComponent v-else :filters="filter.children" @handlePopover="provideEvent"/>
      </AccordionContent>
    </AccordionPanel>
  </Accordion>
</template>

<script setup>
const props = defineProps({
  filters: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['handlePopover'])

const toggle = (event, filter) => {
  emit('handlePopover', event, filter)
};

const provideEvent = (event, filter) => {
  emit('handlePopover', event, filter)
};
</script>

<style scoped>
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.options-button {
  margin-left: auto;
}
</style>