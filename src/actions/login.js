export const checkLogin = (status) => {
    return {
        type: "LOGIN",
        payload: status,
    };
}