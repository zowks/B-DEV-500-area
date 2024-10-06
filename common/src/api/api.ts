import signUp from "./auth/signUp";
import signIn from "./auth/signIn";
import me from "./users/me";

type RequestResponseStatus<T> = {
    status: T;
};

type RequestResponseSuccess<T> = {
    success: true;
    body: T;
};

type RequestResponseFail = {
    success: false;
};

type RequestResponse500 = {
    status: 500;
    success: false;
}

export type RequestResponse<Body, Status extends number = number> =
    | (RequestResponseStatus<Status> & (RequestResponseSuccess<Body> | RequestResponseFail))
    | RequestResponse500;

export type Empty = Record<PropertyKey, never>;

const api = {
    auth: {
        signUp,
        signIn
    },
    users: {
        me
    }
};

export default api;