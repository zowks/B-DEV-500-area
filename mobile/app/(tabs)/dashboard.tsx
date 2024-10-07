import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import AsyncStorage from "@react-native-async-storage/async-storage";

import api from "../../common/src/api/api";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import useMount from "react-use/lib/useMount";

export default function HomePage() {
    const { t } = useTranslation();
    const router = useRouter();

    const [services, setServices] = useState<any>([{}]);

    useMount(() => {
        const aboutJson = async () => {
            const res = await api.about(process.env.EXPO_PUBLIC_API_URL as string);

            if (!res.success) {
                switch (res.status) {
                case 500:
                    break;
                }
                return;
            }
            setServices(res.body.server.services);
        };

        aboutJson();
    });

    const logout = () => {
        AsyncStorage.removeItem("@access_token");
        router.navigate("/(auth)/login");
    };


    return (
        <>
            <View className="flex-1 p-4">
                <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-xl font-bold">{t("dashboard")}</Text>
                    <Button onPress={logout}>
                        <Text>
                            {t("logout")}
                        </Text>
                    </Button>
                </View>
                <View>
                    {services.map((service: any, index: number) => (
                        <View key={index} className="p-4 m-2 bg-gray-200 rounded flex-row justify-between">
                            <Text className="text-lg font-bold">{service.name.charAt(0).toUpperCase() + service.name.slice(1)}</Text>
                            <View className="flex-row items-center">
                                <Button variant={"link"}>
                                    <Text>
                                        {t("login")}
                                    </Text>
                                </Button>
                            </View>
                        </View>
                    ))}
                </View>
            </View>
        </>
    );
}