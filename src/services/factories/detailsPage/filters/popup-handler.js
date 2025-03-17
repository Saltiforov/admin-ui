export const filtersPopups = {
    filterConfiguratorTablePopup: {
        fields: [
            {
                code: "name.uk",
                component: "InputText",
                props: {type: "text", placeholder: "Name (UA)", style: "width: 100%; margin-bottom: 15px"},
                validators: [(value) => (value ? true : "Name (UA) is required")],
            },
            {
                code: "name.ru",
                component: "InputText",
                props: {type: "text", placeholder: "Name (RU)", style: "width: 100%; margin-bottom: 15px"},
                validators: [(value) => (value ? true : "Name (RU) is required")],
            },
            {
                code: "code",
                component: "InputText",
                props: {type: "text", placeholder: "Unique Code", style: "width: 100%; margin-bottom: 15px"},
                validators: [
                    (value) => (value ? true : "Code is required"),
                    (value) => /^[a-zA-Z0-9-_]+$/.test(value) || "Code can only contain English letters",
                ],
            },
            {
                code: "description",
                component: "TextArea",
                props: {type: "text", placeholder: "Description", style: "width: 100%; margin-bottom: 15px"},
                validators: [
                    (value) => (value ? true : "Description is required"),
                ],
            },
            {
                code: "icon",
                component: "FileUpload",
                props: {
                    accept: "image/svg+xml",
                    placeholder: "Upload SVG File",
                    style: "width: 100%; margin-bottom: 15px",
                    mode: "basic",
                },
                defaultValue: null
            },
        ]
    },
}