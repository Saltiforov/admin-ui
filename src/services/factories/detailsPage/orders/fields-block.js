import {computed, h} from "vue";
import UserSelect from "@/components/UI/UserSelect/UserSelect.vue";
import InputGroup from "primevue/inputgroup";
import InputGroupAddon from "primevue/inputgroupaddon";
import InputNumber from "primevue/inputnumber";
import {capitalizeFirstLetter} from "@/utils/index.js";

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
                        name: 'userSelect',
                        code: 'userSelect',
                        label: computed(() => t("label_select_user")),
                        type: UserSelect,
                        disablePropsBinding: true,
                        props: {
                            restOptionsUrl: 'api/admin/users',
                            selectionMode: 'multiple',
                            class: 'w-full product-input md:w-56',
                            required: false,
                            showClear: true,
                            fullWidth: false,
                        }
                    },
                    {
                        name: 'firstName',
                        code: 'firstName',
                        label: computed(() => t('label_first_name')),
                        type: 'InputText',
                        props: {
                            side: 'right',
                            placeholder: '',
                            disabled: true
                        }
                    },
                    {
                        name: 'lastName',
                        code: 'lastName',
                        label: computed(() => t('label_last_name')),
                        type: 'InputText',
                        props: {
                            side: 'right',
                            placeholder: '',
                            disabled: true
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
                            disabled: true
                        },
                    },
                    {
                        name: 'phone',
                        code: 'phone',
                        label: computed(() => t('label_phone')),
                        type: 'Custom',
                        props: {
                            side: 'left',
                            disabled: true

                        },
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
                                        defaultValue: null,
                                        disabled: true
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
                            disabled: true,
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
                blockTitle: 'label_payment_information',
                children: [
                    {
                        name: 'paymentMethod',
                        code: 'paymentMethod',
                        label: computed(() => t("label_payment_method")),
                        type: 'Select',
                        props: {
                            options: [
                                {label: 'Відправити SMS по вказаних данних', value: 'send_sms'},
                                {label: 'Накладений платіж', value: 'cash_on_delivery'},
                            ],
                            optionLabel: 'label',
                            placeholder: computed(() => t("placeholder_select_payment_method")),
                            class: 'w-full md:w-56',
                            required: false
                        }
                    },
                    {
                        name: 'promoCode',
                        code: 'promoCode',
                        label: computed(() => t("label_promo_code")),
                        type: 'InputText',
                        props: {
                            type: 'text',
                            placeholder: computed(() => t("placeholder_enter_promo_code")),
                            required: true
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
                            min: 0,
                            max: 100,
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
