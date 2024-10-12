import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { useRouter } from "expo-router";
import { Input } from "~/components/ui/input";
import React, { useState } from "react";
import api from "@common/api/api";
import type { LoginDto } from "@common/types/auth/dto/login.dto";
import hashPassword from "~/lib/auth/hashPassword";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginPage() {
    const { t } = useTranslation();
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const enableLoginButton = () => !email || !password || password.length < 8;
    const [displayRegisterError, setDisplayLoginError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const loginUser = async () => {
        const form: LoginDto = {
            email: email,
            password: hashPassword(password)
        };
        const res = await api.auth.signIn(process.env.EXPO_PUBLIC_API_URL, form);

        if (!res.success) {
            setDisplayLoginError(true);
            switch (res.status) {
            case 400:
                setErrorMessage(t("loginError.400"));
                break;
            case 403:
                setErrorMessage(t("loginError.403"));
                break;
            case 500:
                setErrorMessage(t("loginError.500"));
                break;
            }
            return;
        }
        setDisplayLoginError(false);
        AsyncStorage.setItem("@access_token", res.body.access_token);
        router.navigate("/(tabs)/dashboard");
    };

    const handleSignupPress = () => {
        router.navigate("/(auth)/signup");
    };

    return (
        <>
            <View className="flex justify-center items-center p-6 bg-secondary/30">
                <View className="flex items-center justify-center mb-10 mt-10 w-full">
                    <Text className="font-bold text-5xl" style={{ fontSize: 50 }}>
                        AREA
                    </Text>
                </View>
                <View className="w-full max-w-sm">
                    <Text className="text-xl ml-2 mb-1 font-bold">
                        {t("login")}
                    </Text>
                    <Card className="w-full p-6 rounded-2xl">
                        <CardContent>
                            <View>
                                <View className="mb-4">
                                    <Text>Email</Text>
                                    <Input
                                        className="text-ellipsis overflow-hidden"
                                        autoComplete="email"
                                        autoFocus={true}
                                        clearButtonMode="always"
                                        inputMode="email"
                                        keyboardType="email-address"
                                        multiline={false}
                                        onChange={(e) => setEmail(e.nativeEvent.text)}
                                    />
                                </View>
                                <View>
                                    <Text>{t("password")}</Text>
                                    <Input
                                        autoComplete="current-password"
                                        clearButtonMode="always"
                                        secureTextEntry={true}
                                        multiline={false}
                                        onChange={(e) => setPassword(e.nativeEvent.text)}
                                    />
                                </View>
                            </View>
                        </CardContent>
                        <CardFooter className="flex flex-col">
                            { displayRegisterError && <Text className="text-sm text-red-600"> {errorMessage} </Text> }
                            <Button
                                className="w-full"
                                disabled={enableLoginButton()}
                                onPress={loginUser}
                            >
                                <Text>
                                    {t("login")}
                                </Text>
                            </Button>
                        </CardFooter>
                    </Card>
                </View>
                <View className="w-full max-w-sm mt-4">
                    <Text className="mb-2">
                        {t("newUser")}
                    </Text>
                    <Button onPress={handleSignupPress}>
                        <Text className="w-full text-center">
                            {t("signup")}
                        </Text>
                    </Button>
                </View>
            </View>
        </>
    );
}