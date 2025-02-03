<template>
  <div class="dynamic-attrs-block mb-12">
    <Accordion v-if="config.accordion" class="mt-12">
      <AccordionTab :header="config.header || 'Настройки'">
        <div class="p-4">
          <div class="grid gap-6">
            <div
                v-for="(pair, index) in keyValuePairs"
                :key="index"
                class="grid grid-cols-2 gap-6 items-center"
            >
              <InputText
                  v-model="pair.key"
                  :placeholder="config.placeholders.key"
                  class="w-full"
              />
              <InputText
                  v-model="pair.value"
                  :placeholder="config.placeholders.value"
                  class="w-full"
              />
            </div>
          </div>
          <Button
              :label="config.buttonLabel"
              class="mt-3"
              @click="addPair"
              outlined
          />
        </div>
      </AccordionTab>
    </Accordion>
    <div v-else>
      <div v-if="config.header" class="mb-4 header-default">
        <h2 class="text-lg font-bold">{{ config.header }}</h2>
      </div>
      <div class="p-4">
        <div class="grid gap-6">
          <div
              v-for="(pair, index) in keyValuePairs"
              :key="index"
              class="grid grid-cols-2 gap-6 items-center"
          >
            <InputText
                v-model="pair.key"
                :placeholder="config.placeholders.key"
                class="w-full"
            />
            <InputText
                v-model="pair.value"
                :placeholder="config.placeholders.value"
                class="w-full"
            />
          </div>
        </div>
        <Button
            :label="config.buttonLabel"
            class="mt-3"
            @click="addPair"
            outlined
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
  config: {
    type: Object,
    required: true,
  },
});

// Если в конфиге задан relationCode и в data есть соответствующее поле,
// преобразуем объект в массив пар вида [{ key: 'color', value: 'Black' }, ...]
let pairs = [];
if (props.config.relationCode && props.data && props.data[props.config.relationCode]) {
  pairs = Object.entries(props.data[props.config.relationCode]).map(
      ([key, value]) => ({ key, value })
  );
} else {
  pairs = [...props.config.initialPairs];
}

const keyValuePairs = ref(pairs);

function addPair() {
  keyValuePairs.value.push({ key: '', value: '' });
}
</script>

<style scoped>
.p-4 {
  max-width: 500px;
  margin: auto;
}
</style>
