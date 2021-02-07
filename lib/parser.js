// expr -> ast
import { ExprOperatorToken, LeftParenthesisToken, NumberToken, TermOperatorToken, Tokenizer } from './tokenizer.js';

export class Environment {
    /**
     * constructor of class Environment
     * @param {import('./tokenizer.js').Token[]} tokens tokens
     */
    constructor(tokens) {
        this.tokens = tokens;
    }
    get(n = 1) {
        if (n < 1) {
            throw new Error('n must be greater than or equal to 1');
        }
        let tmp = null;
        for (let i = 0; i < n; i++) {
            tmp = this.tokens.shift();
            if (tmp === void 0) {
                throw new Error('out of range');
            }
        }
        return tmp;
    }
    /**
     * unget
     * @param {import('./tokenizer.js').Token} token token
     */
    unget(token) {
        this.tokens.unshift(token);
    }
    peek(n = 1) {
        if (n < 1) {
            throw new Error('n must be greater than or equal to 1');
        }
        if (n > this.tokens.length) {
            return void 0;
        }
        const tStack = [];
        for (let i = 0; i < n; i++) {
            tStack.push(this.get());
        }
        const result = tStack[tStack.length - 1];
        while (tStack.length > 0) {
            this.unget(tStack.pop());
        }
        return result;
    }
}

/**
 * @readonly
 * @enum {number}
 */
export const NodeType = {
    NUMBER: 0,
    EXPR: 1,
    TERM: 2,
    FACTOR: 3,
};

export class Node {
    /** @type {Environment} */
    env;
    /**
     * constructor of class Node
     * @param {Environment} env env
     */
    constructor(env) {
        this.env = env;
    }
    /**
     * is first
     * @param {import('./tokenizer.js').Token} _token token
     * @return {boolean}
     */
    static isFirst(_token) {
        return false;
    }
    /**
     * @return {object?}
     */
    parse() {
        return null;
    }
}

export class NumberNode extends Node {
    constructor(env) {
        super(env);
    }
    static isFirst(token) {
        return token instanceof NumberToken;
    }
    parse() {
        const token = this.env.get();
        return {
            type: 'Literal',
            value: token.value.getFValue(),
            raw: token.value.getSValue(),
        };
    }
}

export class ExprNode extends Node {
    constructor(env) {
        super(env);
    }
    static isFirst(token) {
        return TermNode.isFirst(token);
    }
    parse() {
        const rightArray = [];
        if (!TermNode.isFirst(this.env.peek())) {
            throw new SyntaxError(`unexpected token: ${this.env.peek()}`);
        }
        const left = new TermNode(this.env).parse();
        while (this.env.peek() instanceof ExprOperatorToken) {
            const operator = `${this.env.get()}`;
            if (!TermNode.isFirst(this.env.peek())) {
                throw new SyntaxError(`unexpected token: ${this.env.peek()}`);
            }
            const right = new TermNode(this.env).parse();
            rightArray.push({ operator, right });
        }
        return rightArray.reduce((acc, cur) => ({
            type: 'BinaryExpression',
            left: acc,
            right: cur.right,
            operator: cur.operator,
        }), left);
    }
}

export class TermNode extends Node {
    constructor(env) {
        super(env);
    }
    static isFirst(token) {
        return FactorNode.isFirst(token);
    }
    parse() {
        const rightArray = [];
        if (!FactorNode.isFirst(this.env.peek())) {
            throw new SyntaxError(`unexpected token: ${this.env.peek()}`);
        }
        const left = new FactorNode(this.env).parse();
        while (this.env.peek() instanceof TermOperatorToken) {
            const operator = `${this.env.get()}`;
            if (!FactorNode.isFirst(this.env.peek())) {
                throw new SyntaxError(`unexpected token: ${this.env.peek()}`);
            }
            const right = new FactorNode(this.env).parse();
            rightArray.push({ operator, right });
        }
        return rightArray.reduce((acc, cur) => ({
            type: 'BinaryExpression',
            left: acc,
            right: cur.right,
            operator: cur.operator,
        }), left);
    }
}

export class FactorNode extends Node {
    constructor(env) {
        super(env);
    }
    static isFirst(token) {
        return NumberNode.isFirst(token)
            || token instanceof LeftParenthesisToken;
    }
    parse() {
        if (this.env.peek() instanceof LeftParenthesisToken) {
            this.env.get();  // LP
            const node = new ExprNode(this.env).parse();
            this.env.get();  // RP
            return node;
        } else if (NumberNode.isFirst(this.env.peek())) {
            return new NumberNode(this.env).parse();
        } else {
            throw new SyntaxError(`unexpected token: ${this.env.peek()}`);
        }
    }
}

export class Parser {
    parse(code) {
        const tokenizer = new Tokenizer();
        const tokens = tokenizer.tokenize(code);
        const env = new Environment(tokens);
        let node = null;
        if (ExprNode.isFirst(env.peek())) {
            node = new ExprNode(env).parse();
        } else {
            throw new SyntaxError(`unexpected token: ${env.peek()}`);
        }
        return {
            type: 'Program',
            body: [
                {
                    type: 'ExpressionStatement',
                    expression: {
                        type: 'CallExpression',
                        callee: {
                            type: 'MemberExpression',
                            object: {
                                type: 'Identifier',
                                name: 'console',
                            },
                            property: {
                                type: 'Identifier',
                                name: 'log',
                            },
                            computed: false,
                            optional: false,
                        },
                        arguments: [
                            node,
                        ],
                        optional: false,
                    },
                },
            ],
        };
    }
}
