import {computed} from "vue";
import {capitalizeFirstLetter} from "@/utils/index.js";

export const productsFieldsBlock = {
    fields: {
        items: [
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
                type: 'InputText',
                props: {
                    type: 'text',
                    class: 'product-input',
                    required: true,
                },
                blockTitle: 'About Product',
                children: [
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
                        name: 'filters',
                        code: 'filters',
                        label: computed(() => t("label_related_filters")),
                        type: 'AsyncTreeSelect',
                        disablePropsBinding: true,
                        props: {
                            restOptionsUrl: 'api/admin/filters-configuration',
                            placeholder: computed(() => t("placeholder_enter_filters")),
                            class: 'w-full product-input md:w-56',
                            selectionMode: 'multiple',
                            required: false,
                            showClear: true,
                            fullWidth: false,
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

                ]
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
                            suffix: " ₴",
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
                            placeholder: computed(() => t("placeholder_enter_discount")),
                            inputId: 'discount-uah',
                            suffix: " ₴",
                            locale: 'uk-UA',
                            fluid: true,
                            min: 0,
                            required: false
                        },
                        validators: [(value) => (value ? true : "Discount (UAH) is required")],
                    },
                    {
                        name: 'price_eur',
                        code: 'price_eur',
                        label: computed(() => t("label_price", { entity: capitalizeFirstLetter(t("entity_product_gen")), currency: 'EUR' })),
                        type: 'InputNumber',
                        props: {
                            inputId: 'currency-eur',
                            locale: 'de-DE',
                            suffix: " €",
                            fluid: true,
                            placeholder: computed(() => t("placeholder_enter_price", { entity: t("entity_product_gen") })),
                            required: true
                        },
                        validators: [(value) => (value ? true : "Price (EUR) is required")],
                    },
                    {
                        name: 'discount_eur',
                        code: 'discount_eur',
                        label: computed(() => t("label_discount", { currency: 'EUR' })),
                        type: 'InputNumber',
                        props: {
                            inputId: 'discount-eur',
                            locale: 'de-DE',
                            suffix: " €",
                            fluid: true,
                            placeholder: computed(() => t("placeholder_enter_discount")),
                            min: 0,
                            required: false
                        },
                        validators: [(value) => (value ? true : "Discount (EUR) is required")],
                    },
                ]
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
        ],
        header: "title_edit_page_products",
    }
}
