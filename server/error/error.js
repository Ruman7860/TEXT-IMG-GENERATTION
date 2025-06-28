export const errorHandler = (statusCode,errorMessage) => {
    const error = new Error();
    error.statusCode = statusCode;
    error.errorMessage = errorMessage;

    return error;
}