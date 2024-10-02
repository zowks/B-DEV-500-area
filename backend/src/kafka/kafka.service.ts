import { Injectable } from "@nestjs/common";
import {
    Consumer,
    EachMessagePayload,
    Kafka,
    logLevel,
    Message,
    Producer
} from "kafkajs";

@Injectable()
export class KafkaService {
    private readonly kafka: Kafka;
    private readonly producer: Producer;
    private readonly consumer: Consumer;

    constructor() {
        this.kafka = new Kafka({
            clientId: "nodejs-kafka",
            brokers: ["localhost:9093"],
            logLevel: logLevel.DEBUG
        });
        this.producer = this.kafka.producer();
        this.consumer = this.kafka.consumer({ groupId: "area" });
    }

    async produce(topic: string, message: Message) {
        await this.producer.connect();

        try {
            await this.producer.send({
                topic,
                messages: [message]
            });
        } catch (e) {
            console.error(e);
        } finally {
            await this.producer.disconnect();
        }
    }

    async consume(topic: string, callback: CallableFunction) {
        await this.consumer.connect();

        try {
            await this.consumer.subscribe({
                topics: [topic],
                fromBeginning: true
            });

            await this.consumer.run({
                eachMessage: ({ message }: EachMessagePayload) =>
                    callback(message)
            });
        } catch (e) {
            console.error(e);
        } finally {
            await this.consumer.disconnect();
        }
    }
}
