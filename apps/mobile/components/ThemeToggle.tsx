import AsyncStorage from "@react-native-async-storage/async-storage";
import { View } from "react-native";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";
import { MoonStar } from "~/lib/icons/MoonStar";
import { Sun } from "~/lib/icons/Sun";
import { useColorScheme } from "~/lib/useColorScheme";
import { cn } from "~/lib/utils";
import { Button } from "./ui/button";

export function ThemeToggle() {
    const { isDarkColorScheme, setColorScheme } = useColorScheme();

    const changeTheme = () => {
        const newTheme = isDarkColorScheme ? "light" : "dark";
        setColorScheme(newTheme);
        setAndroidNavigationBar(newTheme);
        AsyncStorage.setItem("theme", newTheme);
    };

    return (
        <Button
            onPress={() => changeTheme()}
            variant="outline"
            size="icon"
            className={cn(
                "mt-2 mr-1",
                "web:ring-offset-background web:transition-colors web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2"
            )}
        >
            <View
                className={cn(
                    "flex-1 aspect-square pt-0.5 justify-center items-center web:px-5 text-center"
                )}
            >
                {isDarkColorScheme ? (
                    <MoonStar className='text-foreground' size={23} strokeWidth={1.25} />
                ) : (
                    <Sun className='text-foreground' size={24} strokeWidth={1.25} />
                )}
            </View>
        </Button>
    );
}
