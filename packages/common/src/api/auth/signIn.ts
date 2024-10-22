import type { RequestResponse } from "../api";
import type { LoginDto, LoginResponseDto } from "../../types/auth/dto/login.dto";

export default async function signIn(apiUrl: string, payload: LoginDto): Promise<RequestResponse<LoginResponseDto, 200 | 400 | 403>> {
    try {
        const response = await fetch(`${apiUrl}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        switch (response.status) {
        case 200:
            return { status: 200, success: true, body: await response.json() };
        case 400:
            return { status: 400, success: false }; // Some of the fields are incorrect.
        case 403:
            return { status: 403, success: false }; // Either the email or password or both are invalid.
        default:
            console.error(response);
            return { status: 500, success: false };
        }
    } catch (error) {
        console.error(error);
        return { status: 500, success: false };
    }
}
