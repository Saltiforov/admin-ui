import {computed} from "vue";
import {capitalizeFirstLetter} from "@/utils/index.js";

export const usersFieldsBlock = {
    fields: {
        items: [
            {
                name: 'username',
                code: 'username',
                label: computed(() => t("label_name", { entity: capitalizeFirstLetter(t("entity_user_gen")) })),
                type: 'InputText',
                props: {
                    type: 'text',
                    placeholder: computed(() => t("placeholder_enter_name", { entity: t("entity_user_gen") })),
                    required: true
                },
                validators: [
                    (value) => (value ? true : 'User Name is required')
                ]
            },
            {
                name: 'firstName',
                code: 'firstName',
                label: computed(() => t("label_first_name")),
                type: 'InputText',
                props: {
                    type: 'text',
                    placeholder: computed(() => t("placeholder_enter_first_name")),
                    required: true
                },
                validators: [
                    (value) => (value ? true : 'First Name is required')
                ]
            },
            {
                name: 'lastName',
                code: 'lastName',
                label: computed(() => t("label_last_name")),
                type: 'InputText',
                props: {
                    type: 'text',
                    placeholder: computed(() => t("placeholder_enter_last_name")),
                    required: true
                },
                validators: [
                    (value) => (value ? true : 'Last Name is required')
                ]
            },
            {
                name: 'email',
                code: 'email',
                label: computed(() => t("label_email")),
                type: 'InputText',
                props: {
                    type: 'email',
                    placeholder: computed(() => t("placeholder_enter_email")),
                    required: true
                },
                validators: [
                    (value) => (value ? true : 'Email is required')
                ]
            },
            {
                name: 'password',
                code: 'password',
                label: computed(() => t("label_password")),
                type: 'InputText',
                props: {
                    type: 'password',
                    placeholder: computed(() => t("placeholder_enter_password")),
                    required: true,
                    feedback: true,
                },
            },
            {
                name: 'roles',
                code: 'roles',
                label: computed(() => t("label_roles")),
                type: 'MultiSelect',
                props: {
                    options: [
                        { label: 'Admin', value: 'admin' },
                        { label: 'SuperAdmin', value: 'superAdmin' },
                    ],
                    optionLabel: 'label',
                    placeholder: computed(() => t("placeholder_select_roles")),
                    class: 'w-full md:w-56',
                    required: false
                }
            },
            {
                name: 'phone',
                code: 'phone',
                label: computed(() => t("label_phone")),
                type: 'InputText',
                props: {
                    type: 'tel',
                    placeholder: computed(() => t("placeholder_enter_phone")),
                    required: false
                }
            },
            {
                name: 'telegramUsername',
                code: 'telegramUsername',
                label: computed(() => t('label_telegram_user')),
                type: 'InputText',
                props: {
                    type: 'text',
                    class: 'w-full'
                },
            },

            {
                name: 'street',
                code: 'street',
                label: computed(() => t("label_street")),
                type: 'InputText',
                props: {
                    type: 'text',
                    placeholder: computed(() => t("placeholder_enter_street_address")),
                    required: false
                }
            },
            {
                name: 'city',
                code: 'city',
                label: computed(() => t("label_city")),
                type: 'InputText',
                props: {
                    type: 'text',
                    placeholder: computed(() => t("placeholder_enter_city")),
                    required: false
                }
            },
            {
                name: 'postalCode',
                code: 'postalCode',
                label: computed(() => t("label_postal_code")),
                type: 'InputText',
                props: {
                    type: 'text',
                    placeholder: computed(() => t("placeholder_enter_postal_code")),
                    required: false
                }
            },
            {
                name: 'country',
                code: 'country',
                label: computed(() => t("label_country")),
                type: 'InputText',
                props: {
                    type: 'text',
                    placeholder: computed(() => t("placeholder_enter_country")),
                    required: false
                }
            }
        ],
        header: 'title_edit_page',
    }
}
