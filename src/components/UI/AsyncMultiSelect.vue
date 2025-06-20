<template>
  <div :class="selectClass" :style="style">
    <div class="p-multiselect mb-1 p-component p-inputwrapper w-full md:w-80"
         ref="multiselectRef">
      <div class="p-hidden-accessible">
        <input
            type="text"
            readonly
            :placeholder="placeholder"
            tabindex="0"
            role="combobox"
            aria-haspopup="listbox"
            :aria-expanded="isOpen"
        />
      </div>
      <div class="p-multiselect-label-container" @click="toggleDropdown">
        <div class="p-multiselect-label">
          <span v-if="selectedOptions.length">{{ displaySelectedOptions }}</span>
          <span v-else class="p-placeholder">{{ placeholder }}</span>
        </div>
      </div>
      <div class="p-multiselect-dropdown" @click="toggleDropdown">
        <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="p-icon p-multiselect-dropdown-icon"
            aria-hidden="true"
        >
          <path
              d="M7.01744 10.398C6.91269 10.3985 6.8089 10.378 6.71215 10.3379C6.61541 10.2977 6.52766 10.2386 6.45405 10.1641L1.13907 4.84913C1.03306 4.69404 0.985221 4.5065 1.00399 4.31958C1.02276 4.13266 1.10693 3.95838 1.24166 3.82747C1.37639 3.69655 1.55301 3.61742 1.74039 3.60402C1.92777 3.59062 2.11386 3.64382 2.26584 3.75424L7.01744 8.47394L11.769 3.75424C11.9189 3.65709 12.097 3.61306 12.2748 3.62921C12.4527 3.64535 12.6199 3.72073 12.7498 3.84328C12.8797 3.96582 12.9647 4.12842 12.9912 4.30502C13.0177 4.48162 12.9841 4.662 12.8958 4.81724L7.58083 10.1322C7.50996 10.2125 7.42344 10.2775 7.32656 10.3232C7.22968 10.3689 7.12449 10.3944 7.01744 10.398Z"
              fill="currentColor"
          />
        </svg>
      </div>
      <div v-if="isOpen" class="p-multiselect-panel"
           @scroll="handleScroll">
        <div class="p-multiselect-panel-container">
          <div class="p-multiselect-search-wrapper">
            <div class="p-multiselect-select-all">
              <input
                  v-if="multiple"
                  type="checkbox"
                  :checked="allSelected"
                  @change="toggleSelectAll"
                  class="p-checkbox-input"
              />
            </div>
            <div class="w-full">
              <input
                  type="text"
                  v-model="searchQuery"
                  :placeholder="filterPlaceholder"
                  class="p-multiselect-search"
              />
            </div>
          </div>

          <ul class="p-multiselect-search-list" @scroll="handleScroll">
            <li
                class="p-multiselect-option"
                v-for="option in filteredOptions"
                :key="option.code"
                @click="toggleSelection(option)"
                :class="{
          selected: isSelected(option),
          }"
            >
              <input
                  v-if="multiple"
                  type="checkbox"
                  :checked="isSelected(option)"
                  @change="toggleSelection(option)"
                  @click="toggleSelection(option)"
                  class="p-checkbox-input"
                  :class="{ 'selected' : isSelected(option) }"
              />
              {{ option.label }}
            </li>
          </ul>
          <div v-if="loading" class="loading-spinner">Loading...</div>
        </div>
      </div>
    </div>
    <div v-if="display === 'chip'" class="p-multiselect-panel-chips">
      <div  class="selected-chips">
        <div class="chips-wrapper">
          <Chip v-if="selectedOptions.length"
                v-for="selected in selectedOptions"
                class="chip-item"
                :label="selected.label"
                removable
                @remove="removeChip(selected.code)"
          />

          <span v-else>Values not selected...</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, onUnmounted, watch} from 'vue';
import {useDataStore} from "@/stores/dataStore.js";
import createDebouncedService from '@/services/debounceService/debounceService.js'
import eventBus from "../../../eventBus.js";

const {debounceService} = createDebouncedService();

const props = defineProps({
  selectId: {type: String, required: true},
  options: {type: Array, required: true},
  filter: {type: Boolean, default: true},
  filterPlaceholder: {type: String, default: "Search..."},
  maxSelectedLabels: {type: Number, default: 5},
  placeholder: {type: String, default: "Select a value"},
  optionLabel: {type: String, default: "label"},
  itemsPerPage: {type: Number, default: 10},
  skip: {type: Number, default: 0},
  display: {type: String, default: "chip"},
  restOptionsUrl: {type: String, required: true},
  selectClass: {type: String, default: "w-full"},
  style: {type: String, default: ""},
  modelValue: {type: Array, default: () => []},
  useEditMode: {type: Boolean, default: true},
  chips: {type: Boolean, default: true},
  multiple: {type: Boolean, default: true}
});

const emit = defineEmits(['update:modelValue', 'remove-selected'])

const dataStore = useDataStore()

const optionsCache = computed(() => dataStore.getSelectedData(props.selectId) || [])

const searchQuery = ref('')
const selectedOptions = ref(optionsCache.value)
const loading = ref(false)
const isOpen = ref(false)
const isShowMore = ref(false)
const multiselectRef = ref(null)


const useEditMode = computed(() => props.useEditMode)

const isOptionsSelected = computed(() => !!selectedOptions.value)

const removeChip = (code) => {
  dataStore.removeSelectedData(props.selectId, code)
  eventBus.emit("remove-selected", code)
  console.log("removeChip", code)
}

const params = computed(() => ({
  skip: props.skip + (dataStore.getCurrentPage(props.selectId) - 1) * props.itemsPerPage,
  limit: props.itemsPerPage,
  q: searchQuery.value.trim()
}))

