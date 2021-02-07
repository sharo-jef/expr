// expr -> tokens
/**
 * @readonly
 * @enum {number}
 */
export const ValueType = {
    NUMBER: 0,
};
export class Value {
    type;
    value;
    /**
     * Constructor of class Value
     * @param {ValueType} type value type
     * @param {string} value value
     */
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
    getSValue() {
        return `${this.value}`;
    }
    getIValue() {
        return parseInt(this.value);
    }
    getFValue() {
        return parseFloat(this.value);
    }
    getBValue() {
        return !!this.value;
    }
}
export const TokenType = {
    NUMBER: 0,
    EXPR_OPERATOR: 1,
    TERM_OPERATOR: 2,
    LEFT_PARENTHESIS: 3,
    RIGHT_PARENTHESIS: 4,
};
export class Token {
    type;
    value;
    /**
     * Constructor of class Token
     * @param {string} type token type
     * @param {Value} value value
     */
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
}
export class NumberToken extends Token {
    /**
     * constructor of class NumberToken
     * @param {Value} value value
     */
    constructor(value) {
        super(TokenType.NUMBER, value);
    }
    toString() {
        return `${this.value.getSValue()}`;
    }
}
export class ExprOperatorToken extends Token {
    /**
     * constructor of class ExprOperatorToken
     * @param {string} operator operator
     */
    constructor(operator) {
        super(TokenType.EXPR_OPERATOR, operator);
    }
    toString() {
        return `${this.value}`;
    }
}
export class TermOperatorToken extends Token {
    /**
     * constructor of class TermOperatorToken
     * @param {string} operator operator
     */
    constructor(operator) {
        super(TokenType.TERM_OPERATOR, operator);
    }
    toString() {
        return `${this.value}`;
    }
}
export class LeftParenthesisToken extends Token {
    constructor() {
        super(TokenType.LEFT_PARENTHESIS, '(');
    }
    toString() {
        return `${this.value}`;
    }
}
export class RightParenthesisToken extends Token {
    constructor() {
        super(TokenType.RIGHT_PARENTHESIS, ')');
    }
    toString() {
        return `${this.value}`;
    }
}

export class Tokenizer {
    /** @type {string} */
    code;
    /**
     * tokenize
     * @param {string} code code
     */
    tokenize(code) {
        this.code = code;

        const tokens = [];
        // eslint-disable-next-line no-constant-condition
        while (true) {
            while (/[ \t\v\f\r\n]/.test(this.peek())) {
                this.get();
            }
            if (this.peek() === void 0) {
                break;
            }
            if (this.isNumber()) {
                tokens.push(this.getNumber());
            } else if (this.isExprOperator()) {
                tokens.push(this.getExprOperator());
            } else if (this.isTermOperator()) {
                tokens.push(this.getTermOperator());
            } else if (this.isLeftParenthesis()) {
                tokens.push(this.getLeftParenthesis());
            } else if (this.isRightParenthesis()) {
                tokens.push(this.getRightParenthesis());
            } else {
                throw new SyntaxError(`unexpected token: ${this.peek()}`);
            }
        }
        return tokens;
    }
    get(n = 1) {
        let tmp = null;
        for (let i = 0; i < n; i++) {
            tmp = this.code[0];
            if (tmp === void 0) {
                throw new Error('out of range');
            }
            this.code = this.code.slice(1);
        }
        return tmp;
    }
    /**
     * unget
     * @param {string} c char to unget
     */
    unget(c) {
        this.code = `${c}${this.code}`;
    }
    peek(n = 1) {
        if (n < 1) {
            throw new Error('n must be greater than or equal to 1');
        }
        if (n > this.code.length) {
            return void 0;
        }
        const cStack = [];
        for (let i = 0; i < n; i++) {
            cStack.push(this.get());
        }
        const result = cStack[cStack.length - 1];
        while (cStack.length > 0) {
            this.unget(cStack.pop());
        }
        return result;
    }
    isNumber() {
        return /^(\d|\.)$/.test(this.peek());
    }
    getNumber() {
        let value = '';
        while (/^(\d|\.)$/.test(this.peek())) {
            value += this.get();
        }
        return new NumberToken(new Value(ValueType.NUMBER, value));
    }
    isExprOperator() {
        return /^[+-]$/.test(this.peek());
    }
    getExprOperator() {
        return new ExprOperatorToken(this.get());
    }
    isTermOperator() {
        return /^[*/]$/.test(this.peek());
    }
    getTermOperator() {
        return new TermOperatorToken(this.get());
    }
    isLeftParenthesis() {
        return new RegExp('^\\($').test(this.peek());
    }
    getLeftParenthesis() {
        this.get();
        return new LeftParenthesisToken();
    }
    isRightParenthesis() {
        return new RegExp('^\\)$').test(this.peek());
    }
    getRightParenthesis() {
        this.get();
        return new RightParenthesisToken();
    }
}
