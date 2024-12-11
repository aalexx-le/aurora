export const formatCurrency = (
    value: number,
    currency: string,
    options: Intl.NumberFormatOptions = {},
) => {
    return new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency,
        ...options,
    }).format(value);
};
