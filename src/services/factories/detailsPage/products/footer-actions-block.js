export const productsFooterActions = {
    footerActions: {
        create: [{label: 'Create new product', type: 'create', actionEventName: 'submit'}],
        edit: [
            {label: 'Cancel', type: 'cancel', actionEventName: 'cancel'},
            {label: 'Save', type: 'save', actionEventName: 'submit'}
        ]
    }
}
