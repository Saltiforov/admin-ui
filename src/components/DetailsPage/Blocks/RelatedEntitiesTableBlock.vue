<template>
  <div class="mb-12">
    <div class="container">
      <div class="flex justify-end mb-4">
        <Button
            type="button"
            icon="pi pi-ellipsis-v"
            label="Add New Entity"
            @click="handlePopup"
        />
      </div>
      <CustomDataTable
          :config="config"
          :total-records="totalRecords"
      >
        <template #quantity="{ data }">
          <InputNumber v-model="data.quantity" inputId="minmax-buttons" mode="decimal" showButtons :min="1" :max="100"
                       fluid/>
        </template>
        <template #image="{ data }">
          <img :src="data.images ? pathBuilder(data.images[0]) : defaultProductImage" alt="image"
               class="table-image h-auto rounded object-contain"/>
        </template>
        <template #availability="{ data }">
          <i v-if="data.availability" class="pi pi-check" style="color: #575669FF"></i>
          <span v-else>---</span>
        </template>
        <template style="width: 5%" #actions="{ data }">
          <Button
              type="button"
              icon="pi pi-ellipsis-v"
              aria-haspopup="true"
              aria-controls="overlay_menu"
              @click="(event) => toggle(event, data)"
          />
          <div>
          </div>
        </template>
      </CustomDataTable>
      <ConfirmDialog/>
      <Menu ref="menu" id="overlay_menu" :model="items" :popup="true"/>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, watchEffect, watch} from "vue";
import defaultProductImage from "@/assets/icons/shopping-bag.svg";
import Button from "primevue/button";
import CustomDataTable from "@/components/DataTable/CustomDataTable.vue";
import eventBus from "../../../../eventBus.js";
import AsyncMultiSelect from "@/components/UI/AsyncMultiSelect.vue";
import {pathBuilder} from "@/utils/index.js";

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
  config: {
    type: Object,
    required: true,
  },
  errors: {
    type: Object,
    required: true,
  },
  totalRecords: {
    type: Number,
    default: 0,
  }
});

const handlePopup = () => {
  eventBus.emit("show-popup", {
    fields: [
      {
        code: "products",
        component: AsyncMultiSelect,
        props: {
          filter: true,
          filterPlaceholder: "Search...",
          maxSelectedLabels: 3,
          placeholder: "Select a value",
          optionLabel: "name",
          itemsPerPage: 10,
          skip: 0,
          display: "chip",
          restOptionsUrl: 'api/products',
          loading: false,
          selectClass: "w-full",
          style: "margin-bottom: 15px",
        },
      },
    ]
  })
}

const currentTarget = ref({});

const emit = defineEmits(['handleDelete'])

const toggle = (event, data) => {
  currentTarget.value = data
  menu.value.toggle(event);
  console.log("currentTarget", currentTarget.value);
};

const deleteItem = () => emit("handleDelete", currentTarget.value);

const menu = ref();
const items = ref([
  {
    label: 'Operations',
    items: [
      {
        label: "Delete",
        icon: "pi pi-trash",
        command: () => deleteItem(),
      },
    ],
  },
]);

// TODO OBSERVEBEL

const formData = ref({});

const isEditMode = computed(() => !!props.data)

const getData = () => {
  return {...formData.value};
};

watchEffect(() => {
  formData.value = {...props.data}
});

watch(() => props.config.value, (val) => formData.value = val)

defineExpose({
  getData
});


</script>
