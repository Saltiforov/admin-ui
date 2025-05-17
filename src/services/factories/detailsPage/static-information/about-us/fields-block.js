import {computed} from "vue";
import {capitalizeFirstLetter} from "@/utils/index.js";
import UserSelect from "@/components/UI/UserSelect/UserSelect.vue";

export const aboutUsFieldsBlock = {
    fields: {
        items: [
            {
                name: 'slug',
                code: 'slug',
                label: computed(() => t('slug')),
                type: 'InputText',
                props: {
                    type: 'text',
                    class: 'product-input',
                    placeholder: computed(() => t("placeholder_enter_name", { entity: t("entity_product_gen") })),
                    required: true,
                    disabled: true
                },
            },
            {
                name: 'userSelect',
                code: 'userSelect',
                label: computed(() => t("display_type_label")),
                type: 'Select',
                props: {
                    options: [
                        { label: computed(() => t('without_accordion')) , value: 'plain' },
                        { label: computed(() => t('accordion')) , value: 'accordion' }
                    ],
                    optionLabel: 'label',
                    placeholder: computed(() => t("placeholder_select_roles")),
                    class: 'w-full md:w-56',
                    required: false
                }
            },
            {
                name: 'title',
                code: 'title',
                label: computed(() => t("title", { entity: capitalizeFirstLetter(t("entity_product_gen")) })),
                type: 'InputText',
                props: {
                    type: 'text',
                    class: 'product-input',
                    placeholder: computed(() => t("placeholder_enter_name", { entity: t("entity_product_gen") })),
                    required: true,
                    fullWidth: true
                },
            },
            {
                name: 'content',
                code: 'content',
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
    }
}
