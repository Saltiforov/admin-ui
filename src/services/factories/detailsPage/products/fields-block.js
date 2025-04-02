import {computed} from "vue";
import {t} from "@/i18n/index.js";
import {capitalizeFirstLetter} from "@/utils/index.js";

export const productsFieldsBlock = {
    fields: {
        items: [
            {
                name: 'name',
                code: 'name',
                label: computed(() => t("label_name", { entity: capitalizeFirstLetter(t("entity_product_gen")) })),
                type: 'InputText',
                props: {
                    type: 'text',
                    class: 'product-input',
                    placeholder: computed(() => t("placeholder_enter_name", { entity: t("entity_product_gen") })),
                    required: true
                },
                validators: [(value) => (value ? true : "Name is required")],
            },
            {
                name: 'price',
                code: 'price',
                label: computed(() => t("label_price", { entity: capitalizeFirstLetter(t("entity_product_gen")) })),
                type: 'InputNumber',
                props: {
                    inputId: 'currency-us',
                    mode: 'currency',
                    currency: 'USD',
                    locale: 'en-US',
                    fluid: true,
                    placeholder: computed(() => t("placeholder_enter_price", { entity: t("entity_product_gen") })),
                    required: true
                },
                validators: [(value) => (value ? true : "Price is required")],
            },
            {
                name: 'filters',
                code: 'filters',
                label: computed(() => t("label_related_filters")),
                type: 'AsyncTreeSelect',
                disablePropsBinding: true,
                props: {
                    restOptionsUrl: 'api/filters',
                    placeholder: computed(() => t("placeholder_enter_filters")),
                    selectionMode: 'multiple',
                    class: 'w-full product-input md:w-56',
                    required: false,
                    showClear: true,
                    fullWidth: true,
                }
            },
            {
                name: 'description',
                code: 'description',
                label: computed(() => t("label_description")),
                type: 'TextArea',
                disablePropsBinding: false,
                props: {
                    placeholder: computed(() => t("placeholder_enter_description")),
                    class: 'w-full product-input md:w-56',
                    required: false,
                    showClear: true,
                    fullWidth: true,
                    rows: "5"
                }
            },
            {
                name: 'discount',
                code: 'discount',
                label: computed(() => t("label_discount")),
                type: 'InputNumber',
                props: {
                    inputId: 'discount',
                    suffix: '%',
                    min: 0,
                    max: 100,
                    placeholder: computed(() => t("placeholder_enter_discount")),
                    required: false
                }
            },
            {
                name: 'category',
                code: 'category',
                label: computed(() => t("label_category")),
                type: 'InputText',
                props: {
                    type: 'text',
                    class: 'product-input',
                    placeholder: computed(() => t("placeholder_enter_category")),
                    required: true
                }
            },
        ],
        header: computed(() => t("title_edit_page", { pageName: t("entity_product_prep") })),
    }
}
