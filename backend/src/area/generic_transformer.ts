import { ActionResource } from "./services/interfaces/service.interface";

export function transformer(input: ActionResource["data"], output: object): object {
    const inputKeys = Object.keys(input);
    const outputKeys = Object.keys(output);

    for (const outputKey of outputKeys)
        for (const inputKey of inputKeys)
            if (typeof output[outputKey] === "string")
                output[outputKey] = output[outputKey].replace(
                    `{{${inputKey}}}`,
                    input[inputKey]
                );
    return output;
}
