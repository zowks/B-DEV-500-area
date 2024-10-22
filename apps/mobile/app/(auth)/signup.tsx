import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { useRouter } from "expo-router";
import { Input } from "~/components/ui/input";
import { Checkbox } from "~/components/ui/checkbox";
import React, { useState } from "react";
import api from "@common/api/api";
import type { RegisterDto } from "@common/types/auth/dto/register.dto";
import hashPassword from "~/lib/auth/hashPassword";

export default function SignupPage() {
    const { t } = useTranslation();
    const router = useRouter();

    const [formData, setFormData] = useState<RegisterDto>({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        has_accepted_terms_and_conditions: false
    });
    const [displayRegisterError, setDisplayRegisterError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const enablesignUpButton = () =>
        !formData.firstname ||
        !formData.lastname ||
        !formData.email ||
        !formData.password ||
        !formData.has_accepted_terms_and_conditions ||
        formData.password.length < 8;

    const signUpUser = async () => {
        const formDataCopy = {
            ...formData,
            ["password"]: hashPassword(formData.password)
        };
        const res = await api.auth.signUp(process.env.EXPO_PUBLIC_API_URL, formDataCopy);

        if (!res.success) {
            setDisplayRegisterError(true);
            switch (res.status) {
            case 400:
                setErrorMessage(t("registerError.400"));
                break;
            case 409:
                setErrorMessage(t("registerError.409"));
                break;
            case 422:
                setErrorMessage(t("registerError.422"));
                break;
            case 500:
                setErrorMessage(t("registerError.500"));
                break;
            }
            return;
        }
        setDisplayRegisterError(false);
        router.navigate("/(auth)/login");
    };

    const handleLoginPress = () => {
        router.navigate("/(auth)/login");
    };

    const handleChange = (field: keyof RegisterDto, value: string | boolean) => {
        setFormData((prevState: RegisterDto) => ({
            ...prevState,
            [field]: value
        }));
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
                        {t("signup")}
                    </Text>
                    <Card className="w-full p-6 rounded-2xl">
                        <CardContent>
                            <View>
                                <View className="mb-4">
                                    <Text>{t("name")}</Text>
                                    <Input
                                        className="text-ellipsis overflow-hidden"
                                        autoComplete="name"
                                        autoFocus={true}
                                        clearButtonMode="always"
                                        inputMode="text"
                                        multiline={false}
                                        onChange={(e) => handleChange("firstname", e.nativeEvent.text)}
                                    />
                                </View>
                                <View className="mb-4">
                                    <Text>{t("lastName")}</Text>
                                    <Input
                                        className="text-ellipsis overflow-hidden"
                                        autoComplete="family-name"
                                        clearButtonMode="always"
                                        inputMode="text"
                                        multiline={false}
                                        onChange={(e) => handleChange("lastname", e.nativeEvent.text)}
                                    />
                                </View>
                                <View className="mb-4">
                                    <Text>Email</Text>
                                    <Input
                                        className="text-ellipsis overflow-hidden"
                                        autoComplete="email"
                                        clearButtonMode="always"
                                        inputMode="email"
                                        keyboardType="email-address"
                                        multiline={false}
                                        onChange={(e) => handleChange("email", e.nativeEvent.text)}
                                    />
                                </View>
                                <View className="mb-4">
                                    <Text>{t("password")}</Text>
                                    <Input
                                        autoComplete="new-password"
                                        clearButtonMode="always"
                                        secureTextEntry={true}
                                        multiline={false}
                                        onChange={(e) => handleChange("password", e.nativeEvent.text)}
                                    />
                                </View>
                                <View className="flex flex-row">
                                    <Checkbox
                                        className="mr-2"
                                        checked={formData.has_accepted_terms_and_conditions}
                                        onCheckedChange={(value) => handleChange("has_accepted_terms_and_conditions", value)}
                                    />
                                    <Text>{t("tos")}</Text>
                                </View>
                            </View>
                        </CardContent>
                        <CardFooter className="flex flex-col">
                            { displayRegisterError && <Text className="text-sm text-red-600"> {errorMessage} </Text> }
                            <Button
                                className="w-full"
                                disabled={enablesignUpButton()}
                                onPress={signUpUser}
                            >
                                <Text>
                                    {t("signup")}
                                </Text>
                            </Button>
                        </CardFooter>
                    </Card>
                </View>
                <View className="w-full max-w-sm mt-4">
                    <Text className="mb-2">
                        {t("hasAnAccount")}
                    </Text>
                    <Button onPress={handleLoginPress}>
                        <Text className="w-full text-center">
                            {t("login")}
                        </Text>
                    </Button>
                </View>
            </View>
        </>
    );
}