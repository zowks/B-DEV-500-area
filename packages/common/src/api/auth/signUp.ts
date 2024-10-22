import type { RequestResponse, Empty } from "../api";
import type { RegisterDto } from "../../types/auth/dto/register.dto";

export default async function signUp(apiUrl: string, payload: RegisterDto): Promise<RequestResponse<Empty, 201 | 400 | 409 | 422>> {
    try {
        const response = await fetch(`${apiUrl}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        switch (response.status) {
        case 201:
            return { status: 201, success: true, body: {} };
        case 400:
            return { status: 400, success: false }; // Some of the fields are incorrect.
        case 409:
            return { status: 409, success: false }; // The email is already taken.
        case 422:
            return { status: 422, success: false }; // All fields match their criteria, but the user did not accept the terms and conditions.
        default:
            console.error(response);
            return { status: 500, success: false };
        }
    } catch (error) {
        console.error(error);
        return { status: 500, success: false };
    }
}
