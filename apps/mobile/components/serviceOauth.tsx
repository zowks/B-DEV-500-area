import React, { useState, useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import api from "@common/api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform, Pressable } from "react-native";
import { Text } from "./ui/text";
import { AboutJson } from "area-common/src/types/about/interfaces/about.interface";

WebBrowser.maybeCompleteAuthSession();

type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType[number];
type Service = ArrayElement<AboutJson["server"]["services"]>;

function getRedirectUri() {
    return AuthSession.makeRedirectUri({
        preferLocalhost: Platform.OS === "android" || Platform.OS === "ios" ? process.env.EXPO_PUBLIC_NODE_ENV !== "production" : false,
        scheme: "area51",
        path: "callback"
    });
}

type ServiceOauthProps = {
    name: string
    scope: string
    color: `#${string}`
    service: Service
}

export default function ServiceOauth(props: ServiceOauthProps) {
    const { service } = props;
    const [isPressed, setIsPressed] = useState(false);
    // const [isDisabled, setIsDisabled] = useState(false);


    useEffect(() => {
        getCredentials();
    }, []);

    const getCredentials = async () => {
        const token = await AsyncStorage.getItem("@access_token");
        if (!token)
            return;

        const res = await api.oauth.credentials(process.env.EXPO_PUBLIC_API_URL, props.name, token);

        if (!res.success) {
            switch (res.status) {
            case 401:
                console.error("You are currently not connected.");
                break;
            case 500:
                console.error("An internal error happened.");
            }
            return;
        }
        // goal is to disable the connection button only if the user is already logged in to this service but I might not do it this way
        // if (Array.isArray(res.body) && res.body.length)
        //     setIsDisabled(true);
    };

    const fetchOauthUrl = async () => {
        const token = await AsyncStorage.getItem("@access_token");
        if (!token)
            return;

        const redirectUri = getRedirectUri();
        const res = await api.oauth.oauth(process.env.EXPO_PUBLIC_API_URL, props.name, { redirect_uri: redirectUri, scope: props.scope }, token);

        if (!res.success) {
            switch (res.status) {
            case 401:
                console.error("You are not logged in.");
                break;
            case 500:
                console.error("An internal error happened.");
                break;
            }
            return;
        }

        await WebBrowser.openAuthSessionAsync(res.body.redirect_uri, redirectUri);
    };

    const getColor = (color: string, percentage: number) => {
        const num = parseInt(color.slice(1), 16);
        const amt = Math.round(2.55 * percentage);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        const newColor = (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1).toUpperCase();
        return `#${newColor}`;
    };

    return (
        <Pressable
            onPress={fetchOauthUrl}
            onPressIn={() => setIsPressed(true)}
            onPressOut={() => setIsPressed(false)}
            disabled={false} // use isDisabled when needed
            style={{
                backgroundColor: isPressed ? getColor(props.color, 20) : getColor(props.color, 30),
                borderColor: props.color,
                borderWidth: 4,
                padding: 16,
                borderRadius: 8,
                margin: 8
            }}
            className="items-center justify-center"
        >
            <Text className="text-3xl font-semibold">
                {service.name.at(0)?.toUpperCase()}{service.name.slice(1)}
            </Text>
        </Pressable>
    );
}
