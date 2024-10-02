import * as axios from "axios";
import { Injectable } from "@nestjs/common";
import { AreaYouTubeVideo } from "src/polling/youtube/interfaces/youtube-video.interface";
import { Reaction } from "src/area/interfaces/services.interface";

@Injectable()
export class DiscordService implements Reaction {
    constructor() {}

    get triggers() {
        return {
            send_message: this.sendMessage
        };
    }

    static get endpoints() {
        return ["send_message"];
    }

    sendMessage(
        webhookUrl: string,
        fields: { [k: string]: string },
        data: AreaYouTubeVideo
    ): Promise<void> {
        const embed = {
            type: "rich"
        };
        for (const [_from, _to] of Object.entries(fields)) {
            switch (_to) {
                case "thumbnail":
                case "image":
                    embed[_to] = { url: data[_from] };
                    break;
                case "author":
                    embed[_to] = { name: data[_from] };
                    break;
                default:
                    embed[_to] = data[_from];
            }
        }

        return axios.default.post(
            webhookUrl,
            {
                embeds: [embed]
            },
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
    }
}
