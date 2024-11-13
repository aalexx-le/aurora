export const getGraphqlErrorMessage = (error: unknown): string => {
    return (
        JSON.parse(JSON.stringify(error))?.message ||
        "An undefined error occurred"
    );
};
