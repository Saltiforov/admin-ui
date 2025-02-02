<template>
  <div>
    <div class="container">
      <div v-if="product">
        <div class="product-content form-grid">
          <!-- Левая колонка -->
          <div class="form-group">
            <p class="product__title">Product Code:</p>
            <InputText class="product-input" type="text" v-model="product.code"/>
          </div>

          <div class="form-group">
            <p class="product__title">Product Name:</p>
            <InputText class="product-input" type="text" v-model="product.name"/>
          </div>


          <div class="form-group">
            <p class="product__title">Product Quantity:</p>
            <InputNumber
                class="product-input"
                v-model="product.quantity"
                inputId="withoutgrouping"
                :useGrouping="false"
                fluid
            />
          </div>

          <div class="form-group">
            <p class="product__title">Product Category:</p>
            <Select
                v-model="product.category"
                :options="categories"
                optionLabel="name"
                placeholder="Select a Category"
                class="w-full product-input md:w-56"
            />
          </div>

          <div class="form-group">
            <p class="product__title">Product Price:</p>
            <InputNumber v-model="product.price" inputId="currency-us" mode="currency" currency="USD" locale="en-US"
                         fluid/>
          </div>

          <div class="form-group full-width">
            <p class="product__title">Description:</p>
            <Textarea
                id="description"
                v-model="product.description"
                rows="8"
                cols="40"
                class="product-textarea"
            />
          </div>


          <!--          <div class="form-group">-->
          <!--            <p class="product__title">Product Image:</p>-->
          <!--            <img-->
          <!--                :src="'https://primefaces.org/cdn/primevue/images/product/' + product.image"-->
          <!--                alt="Product Image"-->
          <!--                class="product-image"-->
          <!--            />-->
          <!--          </div>-->


          <div class="form-group full-width">
            <p class="product__title">Upload File:</p>
            <FileUpload
                name="demo[]"
                url="/api/upload"
                @upload="onAdvancedUpload($event)"
                :multiple="true"
                accept="image/*"

                vue
                Copy
                Edit
                :maxFileSize="1000000"
            >
              <template #empty>
                <span>Drag and drop files here to upload.</span>
              </template>
            </FileUpload>
          </div>
        </div>
        <div class="product-details__button">
          <Button>Save</Button>
        </div>
      </div>
      <div v-else>
        <p>Loading...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import {useRoute} from 'vue-router';
// import {ProductService} from "@/services/api/product-service.api.js";
import {useToast} from "primevue/usetoast";
import {getProductById} from "@/services/api/product-service.api.js";

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
  const productById = await getProductById(route.params.id);
  product.value = productById;
});
</script>

<style scoped>

.product-details__button {
  display: flex;
  justify-content: end;
  padding: 20px 0;
}

.container {
  max-width: 1230px;
  padding: 0 15px;
  margin: 0 auto;
}

.product__page-title {
  margin-bottom: 1rem;
  font-size: 2.2rem;
  font-weight: 700;
}

/* Грид для двух колонок */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px 32px;
  align-items: start;
  max-width: 1200px;
}

/* Группировка заголовка и инпута */
.form-group {
  display: flex;
  flex-direction: column;
}

/* Заголовки */
.product__title {
  font-weight: bold;
  font-size: 16px;
  color: #575669;
  margin-bottom: 10px;
}

/* Инпуты */
.product-input {
  min-width: 100%;
  border: none;
}

/* Текстовое поле */
.product-textarea {
  width: 100%;
  border-radius: 5px;
  padding: 10px;
  border: none;
}

/* Изображение */
.product-image {
  max-width: 320px;
  height: auto;
  border-radius: 5px;
}

/* Если нужно растянуть блок на всю ширину */
.full-width {
  grid-column: span 2;
}
</style>
