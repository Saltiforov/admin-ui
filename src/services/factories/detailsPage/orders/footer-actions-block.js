import {computed} from "vue";
import {t} from "@/i18n/index.js";

export const ordersFooterActions = {
    footerActions: {
        create: [{label: computed(() => t("button_text_create_order")), type: 'create', actionEventName: 'submit'}],
        edit: [
            {label: computed(() => t("button_text_cancel")), type: 'cancel', actionEventName: 'cancel'},
            {label: computed(() => t("button_text_save")), type: 'save', actionEventName: 'submit'}
        ]
    }
}
