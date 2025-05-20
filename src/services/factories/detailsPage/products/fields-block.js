import {computed} from "vue";
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
                name: 'showAsNew',
                code: 'showAsNew',
                label: computed(() => t("label_show_as_new")),
                type: 'Checkbox',
                props: {
                    class: 'product-checkbox',
                    trueValue: true,
                    falseValue: false,
                    binary: true,
                },
                default: false,
                validators: [],
            },
            {
                name: 'vendor',
                code: 'vendor',
                label: computed(() => t("vendor", { entity: capitalizeFirstLetter(t("entity_product_gen")) })),
                type: 'InputText',
                props: {
                    type: 'text',
                    class: 'product-input',
                    placeholder: computed(() => t("placeholder_enter_name", { entity: t("entity_product_gen") })),
                    required: true
                },
            },

            {
                type: 'InputText',
                props: {
                    type: 'text',
                    class: 'product-input',
                    required: true,
                },
                blockTitle: 'Pricing',
                children: [
                    {
                        name: 'price_uah',
                        code: 'price_uah',
                        label: computed(() => t("label_price", { entity: capitalizeFirstLetter(t("entity_product_gen")), currency: 'UAH' })),
                        type: 'InputNumber',
                        props: {
                            inputId: 'currency-uah',
                            mode: 'currency',
                            currency: 'UAH',
                            locale: 'uk-UA',
                            fluid: true,
                            placeholder: computed(() => t("placeholder_enter_price", { entity: t("entity_product_gen") })),
                            required: true
                        },
                        validators: [(value) => (value ? true : "Price (UAH) is required")],
                    },
                    {
                        name: 'discount_uah',
                        code: 'discount_uah',
                        label: computed(() => t("label_discount", { currency: 'UAH' })),
                        type: 'InputNumber',
                        props: {
                            inputId: 'discount',
                            suffix: '%',
                            min: 0,
                            max: 100,
                            placeholder: computed(() => t("placeholder_enter_discount")),
                            required: false
                        },
                        validators: [(value) => (value ? true : "Discount (UAH) is required")],
                    },
                    {
                        name: 'price_usd',
                        code: 'price_usd',
                        label: computed(() => t("label_price", { entity: capitalizeFirstLetter(t("entity_product_gen")), currency: 'USD' })),
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
                        validators: [(value) => (value ? true : "Price (USD) is required")],
                    },
                    {
                        name: 'discount_usd',
                        code: 'discount_usd',
                        label: computed(() => t("label_discount", { currency: 'USD' })),
                        type: 'InputNumber',
                        props: {
                            inputId: 'discount',
                            suffix: '%',
                            min: 0,
                            max: 100,
                            placeholder: computed(() => t("placeholder_enter_discount")),
                            required: false
                        },
                        validators: [(value) => (value ? true : "Discount (USD) is required")],
                    },
                ]
            },


            {
                name: 'filters',
                code: 'filters',
                label: computed(() => t("label_related_filters")),
                type: 'AsyncTreeSelect',
                disablePropsBinding: true,
                props: {
                    restOptionsUrl: 'api/admin/filters-configuration',
                    placeholder: computed(() => t("placeholder_enter_filters")),
                    class: 'w-full product-input md:w-56',
                    required: false,
                    showClear: true,
                    fullWidth: false,
                }
            },
            {
                name: 'description',
                code: 'description',
                label: computed(() => t("label_description")),
                type: 'Editor',
                props: {
                    style: 'marginBottom: 16px;',
                    required: true,
                    fullWidth: true,
                    pt: {
                        codeBlock: {
                            style: 'display: none;',
                        },
                        image: {
                            style: 'display: none;',
                        },

                    }
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
