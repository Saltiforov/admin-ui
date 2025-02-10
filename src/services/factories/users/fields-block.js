export const usersFieldsBlock = {
    fields: {
        items: [
            {
                name: 'userName',
                code: 'userName',
                label: 'User Name',
                type: 'InputText',
                props: {
                    type: 'text',
                    placeholder: 'Enter user name',
                    required: true
                }
            },
            {
                name: 'roles',
                code: 'roles',
                label: 'Roles',
                type: 'MultiSelect',
                props: {
                    options: [
                        {label: 'Admin', value: 'admin'},
                        {label: 'SuperAdmin', value: 'super Admin'},
                    ],
                    optionLabel: 'label',
                    placeholder: 'Select roles',
                    class: 'w-full md:w-56',
                    required: false
                }
            },
        ],
        header: 'Fill user information:',
    }
}