const options = computed(() => {
  return dataStore.getOptions(props.selectId).value.map(option => ({
    label: option.name || option.username,
    code: option._id
  }))
})


const hasMoreData = computed(() =>
    options.value.length < dataStore.getTotalCount(props.selectId)
)

const displaySelectedOptions = computed(() => {
  if (selectedOptions.value.length <= props.maxSelectedLabels) {
    return selectedOptions.value.map(o => o.label).join(', ')
  } else {
    return `${selectedOptions.value.length} items selected`
  }
})

const filteredOptions = computed(() => {
  if (!searchQuery.value) {
    return options.value
  }
  const lowerQuery = searchQuery.value.toLowerCase()
  return options.value.filter(option =>
      option.label.toLowerCase().includes(lowerQuery)
  )
})

const chipsedSelectedOptions = computed(() =>
    isShowMore.value
        ? [...selectedOptions.value]
        : [...selectedOptions.value].slice(0, 4)
)

const showMoreSelectedOptions = () => {
  isShowMore.value = !isShowMore.value
}

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const closeDropdown = (event) => {
  if (multiselectRef.value && !multiselectRef.value.contains(event.target)) {
    isOpen.value = false
  }
}

const isSelected = (option) => {
  return props.multiple
      ? selectedOptions.value.some(o => o.code === option.code)
      : selectedOptions.value[0]?.code === option.code
}

const toggleSelection = (option) => {
  if (props.multiple) {
    const index = selectedOptions.value.findIndex(o => o.code === option.code)
    if (index === -1) {
      selectedOptions.value.push(option)
    } else {
      selectedOptions.value.splice(index, 1)
    }
    emit('update:modelValue', selectedOptions.value)
  } else {
    selectedOptions.value = [option]
    emit('update:modelValue', option)
    isOpen.value = false
  }
}

const toggleSelectAll = () => {
  if (!props.multiple) return
  selectedOptions.value = allSelected.value ? [] : [...options.value]
  emit('update:modelValue', selectedOptions.value)
}

const allSelected = computed(() =>
    options.value.length > 0 &&
    options.value.every(option =>
        selectedOptions.value.some(o => o.code === option.code)
    )
)

const handleScroll = (event) => {
  const bottom = event.target.scrollHeight === event.target.scrollTop + event.target.clientHeight
  if (bottom && !loading.value && hasMoreData.value) {
    dataStore.loadMoreData(props.selectId, props.restOptionsUrl, params.value)
  }
}

const loadOptions = async () => {
  if (props.restOptionsUrl && !loading.value) {
    loading.value = true
    try {
      await dataStore.fetchData(props.selectId, props.restOptionsUrl, params.value)
    } catch (error) {
      console.error('Error loading options:', error)
    } finally {
      loading.value = false
    }
  }
}

// 🔁 Дебаунс один раз для функции загрузки

watch(searchQuery, () => {
  debounceService(loadOptions, 400)
})

// 📦 первичная загрузка
onMounted(() => {
  if (optionsCache.value.length > 0 && useEditMode.value) {
    selectedOptions.value = optionsCache.value
  }
  loadOptions() // ЗАГРУЖАЕМ ПЕРВЫЕ 10
  document.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})

// 🔄 следим за modelValue
watch(() => props.modelValue, (newValue) => {
  if (props.multiple) {
    selectedOptions.value = Array.isArray(newValue) ? newValue : []
  } else {
    selectedOptions.value = newValue ? [newValue] : []
  }
}, {immediate: true})
</script>


<style scoped>
.selected {
  background: #c7c7c7;
}

.p-multiselect {
  position: relative;
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 7px;
  cursor: pointer;
  background: transparent;
}

.p-multiselect-search-list {
  max-height: 200px;
  overflow-y: auto;
  padding: 3.5px;
}

.p-multiselect-label-container {
  padding: 8px 12px;
  flex: 1;
}

.p-multiselect-dropdown {
  padding: 7px;
  display: flex;
  align-items: center;
}

.p-multiselect-panel {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 10;
  margin-top: 5px;
  transition: transform 0.3s ease;
}

.p-multiselect-panel-chips {
  width: 100%;
  background: white;
}

.p-multiselect-option {
  padding: 7px 13.5px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.p-multiselect-panel ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.p-multiselect-option:hover {
  background: #f0f0f0;
}

.chip-item {
  margin: 5px;
}

.p-multiselect-search-wrapper {
  display: flex;
  align-items: center;
  padding: 7px 14px 3.5px;
}

.p-multiselect-search {
  width: 100%;
  padding: 7px 35px 7px 3.5px;
  border: 1px solid #ccc;
  border-radius: 7px;
  outline: none;
}

.p-multiselect-select-all {
  margin-right: 7px;
}

.p-multiselect-select-all label {
  margin-left: 5px;
}

.p-checkbox-input {
  width: 18px; /* Размер чекбокса */
  height: 18px;
  cursor: pointer;
  margin-right: 8px;
  position: relative;
  appearance: none; /* Убираем стандартный стиль чекбокса */
  border: 2px solid #ccc; /* Цвет границы */
  border-radius: 3px; /* Закругление углов */
  background-color: #fff; /* Фон чекбокса */
  transition: background-color 0.3s, border-color 0.3s;
}

.p-checkbox-input:checked::after {
  content: '';
  position: absolute;
  top: 1px;
  left: 4px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0px 1px 1px 0;
  transform: rotate(45deg);
}

.p-checkbox-input:checked {
  background-color: #000000;
  border-color: #000000;
}

.p-checkbox-input:focus {
  outline: none;
}

.chips-wrapper {
  padding: 10px 5px;
}

.loading-spinner {
  text-align: center;
  padding: 5px;
}
</style>
