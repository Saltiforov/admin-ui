import {computed} from "vue";

export const confirmProductsOptions = {
    confirmHeader: computed(() => t("confirm_delete_title")),
    rejectLabel: computed(() => t("button_text_cancel")),
    acceptLabel: computed(() => t("button_text_delete")),
    acceptToastSummary: computed(() => t("confirm_accept_message_summary")),
    rejectToastSummary: computed(() => t("confirm_reject_message_summary")),
    rejectToastDetail: computed(() => t("confirm_reject_message")),
};