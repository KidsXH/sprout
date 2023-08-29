import {ChatCompletionRequestMessageRoleEnum} from "openai"
import fs from "fs";
import {join} from "path";

const systemPrompt = fs.readFileSync(join(process.cwd(), 'src', 'server', 'openai', 'prompts', "system.txt"), "utf-8")
const userPrompt = fs.readFileSync(join(process.cwd(), 'src', 'server', 'openai', 'prompts', "user.txt"), "utf-8")

export const systemMessage: {
    role: ChatCompletionRequestMessageRoleEnum,
    content: string,
} = {
    role: "system",
    content: systemPrompt,
}

export const userMessage: {
    role: ChatCompletionRequestMessageRoleEnum,
    content: string,
} = {
    role: "user",
    content: userPrompt,
}
