<template>
  <div class="dynamic-attrs-block mb-12">
    <Accordion v-if="config.accordion" class="mt-12">
      <AccordionTab :header="config.header || 'Настройки'">
        <div class="p-4 flex justify-between">
          <div
              class="grid gap-6 custom-scroll"
              :style="keyValuePairs.length > 6 ? 'height: 400px; overflow-y: auto;' : ''"
          >
            <div
                v-for="(pair, index) in keyValuePairs"
                :key="index"
                class="grid gap-6 items-center"
                style="grid-template-columns: 1fr 1fr auto;"
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
              <i
                  v-if="index > 0"
                  class="pi pi-times w-6 text-center pointer"
                  @click="deletePair(index)"
              ></i>
              <div v-else class="empty-block"></div>
            </div>
          </div>
          <Button
              :label="config.buttonLabel"
              class="self-start"
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
      <div class="p-4 flex justify-between">
        <div class="grid gap-6">
          <div
              v-for="(pair, index) in keyValuePairs"
              :key="index"
              class="grid gap-6 items-center"
              style="grid-template-columns: 1fr 1fr auto;"
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
            <i
                v-if="index > 0"
                class="pi pi-times w-6 text-center pointer"
                @click="deletePair(index)"
            ></i>
            <div v-else class="empty-block"></div>
          </div>
        </div>
        <Button
            :label="config.buttonLabel"
            class="self-start"
            @click="addPair"
            outlined
        />

      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, watchEffect} from 'vue';

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

const keyValuePairs = ref([]);

watchEffect(() => {
  if (props.config.relationCode && props.data && props.data[props.config.relationCode]) {
    keyValuePairs.value = Object.entries(props.data[props.config.relationCode]).map(
        ([key, value]) => ({ key: value.key, value: value.value })
    );
  } else {
    keyValuePairs.value = [...props.config.initialPairs];
  }
});

const deletePair = (idx) => {
  keyValuePairs.value = keyValuePairs.value.filter((_, i) => i !== idx);
};

function addPair() {
  keyValuePairs.value.push({key: '', value: ''});
}

const getData = () => {
  return {attributes: {...keyValuePairs.value}};
};

defineExpose({
  getData
});

</script>

<style scoped>
.p-4 {
  max-width: 600px;
  margin: auto;
}
.empty-block {
  width: 16px;
}
</style>
