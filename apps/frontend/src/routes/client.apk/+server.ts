import path from "node:path";
import fs from "node:fs";
import { error } from "@sveltejs/kit";

export async function GET() {
    try {
        const apkPath = path.resolve("static/apk/client.apk");
        const apkContent = fs.readFileSync(apkPath);

        return new Response(apkContent, {
            headers: {
                "Content-Type": "application/vnd.android.package-archive",
                "Content-Disposition": "attachment; filename=\"client.apk\""
            }
        });
    } catch {
        error(404, "File not found");
    }
}
