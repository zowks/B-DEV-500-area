import React, { useState } from "react";
import useMount from "react-use/lib/useMount";
import { useRouter } from "expo-router";
import { View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import api from "@common/api/api";
import type { AboutJson } from "@common/types/about/interfaces/about.interface";

type Services = AboutJson["server"]["services"];

export default function HomePage() {
    const { t } = useTranslation();
    const router = useRouter();

    const [services, setServices] = useState<Services>([]);

    useMount(async () => {
        const res = await api.about(process.env.EXPO_PUBLIC_API_URL);

        if (!res.success) {
            switch (res.status) {
            case 500:
                break;
            }
            return;
        }
        setServices(res.body.server.services);
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
                    {services.map((service: Services[number], index: number) => (
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
