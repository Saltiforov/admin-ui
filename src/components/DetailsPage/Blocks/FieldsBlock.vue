<template>
  <div class="fields-block mb-12">
    <div v-if="config?.header" class="mb-4 header-default">
      <h2 class="text-lg font-bold">{{ t(config.header, {number: contextId}) }}</h2>
    </div>

    <div class="container">
      <div class="form-content grid grid-cols-2 gap-6">

        <template v-for="(group, index) in optionFieldGroups" :key="`group-${index}`">
          <div class="form-group col-span-2 flex items-center gap-6">
            <div v-for="field in group" :key="field.name">
              <div v-if="!field.onlyEditMode || isEditMode" class="">
                <p class="form__title">{{ field.label }}:</p>
                <component class="w-full" :is="field.type" v-bind="getAdaptedProps(field.props)" v-model="formData[field.name]"
                />
              </div>
            </div>
          </div>
        </template>

        <div
            v-for="(group, index) in groupedFields"
            :key="'group-' + index"
            class="form-group col-span-2 mb-5"
        >
          <h2 class="text-xl grouped-title font-semibold mb-4">{{ t(group.blockTitle) }}</h2>
          <div class="grid grid-cols-2 gap-6">
            <template v-for="field in group.children" :key="field.name">
              <div class="form-group">
                <p class="form__title mb-1">{{ field.label }}:</p>
                <DynamicRenderField
                    v-if="field.render"
                    :field="field"
                    v-model="formData[field.name]"
                />
                <component
                    v-else
                    class="w-full"
                    :is="field.type"
                    v-bind="field.disablePropsBinding ? {} : (getAdaptedProps(field.props)  || {})"
                    :config="field.props"
                    v-model="formData[field.name]"
                />
                <Message
                    v-if="errors && errors[field.code]"
                    severity="error"
                    size="small"
                    variant="simple"
                    class="message-error"
                >
                  {{ errors[field.code] }}
                </Message>
              </div>
            </template>
          </div>
        </div>

        <template v-for="field in baseFields" :key="field.name">
          <div class="form-group">
            <p class="form__title mb-1">{{ field.label }}:</p>
            <DynamicRenderField
                v-if="field.render"
                :field="field"
                v-model="formData[field.name]"
            />
            <component
                v-else
                class="w-full"
                :is="field.type"
                v-bind="field.disablePropsBinding ? {} : (getAdaptedProps(field.props) || {})"
                :config="field.props"
                v-model="formData[field.name]"
            />
            <Message
                v-if="errors && errors[field.code]"
                severity="error"
                size="small"
                variant="simple"
                class="message-error"
            >
              {{ errors[field.code] }}
            </Message>
          </div>
        </template>


        <template v-for="field in textAreaFields" :key="field.name">
          <div class="form-group col-span-2">
            <p class="form__title ">{{ field.label }}:</p>
            <component class="w-full"
                       :is="field.type"
                       v-bind="getAdaptedProps(field.props)"
                       v-model="formData[field.name]"
            />
            <Message
                v-if="errors && errors[field.code]"
                severity="error"
                size="small"
                variant="simple"
                class="message-error"
            >
              {{ errors[field.code] }}
            </Message>
          </div>
        </template>

      </div>


      <div class="mt-4">
        <template v-if="baseFieldsWithFullWidth" v-for="fieldFullWidth in baseFieldsWithFullWidth">
          <div class="form-group mb-3">
            <p class="form__title mb-1">{{ fieldFullWidth.label }}:</p>
            <component
                class="w-full"
                :is="fieldFullWidth.type"
                v-bind="fieldFullWidth.disablePropsBinding ? {} : (fieldFullWidth.props || {})"
                :config="fieldFullWidth.props"
                :filters="data?.filters"
                v-model="formData[fieldFullWidth.name]"
            />
            <Message
                v-if="errors && errors[fieldFullWidth.code]"
                severity="error"
                size="small"
                variant="simple"
                class="message-error"
            >
              {{ errors[fieldFullWidth.code] }}
            </Message>
          </div>
        </template>
      </div>

    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, watchEffect, isRef} from "vue";
import DynamicRenderField from "@/components/UI/DynamicRenderField/DynamicRenderField.vue";
import {useRoute} from "vue-router";
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
  contextId: {
    type: String,
    required: false,
  }
});

const {t} = useI18n();

const formData = ref({});

const route = useRoute()

const isEditMode = computed(() => route.params.id)

const getData = () => {
  const {price_uah, price_eur, discount, discount_uah, discount_eur, ...rest} = formData.value;

  return {
    ...rest,
    price: {
      uah: price_uah,
      eur: price_eur,
    },
    ...(discount_uah || discount_eur
        ? {
          discount: {
            uah: discount_uah || 0,
            eur: discount_eur || 0,
          }
        }
        : {
          discount: discount
        })
  };
};

const getAdaptedProps = (props) => {
  const adapted = {}
  for (const [key, value] of Object.entries(props || {})) {
    adapted[key] = isRef(value) ? value.value : value
  }
  return adapted
}

watchEffect(() => {
  formData.value = {...props.data};
});

defineExpose({
  getData
});

onMounted(() => {
  props.config.items.forEach((field) => {
    if (field.blockTitle && field.children?.length) {
      field.children.forEach((subField) => {
        if (subField.code && props.data?.[subField.code] !== undefined) {
          formData.value[subField.code] = props.data[subField.code];
        }
      });
    } else if (field.code && props.data?.[field.code] !== undefined) {
      formData.value[field.code] = props.data[field.code];
    }
  });
});

const groupedFields = computed(() => {
  const groups = {};
  (props.config?.items || []).forEach(field => {
    if (field.blockTitle) {
      if (!groups[field.blockTitle]) {
        groups[field.blockTitle] = {
          blockTitle: field.blockTitle,
          children: [],
        };
      }
      if (Array.isArray(field.children)) {
        groups[field.blockTitle].children.push(...field.children);
      } else {
        groups[field.blockTitle].children.push(field);
      }
    }
  });
  return Object.values(groups);
});


const baseFields = computed(() => {
  return props.config.items.filter(f => {
    return !["Checkbox", "Rating", "TextArea"].includes(f.type) && !f.props.fullWidth && !f.blockTitle
  });
});

const baseFieldsWithFullWidth = computed(() => {
  return props.config.items.filter(f => f.props.fullWidth)
})

const optionFieldGroups = computed(() => {
  const {groups, currentGroup} = props.config.items.reduce(
      (acc, field) => {
        if (field.type === "Checkbox" || field.type === "Rating") {
          acc.currentGroup.push(field);
        } else if (acc.currentGroup.length) {
          acc.groups.push(acc.currentGroup);
          acc.currentGroup = [];
        }
        return acc;
      },
      {groups: [], currentGroup: []}
  );

  if (currentGroup.length) {
    groups.push(currentGroup);
  }

  return groups;
});

const textAreaFields = computed(() => {
  return props.config.items.filter(f => f.type === "TextArea" && !f.props.fullWidth);
});
</script>

<style scoped>
.grouped-title {
  color: black;
  font-size: 24px;
}

.form-content {
  margin-bottom: 16px;
}
</style>