import {computed} from "vue";

export const shippingAndPaymentFieldsBlock = {
    fields: {
        items: [
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
    }
}
