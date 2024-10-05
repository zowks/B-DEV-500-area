import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { useRouter } from "expo-router";
import { Input } from "~/components/ui/input";
import { Checkbox } from "~/components/ui/checkbox";
import React, { useState } from "react";

export default function SignupPage() {
    const { t } = useTranslation();
    const router = useRouter();

    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [tosValidated, setTosValidated] = useState(false);

    const enableLoginButton = () => !name || !lastName || !email || !password || !tosValidated || password.length < 8;

    const loginUser = () => {
        console.log(name, lastName, email, password);
    };

    const handleLoginPress = () => {
        router.navigate("/(auth)/login");
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
                                        onChange={(e) => setName(e.nativeEvent.text)}
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
                                        onChange={(e) => setLastName(e.nativeEvent.text)}
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
                                        onChange={(e) => setEmail(e.nativeEvent.text)}
                                    />
                                </View>
                                <View className="mb-4">
                                    <Text>{t("password")}</Text>
                                    <Input
                                        autoComplete="new-password"
                                        clearButtonMode="always"
                                        secureTextEntry={true}
                                        multiline={false}
                                        onChange={(e) => setPassword(e.nativeEvent.text)}
                                    />
                                </View>
                                <View className="flex flex-row">
                                    <Checkbox className="mr-2" checked={tosValidated} onCheckedChange={setTosValidated}></Checkbox>
                                    <Text>{t("tos")}</Text>
                                </View>
                            </View>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full"
                                disabled={enableLoginButton()}
                                onPress={loginUser}
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