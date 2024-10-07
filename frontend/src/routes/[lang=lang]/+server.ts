import { redirect } from "@sveltejs/kit";

export async function GET({ locals: { locale } }) {
    redirect(303, `/${locale}/dashboard`);
}
