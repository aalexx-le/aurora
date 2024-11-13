export const parseCurrency = (value: string) => {
    const rawValue = parseInt(value.replace(/\D/g, ""), 10) || 0;

    return rawValue;
};
