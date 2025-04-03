import {computed} from "vue";
import {t} from "@/i18n/index.js";
import {capitalizeFirstLetter} from "@/utils/index.js";

export const usersFieldsBlock = {
    fields: {
        items: [
            {
                name: 'userName',
                code: 'userName',
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
                validators: [
                    (value) => (value ? true : 'Password is required')
                ]
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
                name: 'address.street',
                code: 'address.street',
                label: computed(() => t("label_street")),
                type: 'InputText',
                props: {
                    type: 'text',
                    placeholder: computed(() => t("placeholder_enter_street_address")),
                    required: false
                }
            },
            {
                name: 'address.city',
                code: 'address.city',
                label: computed(() => t("label_city")),
                type: 'InputText',
                props: {
                    type: 'text',
                    placeholder: computed(() => t("placeholder_enter_city")),
                    required: false
                }
            },
            {
                name: 'address.postalCode',
                code: 'address.postalCode',
                label: computed(() => t("label_postal_code")),
                type: 'InputText',
                props: {
                    type: 'text',
                    placeholder: computed(() => t("placeholder_enter_postal_code")),
                    required: false
                }
            },
            {
                name: 'address.country',
                code: 'address.country',
                label: computed(() => t("label_country")),
                type: 'InputText',
                props: {
                    type: 'text',
                    placeholder: computed(() => t("placeholder_enter_country")),
                    required: false
                }
            }
        ],
        header: computed(() => t("title_edit_page", { pageName: t("entity_user_gen") })),
    }
}
