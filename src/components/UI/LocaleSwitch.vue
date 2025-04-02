<template>
  <div class="flex locale-switch items-center">
    <Select class="w-full"
            v-model="selectedLanguage"
            :placeholder="t('placeholder_select_language')"
            optionLabel="name"
            :options="languages"
            @change="switchLocale"
    ></Select>
  </div>

</template>

<script setup>
import {useI18n} from 'vue-i18n';
import {ref} from "vue";
import Select from 'primevue/select';

const {t, locale} = useI18n();

const switchLocale = () => {
  localStorage.setItem('locale', selectedLanguage.value.code);
  locale.value = selectedLanguage.value.code;
};

const selectedLanguage = ref();
const languages = ref([
  {name: 'Українська', code: 'uk'},
  {name: 'Русский', code: 'ru'},
  {name: 'English', code: 'en'},
]);
</script>

<style scoped>
.locale-switch {
  min-width: 150px;
}
</style>