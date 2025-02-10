export const usersFooterActions = {
    footerActions: {
        create: [{label: 'Create new user', type: 'create', actionEventName: 'submit'}],
        edit: [
            {label: 'Cancel', type: 'cancel', actionEventName: 'cancel'},
            {label: 'Save', type: 'save', actionEventName: 'submit'}
        ]
    }
}
