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
                },
                validators: [
                    (value) => (value ? true : 'User Name is required')
                ]
            },
            {
                name: 'firstName',
                code: 'firstName',
                label: 'First Name',
                type: 'InputText',
                props: {
                    type: 'text',
                    placeholder: 'Enter first name',
                    required: true
                },
                validators: [
                    (value) => (value ? true : 'First Name is required')
                ]
            },
            {
                name: 'lastName',
                code: 'lastName',
                label: 'Last Name',
                type: 'InputText',
                props: {
                    type: 'text',
                    placeholder: 'Enter last name',
                    required: true
                },
                validators: [
                    (value) => (value ? true : 'Last Name is required')
                ]
            },
            {
                name: 'email',
                code: 'email',
                label: 'Email',
                type: 'InputText',
                props: {
                    type: 'email',
                    placeholder: 'Enter email',
                    required: true
                },
                validators: [
                    (value) => (value ? true : 'Email is required')
                ]
            },
            {
                name: 'password',
                code: 'password',
                label: 'Password',
                type: 'Password',
                props: {
                    type: 'password',
                    placeholder: 'Enter password',
                    required: true,
                    feedback: false,
                },
                validators: [
                    (value) => (value ? true : 'Password is required')
                ]
            },
            {
                name: 'roles',
                code: 'roles',
                label: 'Roles',
                type: 'MultiSelect',
                props: {
                    options: [
                        { label: 'Admin', value: 'admin' },
                        { label: 'SuperAdmin', value: 'superAdmin' },
                    ],
                    optionLabel: 'label',
                    placeholder: 'Select roles',
                    class: 'w-full md:w-56',
                    required: false
                }
            },
            {
                name: 'phone',
                code: 'phone',
                label: 'Phone',
                type: 'InputText',
                props: {
                    type: 'tel',
                    placeholder: 'Enter phone number',
                    required: false
                }
            },
            {
                name: 'address.street',
                code: 'address.street',
                label: 'Street',
                type: 'InputText',
                props: {
                    type: 'text',
                    placeholder: 'Enter street address',
                    required: false
                }
            },
            {
                name: 'address.city',
                code: 'address.city',
                label: 'City',
                type: 'InputText',
                props: {
                    type: 'text',
                    placeholder: 'Enter city',
                    required: false
                }
            },
            {
                name: 'address.postalCode',
                code: 'address.postalCode',
                label: 'Postal Code',
                type: 'InputText',
                props: {
                    type: 'text',
                    placeholder: 'Enter postal code',
                    required: false
                }
            },
            {
                name: 'address.country',
                code: 'address.country',
                label: 'Country',
                type: 'InputText',
                props: {
                    type: 'text',
                    placeholder: 'Enter country',
                    required: false
                }
            }
        ],
        header: 'Fill user information:'
    }
}
