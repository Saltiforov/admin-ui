import {computed} from "vue";
import {capitalizeFirstLetter} from "@/utils/index.js";

export const deliveryAndPaymentFieldsBLock = {
    fields: {
        items: [
            {
                name: 'slug',
                code: 'slug',
                label: computed(() => t("slug", { entity: capitalizeFirstLetter(t("entity_product_gen")) })),
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
                name: 'title',
                code: 'title',
                label: computed(() => t("title", { entity: capitalizeFirstLetter(t("entity_product_gen")) })),
                type: 'InputText',
                props: {
                    type: 'text',
                    class: 'product-input',
                    placeholder: computed(() => t("placeholder_enter_name", { entity: t("entity_product_gen") })),
                    required: true
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
