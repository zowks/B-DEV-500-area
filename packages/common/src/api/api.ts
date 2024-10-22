import signUp from "./auth/signUp";
import signIn from "./auth/signIn";
import signOut from "./auth/signOut";

import me from "./users/me";

import getById from "./area/getById";
import getAll from "./area/getAll";
import patchById from "./area/patchById";
import createArea from "./area/createArea";
import deleteArea from "./area/deleteArea";

import oauth from "./oauth/oauth";
import callback from "./oauth/callback";
import credentials from "./oauth/credentials";
import revoke from "./oauth/revoke";

import about from "./about/about";

import getWebhook from "./webhooks/getWebhook";
import executeWebhook from "./webhooks/executeWebhook";

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
        signIn,
        signOut
    },
    users: {
        me
    },
    area: {
        getById,
        getAll,
        patchById,
        createArea,
        deleteArea
    },
    oauth: {
        oauth,
        callback,
        credentials,
        revoke
    },
    webhooks: {
        getWebhook,
        executeWebhook
    },
    about
};

export default api;
