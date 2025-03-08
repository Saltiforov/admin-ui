export const ordersFooterActions = {
    footerActions: {
        create: [{label: 'Create new order', type: 'create', actionEventName: 'submit'}],
        edit: [
            {label: 'Cancel', type: 'cancel', actionEventName: 'cancel'},
            {label: 'Save', type: 'save', actionEventName: 'submit'}
        ]
    }
}
