import readline from "node:readline";
import process from "node:process";

export const askMessage = (query: string): Promise<string> => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise(resolve => rl.question(query, (answer) => {
        rl.close();
        resolve(answer);
    }));
};

export const textWithUnderline = (text: string) => {
    console.log(text);
    console.log('-'.repeat(35));
}

export const textWithUpperLine = (text: string) => {
    console.log('-'.repeat(35));
    console.log(text);
}

export const textWithDoubleLine = (text: string) => {
    console.log('-'.repeat(35));
    console.log(text);
    console.log('-'.repeat(35));
}

export const formatAnswer = (server: string | undefined, port: number | undefined, answer: Buffer) => {
    textWithUpperLine(`MESSAGE FROM ${server}:${port}: `)
    textWithUnderline(answer.toString());
}

