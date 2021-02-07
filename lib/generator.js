// expr -> js
export class Generator {
    generate(ast) {
        if (ast.type === 'Program') {
            return `${ast.body.map(stmt => this.generate(stmt)).join(';\n')};\n`;
        } else if (ast.type === 'ExpressionStatement') {
            return `${this.generate(ast.expression)}`;
        } else if (ast.type === 'CallExpression') {
            return `${this.generate(ast.callee)}(${ast.arguments.map(arg => this.generate(arg)).join(', ')})`;
        } else if (ast.type === 'MemberExpression') {
            return `${this.generate(ast.object)}${ast.optional ? '?' : ''}${ast.computed ? '[`' : '.'}${this.generate(ast.property)}${ast.computed ? '`]' : ''}`;
        } else if (ast.type === 'BinaryExpression') {
            if (/^[+-]$/.test(ast.operator)) {
                return `${this.generate(ast.left)} ${ast.operator} ${this.generate(ast.right)}`;
            } else if (/^[*/]$/.test(ast.operator)) {
                const leftParenthesis = ast.left.type === 'BinaryExpression' && /^[+-]$/.test(ast.left.operator);
                const rightParenthesis = (ast.right.type === 'BinaryExpression' && /^[+-/]$/.test(ast.right.operator));
                return `${leftParenthesis ? '(' : ''}${this.generate(ast.left)}${leftParenthesis ? ')' : ''} ${ast.operator} ${rightParenthesis ? '(' : ''}${this.generate(ast.right)}${rightParenthesis ? ')' : ''}`;
            }
        } else if (ast.type === 'Identifier') {
            return `${ast.name}`;
        } else if (ast.type === 'Literal') {
            return `${ast.raw}`;
        }
    }
}
