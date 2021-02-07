# 式パーサ
算術演算子を用いた式をパースするプログラム。

おまけでパースした抽象構文木から `JavaScript` に変換する `Generator` を付属した。

## 初期設定
1. `npm i` コマンドを実行

## 使い方
1. `src` ディレクトリの `input.expr` に式を記述する
1. `npm start` コマンドでパース及び変換を実行
1. `dist` ディレクトリの `output.js` に変換結果が保存される

```javascript
// src/input.expr
(1 + 2) * 3 * (4 / 2)
// dist/output.js
console.log((1 + 2) * 3 * (4 / 2));
// dist/astOutput.json
{
    "type": "Program",
    "body": [
        {
            "type": "ExpressionStatement",
            "expression": {
                "type": "CallExpression",
                "callee": {
                    "type": "MemberExpression",
                    "object": {
                        "type": "Identifier",
                        "name": "console"
                    },
                    "property": {
                        "type": "Identifier",
                        "name": "log"
                    },
                    "computed": false,
                    "optional": false
                },
                "arguments": [
                    {
                        "type": "BinaryExpression",
                        "left": {
                            "type": "BinaryExpression",
                            "left": {
                                "type": "BinaryExpression",
                                "left": {
                                    "type": "Literal",
                                    "value": 1,
                                    "raw": "1"
                                },
                                "right": {
                                    "type": "Literal",
                                    "value": 2,
                                    "raw": "2"
                                },
                                "operator": "+"
                            },
                            "right": {
                                "type": "Literal",
                                "value": 3,
                                "raw": "3"
                            },
                            "operator": "*"
                        },
                        "right": {
                            "type": "BinaryExpression",
                            "left": {
                                "type": "Literal",
                                "value": 4,
                                "raw": "4"
                            },
                            "right": {
                                "type": "Literal",
                                "value": 2,
                                "raw": "2"
                            },
                            "operator": "/"
                        },
                        "operator": "*"
                    }
                ],
                "optional": false
            }
        }
    ]
}
```

## .exprrc
`.exprrc` は設定ファイルである。 `json` 形式で記述する。

### input
入力ファイルパスを記述。

### output
出力ファイルパスを記述。

### astOutput
抽象構文木の出力ファイルパスを記述。

## .env
`.env` は環境設定ファイルである。

### ENCODING
エンコーディング方式を記述。 (普通はutf-8で動くはず。)

## 注意点
- 単項演算子には対応していない。
- 少数点数の実装が雑である。 (.0.0.0.0 でもパースされてしまう。)
- 現状では(+, -, *, /)のみに対応
