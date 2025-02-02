<template>
  <div>
    <div v-if="product" class="product">
      <h1 class="product__page-title">Product Details</h1>
      <div class="product-content form-grid">
        <p class="product__title">Product Code:</p>
        <InputText class="product-input" type="text" v-model="product.code"/>

        <p class="product__title">Product Name:</p>
        <InputText class="product-input" type="text" v-model="product.name"/>

        <p class="product__title">Product Price:</p>
        <InputNumber v-model="product.price" inputId="currency-us" mode="currency" currency="USD" locale="en-US" fluid />

        <p class="product__title">Product Category:</p>
        <Select
            v-model="product.category"
            :options="categories"
            optionLabel="name"
            placeholder="Select a Category"
            class="w-full product-input md:w-56"
        />

        <p class="product__title">Product Quantity:</p>
        <InputNumber
            class="product-input"
            v-model="product.quantity"
            inputId="withoutgrouping"
            :useGrouping="false"
            fluid
        />

        <p class="product__title">Product Image:</p>
        <img
            :src="'https://primefaces.org/cdn/primevue/images/product/' + product.image"
            alt="Product Image"
            class="product-image"
        />

        <p class="product__title">Description:</p>
        <Textarea
            id="description"
            v-model="product.description"
            rows="5"
            cols="40"
            class="product-textarea"
        />

        <p class="product__title">Upload File:</p>
        <FileUpload
            name="demo[]"
            url="/api/upload"
            @upload="onAdvancedUpload($event)"
            :multiple="true"
            accept="image/*"
            :maxFileSize="1000000"
        >
          <template #empty>
            <span>Drag and drop files here to upload.</span>
          </template>
        </FileUpload>
      </div>
      <div class="product-details__button">
        <Button>Save</Button>
      </div>
    </div>
    <div v-else>
      <p>Loading...</p>
    </div>
    <div class="footer-details">

    </div>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import {useRoute} from 'vue-router';
// import {ProductService} from "@/services/api/product-service.api.js";
import {useToast} from "primevue/usetoast";

const toast = useToast();
const route = useRoute();
const product = ref(null);

const categories = ref([
  {name: 'Electronics', code: 'ELEC'},
  {name: 'Clothing', code: 'CLOTH'},
  {name: 'Fitness', code: 'FIT'},
  {name: 'Accessories', code: 'ACC'},
  {name: 'Toys', code: 'TOYS'}
]);


const onAdvancedUpload = (event) => {
  toast.add({severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000});
};

onMounted(async () => {
  // const productById = ProductService.getProductById(route.params.id);
  // console.log('currentProduct', productById);
  // product.value = productById;

});
</script>

<style scoped>
.form-grid {
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 10px 20px;
  align-items: center;
  max-width: 1200px;
}

.product__page-title {
  margin-bottom: 20px;
}

label {
  font-weight: bold;
  text-align: right;
}

.product-details__button {
  display: flex;
  justify-content: end;
  padding: 15px 0px;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.product {
  max-width: 1230px;
  padding: 0 15px;
  margin: 0 auto;
}

.product__header {
  color: #007bff;
}

.product-input {
  border-radius: 5px;
  min-width: 238px;
}

.product__title {
  font-weight: bold;
  font-size: 16px;
  color: #333;
  text-align: left;
}

.product__item {
  margin: 10px 0px;
}
</style>
