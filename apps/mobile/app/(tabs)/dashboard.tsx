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
import ServiceOauth from "~/components/serviceOauth";

type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType[number];

type Services = AboutJson["server"]["services"];
type Service = ArrayElement<AboutJson["server"]["services"]>

const servicesComponents: { [key: string]: (service: Service) => React.JSX.Element } = {
    "youtube": (service: Service) => <ServiceOauth
        name="google"
        scope="https://www.googleapis.com/auth/youtube.readonly"
        color="#FF0000"
        service={service}
    />,
    "discord": (service: Service) => <ServiceOauth
        name="discord"
        scope="email"
        color="#7289da"
        service={service}
    />,
    "twitch": (service: Service) => <ServiceOauth
        name="twitch"
        scope=""
        color="#6441a5"
        service={service}
    />
};

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
                    <Text className="text-xl font-bold">{t("home")}</Text>
                    <Button onPress={logout}>
                        <Text>
                            {t("logout")}
                        </Text>
                    </Button>
                </View>
                <View>
                    {services.map((service: Services[number], index: number) => (
                        <View key={index}>
                            {servicesComponents[service.name](service)}
                        </View>
                    ))}
                </View>
            </View>
        </>
    );
}
