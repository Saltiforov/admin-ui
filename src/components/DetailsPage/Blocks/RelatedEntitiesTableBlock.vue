<template>
  <div class="mb-12">
    <div class="container">
      <div class="flex justify-end mb-4">
        <Button
            type="button"
            icon="pi pi-ellipsis-v"
            :label="buttonLabel"
            @click="handlePopup"
        />
      </div>
      <div class="order-total-highlight">
      <CustomDataTable
          :config="config"
          :total-records="totalRecords"
          :fixed-row="false"
      >
        <template #quantity="{ data }">
          <InputNumber v-model="data.quantity" inputId="minmax-buttons" mode="decimal" showButtons :min="1" :max="100"
                       fluid/>
        </template>
        <template #image="{ data }">
          <img :src="data.images.length ? fullImageUrls(data.images)[0] : defaultProductImage" alt="image"
               class="table-image h-auto rounded object-contain"/>
        </template>
        <template #price="{ data }">
          <div class="price-display">
            <div v-if="data.priceAfterDiscount?.eur">EUR: {{ data.priceAfterDiscount.eur }}</div>
            <div v-if="data.priceAfterDiscount?.uah">UAH: {{ data.priceAfterDiscount.uah }}</div>
          </div>
        </template>
        <template #description="{ data }">
          <div v-html="data.description" class="no-p-tag" />
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
        <div v-show="isUpdateMode" class="order-summary">
          <h2>{{ t('order_summary') }}</h2>
          <div class="amounts">
            <div class="amount-uah">₴ {{ orderSummary }}</div>
          </div>
        </div>
      </div>

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
import {fullImageUrls, pathBuilder} from "@/utils/index.js";
import {useRoute} from "vue-router";
import {getPopupConfig} from "@/services/factories/index.js";
import {useI18n} from "vue-i18n";

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
  },
  defaultValuePopup: {
    type: [Number, String, Object, Array, Boolean],
    default: false,
  }
});

const {t} = useI18n();

const buttonLabel = computed(() => t('button_text_new_entity'))

const isUpdateMode = computed(() => !!route.params.id)

const defaultValueForPopup = computed(() => props.defaultValuePopup || null)

const route = useRoute()

const menu = ref();

const currentTarget = ref({});

const emit = defineEmits(['handleDelete'])

const pageType = route.meta.pageType;

const orderSummary = computed(() => {
  return props.data?.pricing?.totalOrderPrice || ''
})

const {relatedEntitiesTablePopup} = getPopupConfig(pageType, 'orders-popups')

const updatedRelatedEntitiesTablePopup = computed(() => ({
  ...relatedEntitiesTablePopup,
  fields: relatedEntitiesTablePopup.fields.map(field => ({
    ...field,
    defaultValue: defaultValueForPopup.value,
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
};

const deleteItem = () => emit("handleDelete", currentTarget.value);

const items = ref([
  {
    label: computed(() => t("menu_popup_title")),
    items: [
      {
        label: computed(() => t("menu_popup_operation_delete")),
        icon: "pi pi-trash",
        command: () => deleteItem(),
      },
    ],
  },
]);

const getData = () => {
  return {...props.config.value};
};

defineExpose({
  getData
});


</script>

<style scoped>
.order-total-highlight {
  margin-top: 2rem;
  padding: 0.5rem 0.5rem;
  border-radius: 12px;
  background-color: #ffffff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.order-summary {
  display: flex;
  flex-direction: column;
  align-items: end;
  margin-top: 12px;
  padding: 0.5rem 1.5rem;
}


.order-total-highlight h2 {
  font-size: 1.5rem;
  color: #111827;
}

.amounts {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.no-p-tag p {
  display: inline;
  margin: 0;
}

.amount-uah,
.amount-eur {
  font-size: 1.6rem;
  font-weight: bold;
  color: #1f2937;
}
</style>
