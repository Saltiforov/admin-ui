import {computed, h} from "vue";
import SelectInput from "@/components/UI/SelectInput/SelectInput.vue";

export const ordersFieldsBlock = {
    fields: {
        items: [

            {
                type: 'InputText',
                props: {
                    type: 'text',
                    class: 'product-input',
                    required: true,
                },
                blockTitle: 'label_user_information',
                children: [
                    {
                        name: 'region',
                        code: 'region',
                        label: computed(() => t('label_region')),
                        type: SelectInput,
                        props: {
                            options: [
                                { label: "🇺🇦 UA", value: "ua" },
                                { label: "🇪🇺 EU", value: "eu" },
                            ],
                            placeholder: "Выберите регион",
                            filter: false,
                            multiple: false,
                            clearable: false,
                        }
                    },
                    {
                        name: 'firstName',
                        code: 'firstName',
                        label: computed(() => t('label_first_name')),
                        type: 'InputText',
                        props: {
                            side: 'right',
                            placeholder: computed(() => t("placeholder_enter_first_name")),
                        }
                    },
                    {
                        name: 'lastName',
                        code: 'lastName',
                        label: computed(() => t('label_last_name')),
                        type: 'InputText',
                        props: {
                            side: 'right',
                            placeholder: computed(() => t("placeholder_enter_last_name")),

                        }
                    },
                    {
                        name: 'email',
                        code: 'email',
                        label: computed(() => t('label_email')),
                        type: 'InputText',
                        props: {
                            type: 'text',
                            required: true,
                        },
                    },
                    {
                        name: 'phone',
                        code: 'phone',
                        label: computed(() => t('label_phone')),
                        type: 'InputText',
                        props: {
                            side: 'left',
                            type: 'tel',
                            placeholder: computed(() => t("placeholder_enter_phone")),
                            required: true,
                            onKeydown: (e) => {
                                const allowedKeys = [
                                    'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab',
                                    '+', '-', '(', ')', ' '
                                ];
                                if (
                                    !allowedKeys.includes(e.key) &&
                                    !e.key.match(/[0-9]/)
                                ) {
                                    e.preventDefault();
                                }
                            }
                        },
                        validators: [
                            (value) => (value ? true : "Phone Number is required"),
                        ],
                    },
                    {
                        name: 'telegramUsername',
                        code: 'telegramUsername',
                        label: computed(() => t('label_telegram_user')),
                        type: 'InputText',
                        props: {
                            type: 'text',
                            placeholder: computed(() => t("placeholder_enter_telegram")),
                            class: 'w-full'
                        },
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
                blockTitle: 'label_shipping_information',
                children: [
                    {
                        name: 'deliveryInfo',
                        code: 'deliveryInfo',
                        label: computed(() => t('label_delivery_info')),
                        type: 'InputText',
                        props: {
                            side: 'right',
                            placeholder: computed(() => t("placeholder_enter_delivery_service_branch_number")),
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
                        type: 'InputText',
                        props: {
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
                ]
            },
            {
                type: 'InputText',
                props: {
                    type: 'text',
                    class: 'product-input',
                    required: true,
                },
                blockTitle: 'label_discount_and_status',
                children: [
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
                            placeholder: computed(() => t("placeholder_select_status", {entity: t("entity_order_gen")})),
                            class: 'w-full md:w-56',
                            required: false
                        }
                    },
                    {
                        name: 'discount',
                        code: 'discount',
                        label: computed(() => t("label_discount")),
                        type: 'InputNumber',
                        props: {
                            inputId: 'discount',
                            useGrouping: false,
                            placeholder: computed(() => t("placeholder_enter_discount")),
                            required: false
                        }
                    },
                ]
            },


            {
                name: 'orderComment',
                code: 'orderComment',
                label: computed(() => t("comment_to_order")),
                type: 'TextArea',
                props: {
                    type: 'text',
                    required: true
                },
                // validators: [
                //     (value) => (value ? true : "Comment to the order is required"),
                // ],
            },
        ],
        header: 'title_edit_page_orders',
    }
};
