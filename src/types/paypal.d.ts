interface PayPalCreateOrderData {
    orderID?: string;
}

interface PayPalOnApproveActions {
    restart?: () => Promise<void>;
}

interface PayPalButtonsComponent {
    isEligible: () => boolean;
    render: (container: HTMLElement) => Promise<void>;
    close?: () => Promise<void>;
}

interface PayPalButtonsOptions {
    style?: {
        layout?: 'vertical' | 'horizontal';
        shape?: 'rect' | 'pill';
        label?: 'paypal' | 'checkout' | 'pay';
    };
    createOrder?: () => Promise<string> | string;
    onApprove?: (data: PayPalCreateOrderData, actions: PayPalOnApproveActions) => Promise<void> | void;
    onCancel?: () => void;
    onError?: (error: unknown) => void;
}

interface PayPalNamespace {
    Buttons: (options: PayPalButtonsOptions) => PayPalButtonsComponent;
}

interface Window {
    paypal?: PayPalNamespace;
}
