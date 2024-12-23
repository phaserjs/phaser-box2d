import importPlugin from 'eslint-plugin-import';

export default [
    {
        ignores: [
            "src/debug_draw.js",
            "docs/**",
            "docs-theme/**",
            "dist/**",
            "examples/**",
            "overwatch/**",
            "tests/**"
        ]
    },
    {
        name: "src",
        files: [ "src/**/*.js" ],
        languageOptions: {
            globals: {
                "console": "readonly",
                "window": "readonly",
                "performance": "readonly",
                "fetch": "readonly",
                "DOMParser": "readonly",
            }
        },
        plugins: {
            import: importPlugin
        },
        rules: {
            "no-unused-vars": ["error", { "vars": "all", "args": "none" }],
            "no-useless-assignment": "error",
            "no-const-assign": "error",
            "no-compare-neg-zero": "error",
            "no-dupe-class-members": "error",
            "no-dupe-args": "error",
            "no-undef": "error",
            "no-unreachable": "error",
            "block-scoped-var": "error",
            "prefer-const": "error",
            "import/no-unassigned-import": "error",
            "curly": "error",
            // Formatting rules
            "array-bracket-spacing": [ "error", "always" ],
            "block-spacing": [ "error", "always" ],
            "brace-style": [ "error", "allman", { "allowSingleLine": true } ],
            "eol-last": [ "error" ],
            "func-call-spacing": [ "error", "never" ],
            "indent": [ "error", 4, { "SwitchCase": 1 } ],
            "lines-around-comment": [ "error", { "beforeBlockComment": true, "afterBlockComment": false, "beforeLineComment": true, "afterLineComment": false, "allowBlockStart": true, "allowBlockEnd": false, "allowObjectStart": true, "allowArrayStart": true }],
            "keyword-spacing": "error",
            "new-parens": "error",
            "no-mixed-spaces-and-tabs": "error",
            "no-trailing-spaces": [ "error", { "skipBlankLines": true, "ignoreComments": true } ],
            "no-underscore-dangle": "off",
            "no-whitespace-before-property": "error",
            "one-var-declaration-per-line": [ "error", "initializations" ],
            "quote-props": [ "error", "as-needed" ],
            "semi-spacing": [ "error", { "before": false, "after": true } ],
            "semi": [ "error", "always" ],
            "space-before-blocks": "error",
            "spaced-comment": [ "error", "always", { "block": { "balanced": true, "exceptions": ["*", "!"] }} ],
            "no-irregular-whitespace": ["error", { "skipComments": true }],
            "object-curly-newline": [ "error", { "multiline": true, "minProperties": 0, "consistent": true } ],
            "key-spacing": [ "error", { "beforeColon": false, "afterColon": true } ],
            "linebreak-style": [ "off" ],
            "padding-line-between-statements": ["error",
                { "blankLine": "always", "prev": "*", "next": "block-like" },
                { "blankLine": "always", "prev": "*", "next": "break" },
                { "blankLine": "always", "prev": "*", "next": "case" },
                { "blankLine": "always", "prev": "*", "next": "class" },
                { "blankLine": "always", "prev": "*", "next": "continue" },
                { "blankLine": "always", "prev": "*", "next": "default" },
                { "blankLine": "always", "prev": "*", "next": "do" },
                { "blankLine": "always", "prev": "*", "next": "for" },
                { "blankLine": "always", "prev": "*", "next": "if" },
                { "blankLine": "always", "prev": "*", "next": "return" },
                { "blankLine": "always", "prev": "*", "next": "switch" },
                { "blankLine": "always", "prev": "*", "next": "throw" },
                { "blankLine": "always", "prev": "*", "next": "try" },
                { "blankLine": "always", "prev": "*", "next": "while" }
            ],
  
        }
    }
];
