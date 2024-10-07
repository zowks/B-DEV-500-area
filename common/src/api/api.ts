import signUp from "./auth/signUp";
import signIn from "./auth/signIn";

import me from "./users/me";

import getById from "./area/getById";
import getAll from "./area/getAll";
import patchById from "./area/patchById";

import google from "./oauth/google";

import about from "./about/about";


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
    },
    area: {
        getById,
        getAll,
        patchById
    },
    oauth: {
        google
    },
    about
};

export default api;
