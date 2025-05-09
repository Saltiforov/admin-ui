import {computed} from "vue";

export const productsDynamicAttrsBlock = {
    dynamicAttrs: {
        relationCode: 'attributes',
        initialPairs: [
            // {key: '', value: ''},
            // {key: '', value: ''},
            // {key: '', value: ''},
            // {key: '', value: ''}
        ],
        placeholders: {
            key: 'Key',
            value: 'Value'
        },
        buttonLabel: '+',
        header: computed(() => t("label_specification")),
        accordion: true,
    }
}
