<template>
  <ThemeSwitcher/>
  <div class="card">
    <DataTable
        :value="products"
        paginator
        :rows="5"
        :rowsPerPageOptions="[5, 10, 20, 50]"
        tableStyle="min-width: 10rem"
        class="custom-table"
    >
      <template #header>
        <div class="flex flex-wrap items-center justify-between gap-2">
          <Button @click="addNewProduct">Add new product</Button>
        </div>
      </template>
      <Column field="name" header="Name"></Column>
      <Column header="Image">
        <template #body="slotProps">
          <img :src="`https://primefaces.org/cdn/primevue/images/product/${slotProps.data.image}`"
               :alt="slotProps.data.image" class="w-full table-image h-auto rounded object-contain"/>
        </template>
      </Column>
      <Column field="price" header="Price">
        <template #body="slotProps">
          {{ formatCurrency(slotProps.data.price) }}
        </template>
      </Column>
      <Column field="category" header="Category"></Column>
      <Column field="rating" header="Reviews">
        <template #body="slotProps">
          <Rating :modelValue="slotProps.data.rating" readonly/>
        </template>
      </Column>
      <Column header="Status">
        <template #body="slotProps">
          <Tag :value="availability[slotProps.data.availability]" :severity="getSeverity(slotProps.data)"/>
        </template>
      </Column>
      <Column header="Details">
        <template #body="slotProps">
          <Button @click="showDetails(slotProps.data._id)">Show details</Button>
        </template>
      </Column>
      <Column header="">
        <template #body="slotProps">
          <Button @click="showDetails(slotProps.data._id)">Show details</Button>
        </template>
      </Column>

    </DataTable>
  </div>
</template>

<script setup>
import {ref, onMounted, onUnmounted} from 'vue';
import {useRouter} from 'vue-router';
import eventBus from "../../../eventBus.js";
import {createProduct} from "@/services/api/product-service.api.js";
import {deepClone} from "@/utils/index.js";

const router = useRouter()

const props = defineProps({
  products: {
    type: Array,
    required: true,
  }
})
// TODO PROD
// TODO не понімаю як правильно дожидатись дату
const products = ref();
setTimeout(() => {
  products.value = deepClone(props.products);
}, 500)

const showDetails = (id) => {
  router.push({
    name: 'DetailsPage',
    params: {id},
  });
}

const tagsOptions = ref([
  {name: 'Electronics', code: 'ELEC'},
  {name: 'Clothing', code: 'CLOTH'},
  {name: 'Fitness', code: 'FIT'},
])


const popupFields = [
  {
    code: "name",
    component: "InputText",
    props: {type: "text", placeholder: "Name", style: "width: 100%; margin-bottom: 15px"},
    validators: [(value) => (value ? true : "Name is required")],
  },
  {
    code: "price",
    component: "InputNumber",
    props: {type: "text", placeholder: "Price", style: "width: 100%; margin-bottom: 15px"},
    validators: [(value) => (value ? true : "Price is required")],
  },
  {
    code: "discount",
    component: "InputNumber",
    props: {type: "text", placeholder: "Discount", style: "width: 100%; margin-bottom: 15px"},
    validators: [(value) => (value ? true : "Discount is required")],
  },
  {
    code: "category",
    component: "InputText",
    props: {type: "text", placeholder: "Category", style: "width: 100%; margin-bottom: 15px"},
    validators: [(value) => (value ? true : "Category is required")],
  },
  {
    code: "tags",
    component: "Select",
    props: {
      type: "text",
      placeholder: "Select tags",
      style: "width: 100%; margin-bottom: 15px",
      options: tagsOptions,
      optionLabel: "name",
    },
    validators: [(value) => (value ? true : "Tags is required")],
  },
  {
    code: "deliveryOptions",
    component: "Select",
    props: {
      type: "text",
      placeholder: "Select delivery options",
      style: "width: 100%; margin-bottom: 15px",
      options: tagsOptions,
      optionLabel: "name"
    },
    validators: [(value) => (value ? true : "Delivery Options is required")],
  },
  {
    code: "reviewCount",
    component: "InputNumber",
    props: {type: "text", placeholder: "Review Count", style: "width: 100%; margin-bottom: 15px"},
    validators: [(value) => (value ? true : "Review Count is required")],
  },
  {
    code: "description",
    component: "TextArea",
    props: {type: "text", placeholder: "Description", style: "width: 100%; margin-bottom: 15px"},
    validators: [(value) => (value ? true : "Description is required")],
  }
]
//TODO ми використовуємо один і той самий попап,
const addNewProduct = () => {
  eventBus.emit("show-popup", {
    title: "Add new product",
    fields: popupFields,
  })
}

const formatOptionsForSubmit = (data) => {
  if (!data) return [];

  if (Array.isArray(data)) {
    return data.map(item => item.name);
  }

  if (typeof data === "object" && data.name) {
    return [data.name];
  }

  return [];
};

//TODO компонент под availability: true,

const createNewProduct = async (options) => {
  const product = await options.newFilter
  try {
    const data = {
      ...product,
      tags: formatOptionsForSubmit(product.tags),
      deliveryOptions: formatOptionsForSubmit(product.deliveryOptions),
    }
    await createProduct(data)
  } catch (error) {
    console.error('Error in createProduct:', error);
  }
}

onMounted(() => {
  eventBus.on("add-filter", createNewProduct)
})


const formatCurrency = (value) => {
  return value.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
};



</script>

<style scoped>
.table-image {
  width: 150px;
  border-radius: 4px;
}

.custom-table :deep(table) {
  border-collapse: collapse;
}

.custom-table :deep(th),
.custom-table :deep(td) {
  padding: 36px; /* Внутренний отступ */
}

.card {
  background: white;
  border-radius: 30px !important;
}

.custom-table__header {
  padding: 12px;
}


:deep(.p-datatable-table-container) {
  border-radius: 15px !important;
}

:deep(p-treetable p-component) {
  border-radius: 15px !important;
}

.custom-table__header-title {
  font-weight: 700;
  font-size: 1.50rem;
  line-height: 1.75rem;
}
</style>
