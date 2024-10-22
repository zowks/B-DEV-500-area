import { ActionResource } from "./services/interfaces/service.interface";

export function transformer(
    input: ActionResource["data"],
    output: object
): object {
    const inputKeys = Object.keys(input);
    const outputKeys = Object.keys(output);
    const result = { ...output };

    for (const outputKey of outputKeys)
        for (const inputKey of inputKeys)
            if (typeof result[outputKey] === "string")
                result[outputKey] = result[outputKey].replace(
                    `{{${inputKey}}}`,
                    input[inputKey]
                );
    return result;
}
