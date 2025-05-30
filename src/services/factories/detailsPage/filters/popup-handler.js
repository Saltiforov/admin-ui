import {computed} from "vue";

export const filtersPopups = {
    filterConfiguratorTablePopup: {
        fields: [
            {
                code: "name.uk",
                component: "InputText",
                props: {
                    type: "text",
                    placeholder: computed(() => t("placeholder_filter_popup_name_ua")),
                    style: "width: 100%; margin-bottom: 15px"
                },
                validators: [
                    (value) => (value ? true : computed(() => t("validation_is_required", {field: t("placeholder_filter_popup_name_ua")}))),
                    (value) => value.length <= 100 || computed(() => t("validation_max_length", { field: t("placeholder_filter_popup_name_ua"), max: 100 }))
                ],

            },
            {
                code: "name.en",
                component: "InputText",
                props: {
                    type: "text",
                    placeholder: computed(() => t("placeholder_filter_popup_name_en")),
                    style: "width: 100%; margin-bottom: 15px"
                },
                validators: [
                    (value) => (value ? true : computed(() => t("validation_is_required", {field: t("placeholder_filter_popup_name_en")}))),
                    (value) => value.length <= 100 || computed(() => t("validation_max_length", { field: t("placeholder_filter_popup_name_en"), max: 100 }))
                ],
            },
            {
                code: "code",
                component: "InputText",
                props: {
                    type: "text",
                    placeholder: computed(() => t("placeholder_filter_popup_unique_code")),
                    style: "width: 100%; margin-bottom: 15px"
                },
                validators: [
                    (value) => (value ? true : computed(() => t("validation_is_required", {field: t("placeholder_filter_popup_unique_code")}))),
                    (value) => value.length <= 50 || computed(() => t("validation_max_length", { field: t("placeholder_filter_popup_unique_code"), max: 50 })),
                    (value) => /^[a-zA-Z0-9-_]+$/.test(value) || computed(() => t("validation_only_english_letters", { field: t("placeholder_filter_popup_unique_code") })),
                ],
            },
            {
                code: "description",
                component: "TextArea",
                props: {
                    type: "text",
                    placeholder: computed(() => t("placeholder_description")),
                    style: "width: 100%; margin-bottom: 15px"
                },
                validators: [
                    (value) => (value ? true : computed(() => t("validation_is_required", {field: t("placeholder_description")}))),
                    (value) => value.length <= 500 || computed(() => t("validation_max_length", { field: t("placeholder_description"), max: 500 })),
                ],
            },
            {
                code: "icon",
                component: "FileUpload",
                props: {
                    accept: "image/svg+xml",
                    chooseLabel: computed(() => t("filter_popup_button_text_upload")),
                    style: "width: 100%; margin-bottom: 15px",
                    mode: "basic",
                },
                defaultValue: null
            },
        ]
    },
}