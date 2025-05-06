import {computed, h} from "vue";
import {capitalizeFirstLetter} from "@/utils/index.js";
import {InputGroup, InputGroupAddon} from "primevue";
import InputNumber from "primevue/inputnumber";

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
                name: 'firstName',
                code: 'firstName',
                label: computed(() => t('label_first_name')),
                type: 'InputText',
                props: {
                    side: 'left',
                    type: 'text',
                    placeholder: "",
                    required: true
                },
                validators: [
                    (value) => (value ? true : "First Name is required"),
                ],
            },
            {
                name: 'lastName',
                code: 'lastName',
                label: computed(() => t('label_last_name')),
                type: 'InputText',
                props: {
                    type: 'text',
                    placeholder: "",
                    required: true
                },
                validators: [
                    (value) => (value ? true : "Last Name is required"),
                ],
            },
            {
                name: 'email',
                code: 'email',
                label: computed(() => t('label_email')),
                type: 'InputText',
                props: {
                    side: 'left',
                    type: 'text',
                    placeholder: "",
                    required: true
                },
                validators: [
                    (value) => (value ? true : "Email is required"),
                ],
            },
            {
                name: 'phone',
                code: 'phone',
                label: computed(() => t('label_phone')),
                type: 'Custom',
                props: {
                    side: 'left',
                },
                validators: [
                    (value) => (value ? true : "Phone is required"),
                    (value) => (value?.toString().length <= 11 ? true : "Phone number must be no more than 11 digits")
                ],
                render: ({modelValue, 'onUpdate:modelValue': update}) =>
                    h(InputGroup, {}, {
                        default: () => [
                            h(InputGroupAddon, {
                                pt: {
                                    root: {
                                        style: {
                                            backgroundColor: 'white',
                                            color: 'black',
                                        }
                                    }
                                }
                            }, () => '+380'),
                            h(InputNumber, {
                                modelValue,
                                'onUpdate:modelValue': update,
                                useGrouping: false,
                                placeholder: '',
                                defaultValue: null
                            })
                        ]
                    })
            },
            {
                name: 'telegramUsername',
                code: 'telegramUsername',
                label: computed(() => t('label_telegram_user')),
                type: 'InputText',
                props: {
                    type: 'text',
                    placeholder: "",
                    class: 'w-full'
                },
            },
            {
                name: 'deliveryInfo',
                code: 'deliveryInfo',
                label: computed(() => t('label_delivery_info')),
                type: 'InputText',
                props: {
                    side: 'right',
                    placeholder: ''
                }
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
                // validators: [
                //     (value) => (value !== null && value !== undefined ? true : "Total Amount is required"),
                // ],
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
            {
                name: 'promoCode',
                code: 'promoCode',
                label: computed(() => t("label_promo_code")),
                type: 'InputText',
                props: {
                    type: 'text',
                    required: true
                },
            },
            {
                name: 'sms',
                code: 'sms',
                label: computed(() => t("label_sms")),
                type: 'Select',
                props: {
                    options: [
                        {label: 'Send', value: 'true'},
                        {label: 'Do not send', value: 'false'},
                    ],
                    optionLabel: 'label',
                    class: 'w-full md:w-56',
                    required: false
                }
            },
            {
                name: 'cashOnDelivery',
                code: 'cashOnDelivery',
                label: computed(() => t("label_cash_on_delivery")),
                type: 'Select',
                props: {
                    options: [
                        {label: 'Send', value: 'true'},
                        {label: 'Do not send', value: 'false'},
                    ],
                    optionLabel: 'label',
                    class: 'w-full md:w-56',
                    required: false
                }
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
                validators: [
                    (value) => (value ? true : "Comment to the order is required"),
                ],
            },
        ],
        header: computed(() => t("title_edit_page", { pageName: t("entity_order_prep") })),
    }
};
