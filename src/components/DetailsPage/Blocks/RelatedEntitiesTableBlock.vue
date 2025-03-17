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
import {ref, computed} from "vue";
import defaultProductImage from "@/assets/icons/shopping-bag.svg";
import Button from "primevue/button";
import CustomDataTable from "@/components/DataTable/CustomDataTable.vue";
import eventBus from "../../../../eventBus.js";
import {pathBuilder} from "@/utils/index.js";
import {useRoute} from "vue-router";
import {getPopupConfig} from "@/services/factories/index.js";

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

const isUpdateMode = computed(() => !!props.data)

const route = useRoute()

const menu = ref();

const currentTarget = ref({});

const emit = defineEmits(['handleDelete'])

const pageType = route.meta.pageType;

const {relatedEntitiesTablePopup} = getPopupConfig(pageType, 'orders-popups')

const updatedRelatedEntitiesTablePopup = computed(() => ({
  ...relatedEntitiesTablePopup,
  fields: relatedEntitiesTablePopup.fields.map(field => ({
    ...field,
    props: {
      ...field.props,
      useEditMode: isUpdateMode.value
    }
  }))
}));

const handlePopup = () => {
  eventBus.emit("show-popup", updatedRelatedEntitiesTablePopup.value)
}

const toggle = (event, data) => {
  currentTarget.value = data
  menu.value.toggle(event);
  console.log("currentTarget", currentTarget.value);
};

const deleteItem = () => emit("handleDelete", currentTarget.value);

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


const getData = () => {
  return {...props.config.value};
};

defineExpose({
  getData
});


</script>
