import fs from 'fs/promises';

import { Generator } from './lib/generator.js';
import { Parser } from './lib/parser.js';

void async function main(args) {
    const config = {
        input: null,
        output: null,
        astOutput: null,
        encoding: process.env.ENCODING || 'utf-8',
    };
    try {
        Object.assign(config, JSON.parse(await fs.readFile('.exprrc', config.encoding)));
    } catch {}
    for (let i = 2; i < args.length; i++) {
        switch (args[i]) {
        case '-o':
        case '--output':
            config.output = args[++i];
            break;
        case '-a':
        case '--ast-output':
            config.astOutput = args[++i];
            break;
        case '-e':
        case '--encoding':
            config.encoding = args[++i];
            break;
        default:
            config.input = args[i];
        }
    }

    try {
        const parser = new Parser();
        const generator = new Generator();
        const input = await fs.readFile(config.input, config.encoding);
        const ast = parser.parse(input);
        if (config.astOutput) {
            fs.writeFile(config.astOutput, JSON.stringify(ast, null, 4));
        } else {
            console.warn('--ast-output was not set');
        }
        const code = generator.generate(ast);
        if (config.output) {
            fs.writeFile(config.output, code);
        } else {
            console.warn('--output was not set');
        }
    } catch (e) {
        console.error(e);
    }
}(process.argv);
