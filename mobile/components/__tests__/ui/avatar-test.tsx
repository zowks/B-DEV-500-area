import { render } from "@testing-library/react-native";

import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Text } from "~/components/ui/text";

describe("<Avatar />", () => {
    test("AvatarFallback renders when no AvatarImage is provided to Avatar", () => {
        const { getByText } = render(
            <Avatar alt="Hello, World! I'm Avatar alt." className='w-24 h-24'>
                <AvatarFallback>
                    <Text>Hello, World! I'm AvatarFallback.</Text>
                </AvatarFallback>
            </Avatar>
        );

        getByText("Hello, World! I'm AvatarFallback.");
    });

    test("Avatar without AvatarImage renders correctly", () => {
        const tree = render(
            <Avatar alt="Hello, World! I'm Avatar alt." className='w-24 h-24'>
                <AvatarFallback>
                    <Text>Hello, World! I'm AvatarFallback.</Text>
                </AvatarFallback>
            </Avatar>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });
});
