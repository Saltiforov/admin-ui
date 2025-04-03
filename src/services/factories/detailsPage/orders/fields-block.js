import {computed} from "vue";
import {capitalizeFirstLetter} from "@/utils/index.js";

export const ordersFieldsBlock = {
    fields: {
        items: [
            {
                name: 'userName',
                code: 'userName',
                label: computed(() => t("label_name", { entity: capitalizeFirstLetter(t("entity_order_gen")) })),
                type: 'InputText',
                props: {
                    type: 'text',
                    placeholder: computed(() => t("placeholder_enter_name", { entity: t("entity_order_gen") })),
                    required: true
                },
                validators: [
                    // (value) => (value ? true : "Username is required"),
                    // (value) => value.length <= 100 || computed(() => t("validation_max_length", { field: t("label_name", { entity: capitalizeFirstLetter(t("entity_order_gen")) }), max: 100 }))
                ],
            },
            {
                name: 'totalAmount',
                code: 'totalAmount',
                label: computed(() => t("label_total_amount")),
                type: 'InputNumber',
                props: {
                    type: 'number',
                    placeholder: computed(() => t("placeholder_enter_total_amount")),
                    required: true
                },
                validators: [
                    (value) => (value !== null && value !== undefined ? true : "Total Amount is required"),
                ],
            },
            {
                name: 'discount',
                code: 'discount',
                label: computed(() => t("label_discount")),
                type: 'InputNumber',
                props: {
                    type: 'number',
                    placeholder: computed(() => t("placeholder_enter_discount")),
                    required: false
                }
            },
            {
                name: 'tax',
                code: 'tax',
                label: computed(() => t("label_tax")),
                type: 'InputNumber',
                props: {
                    type: 'number',
                    placeholder: computed(() => t("placeholder_enter_tax")),
                    required: false
                }
            },
            {
                name: 'orderStatus',
                code: 'orderStatus',
                label: computed(() => t("label_order_status")),
                type: 'Select',
                props: {
                    options: [
                        {label: 'Pending', value: 'pending'},
                        {label: 'Confirmed', value: 'confirmed'},
                        {label: 'Shipped', value: 'shipped'},
                        {label: 'Delivered', value: 'delivered'},
                        {label: 'Cancelled', value: 'cancelled'},
                    ],
                    optionLabel: 'label',
                    placeholder: computed(() => t("placeholder_select_status", { entity: t("entity_order_gen") })),
                    class: 'w-full md:w-56',
                    required: false
                }
            },
            {
                name: 'paymentMethod',
                code: 'paymentMethod',
                label: computed(() => t("label_payment_method")),
                type: 'Select',
                props: {
                    options: [
                        {label: 'Card', value: 'card'},
                        {label: 'Cash', value: 'cash'},
                    ],
                    optionLabel: 'label',
                    placeholder: computed(() => t("placeholder_select_payment_method")),
                    class: 'w-full md:w-56',
                    required: false
                }
            },
            {
                name: 'street',
                code: 'street',
                label: computed(() => t("label_street")),
                type: 'InputText',
                props: {
                    type: 'text',
                    placeholder: computed(() => t("placeholder_enter_street_address")),
                    required: true
                },
                validators: [
                    (value) => (value ? true : "Street is required"),
                ],
            },
            {
                name: 'city',
                code: 'city',
                label: computed(() => t("label_city")),
                type: 'InputText',
                props: {
                    type: 'text',
                    placeholder: computed(() => t("placeholder_enter_city")),
                    required: true
                },
                validators: [
                    (value) => (value ? true : "City is required"),
                ],
            },
            {
                name: 'postalCode',
                code: 'postalCode',
                label: computed(() => t("label_postal_code")),
                type: 'InputNumber',
                props: {
                    type: 'number',
                    placeholder: computed(() => t("placeholder_enter_postal_code")),
                    required: true,
                    useGrouping: false,
                },
                validators: [
                    (value) => (value ? true : "Postal Code is required"),
                ],
            },
            {
                name: 'country',
                code: 'country',
                label: computed(() => t("label_country")),
                type: 'InputText',
                props: {
                    type: 'text',
                    placeholder: computed(() => t("placeholder_enter_country")),
                    required: true
                },
                validators: [
                    (value) => (value ? true : "Country is required"),
                ],
            },
        ],
        header: computed(() => t("title_edit_page", { pageName: t("entity_order_prep") })),
    }
};
