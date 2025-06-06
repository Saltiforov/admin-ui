import {computed} from "vue";

export const usersFooterActions = {
    footerActions: {
        create: [{label: computed(() => t("button_text_create_user")), type: 'create', actionEventName: 'submit'}],
        edit: [
            {label: computed(() => t("button_text_cancel")), type: 'cancel', actionEventName: 'cancel'},
            {label: computed(() => t("button_text_save")), type: 'save', actionEventName: 'submit'}
        ]
    }
}
