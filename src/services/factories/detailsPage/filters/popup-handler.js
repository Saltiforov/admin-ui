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
            },
            {
                code: "name.en",
                component: "InputText",
                props: {
                    type: "text",
                    placeholder: computed(() => t("placeholder_filter_popup_name_en")),
                    style: "width: 100%; margin-bottom: 15px"
                },
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