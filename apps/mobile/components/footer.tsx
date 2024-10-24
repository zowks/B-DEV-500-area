import { Menu } from "~/lib/icons/Menu";
import { Menubar, MenubarMenu, MenubarItem, MenubarContent, MenubarTrigger } from "~/components/ui/menubar";
import { Pressable } from "react-native";
import { Text } from "./ui/text";
import { useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";

export default function FooterMenu() {
    const router = useRouter();
    const { t } = useTranslation();
    const [value, setValue] = useState<string>();

    const onValChange = (val: string | undefined) => setValue(val);

    return (
        <View>
            {!!value && (
                <Pressable
                    onPress={() => {
                        onValChange(undefined);
                    }}
                />
            )}
            <Menubar value={value} onValueChange={onValChange} className="m-2">
                <MenubarMenu value="menu">
                    <MenubarTrigger>
                        <Menu className="text-primary" />
                    </MenubarTrigger>
                    <MenubarContent>
                        <MenubarItem onPress={() => router.navigate("/(tabs)/dashboard")}>
                            <Text>{t("home")}</Text>
                        </MenubarItem>
                    </MenubarContent>
                </MenubarMenu>
            </Menubar>
        </View>
    );
}
