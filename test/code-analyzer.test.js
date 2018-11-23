import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';
var codeAnalayzer = require('../src/js/code-analyzer');
describe('The javascript parser', () => {
    it('is parsing an empty function correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('')),
            '{"type":"Program","body":[],"sourceType":"script"}'
        );
    });

    it('is parsing a simple variable declaration correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('let a = 1;')),
            '{"type":"Program","body":[{"type":"VariableDeclaration","declarations":[{"type":"VariableDeclarator","id":{"type":"Identifier","name":"a"},"init":{"type":"Literal","value":1,"raw":"1"}}],"kind":"let"}],"sourceType":"script"}'
        );
    });
});
var cleanJson = () =>{
    while(codeAnalayzer.parsedJson.length>0){
        codeAnalayzer.parsedJson.pop();
    }
};
describe('addToJsonSanityCheck', () => {
    it('adding new Json object', () => {
        codeAnalayzer.addToJson(1,'type','name');
        assert.equal(
            codeAnalayzer.parsedJson.length,
            1
        );
        cleanJson();
    });
});

describe('Program BlockStatement FunctionDeclaration Identifier', () => {
    it('parsing program with simple function', () => {
        var testProgram= 'function binarySearch(X, V, n){\n}';
        var testJson = codeAnalayzer.parseCodeWithLine(testProgram);
        codeAnalayzer.breakCode(testJson);
        assert.equal(
            codeAnalayzer.parsedJson.length,
            4
        );
        cleanJson();
    });
});
describe('BinaryExpression Literal VariableDeclaration', () => {
    it('parsing program with simple let expression', () => {
        var testProgram= 'let x = x + 5;';
        var testJson = codeAnalayzer.parseCodeWithLine(testProgram);
        codeAnalayzer.breakCode(testJson);
        assert.equal(
            codeAnalayzer.parsedJson.length,
            1
        );
        cleanJson();
    });
    it('parsing program with simple let expression', () => {
        var testProgram= 'let x;';
        var testJson = codeAnalayzer.parseCodeWithLine(testProgram);
        codeAnalayzer.breakCode(testJson);
        assert.equal(
            codeAnalayzer.parsedJson.length,
            1
        );
        cleanJson();
    });
});
describe('UpdateExpression AssignmentExpression ExpressionStatement', () => {
    it('parsing program with simple let expression', () => {
        var testProgram= 'i++;\nx = x+5;';
        var testJson = codeAnalayzer.parseCodeWithLine(testProgram);
        codeAnalayzer.breakCode(testJson);
        assert.equal(
            codeAnalayzer.parsedJson.length,
            2
        );
        cleanJson();
    });
    it('parsing program with simple let expression', () => {
        var testProgram= '++i;\nx = x+5;';
        var testJson = codeAnalayzer.parseCodeWithLine(testProgram);
        codeAnalayzer.breakCode(testJson);
        assert.equal(
            codeAnalayzer.parsedJson.length,
            2
        );
        cleanJson();
    });
});

describe('WhileStatement', () => {
    it('parsing program with simple while expression', () => {
        var testProgram= 'while(x < 5){\ny = 5;\n}';
        var testJson = codeAnalayzer.parseCodeWithLine(testProgram);
        codeAnalayzer.breakCode(testJson);
        assert.equal(
            codeAnalayzer.parsedJson.length,
            2
        );
        cleanJson();
    });
});
describe('IfStatement', () => {
    it('parsing program with simple if expression', () => {
        var testProgram= 'if(x <= 5 & y>7){\ny = 5;\n}';
        var testJson = codeAnalayzer.parseCodeWithLine(testProgram);
        codeAnalayzer.breakCode(testJson);
        assert.equal(
            codeAnalayzer.parsedJson.length,
            2
        );
        cleanJson();
    });
    it('parsing program with simple if expression', () => {
        var testProgram= 'if(x>1){\ny=1;\n}\nelse if(x==0){\ny=0;\n}\nelse{\ny=-1;\n}';
        var testJson = codeAnalayzer.parseCodeWithLine(testProgram);
        codeAnalayzer.breakCode(testJson);
        assert.equal(
            codeAnalayzer.parsedJson.length,
            5
        );
        cleanJson();
    });
});

describe('WhileStatement', () => {
    it('parsing program with simple if expression', () => {
        var testProgram= 'if(x>1){\ny=1;\n}\nelse if(x==0){\ny=0;\n}';
        var testJson = codeAnalayzer.parseCodeWithLine(testProgram);
        codeAnalayzer.breakCode(testJson);
        assert.equal(
            codeAnalayzer.parsedJson.length,
            4
        );
        cleanJson();
    });
});
describe('WhileStatement', () => {
    it('parsing program with simple if expression', () => {
        var testProgram= 'if(x>1){\ny=1;\n}\nelse if(x==0){\ny=0;\n}\nelse if(x<1){\ny=-1;\n}';
        var testJson = codeAnalayzer.parseCodeWithLine(testProgram);
        codeAnalayzer.breakCode(testJson);
        assert.equal(
            codeAnalayzer.parsedJson.length,
            6
        );
        cleanJson();
    });
});

describe('IfStatement LogicalExpression', () => {
    it('parsing program with simple if expression', () => {
        var testProgram= 'if(x >= 5 && y>7){\ny = 5;\n}';
        var testJson = codeAnalayzer.parseCodeWithLine(testProgram);
        codeAnalayzer.breakCode(testJson);
        assert.equal(
            codeAnalayzer.parsedJson.length,
            2
        );
        cleanJson();
    });
    it('parsing program with simple if expression and', () => {
        var testProgram= 'if(x >= 5 && y>7){\ny = 5;\n}';
        var testJson = codeAnalayzer.parseCodeWithLine(testProgram);
        codeAnalayzer.breakCode(testJson);
        assert.equal(
            codeAnalayzer.parsedJson.length,
            2
        );
        cleanJson();
    });
    it('parsing program with simple if expression or', () => {
        var testProgram= 'if(x >= 5 || y>7){\ny = 5;\n}';
        var testJson = codeAnalayzer.parseCodeWithLine(testProgram);
        codeAnalayzer.breakCode(testJson);
        assert.equal(
            codeAnalayzer.parsedJson.length,
            2
        );
        cleanJson();
    });
});
describe('ReturnStatement', () => {
    it('parsing program with simple return literal expression', () => {
        var testProgram= 'function binarySearch(X, V, n){\nreturn n;\n}';
        var testJson = codeAnalayzer.parseCodeWithLine(testProgram);
        codeAnalayzer.breakCode(testJson);
        assert.equal(
            codeAnalayzer.parsedJson.length,
            5
        );
        cleanJson();
    });
    it('parsing program with simple return unary expression', () => {
        var testProgram= 'function binarySearch(X, V, n){\nreturn -1;\n}';
        var testJson = codeAnalayzer.parseCodeWithLine(testProgram);
        codeAnalayzer.breakCode(testJson);
        assert.equal(
            codeAnalayzer.parsedJson.length,
            5
        );
        cleanJson();
    });
});

describe('ForStatement', () => {
    it('parsing program with simple for loop', () => {
        var testProgram= 'for(i=10;i>0;i--){\nx=1;\n}';
        var testJson = codeAnalayzer.parseCodeWithLine(testProgram);
        codeAnalayzer.breakCode(testJson);
        assert.equal(
            codeAnalayzer.parsedJson.length,
            4
        );
        cleanJson();
    });
    it('parsing program with simple for loop and member expression', () => {
        var testProgram= 'for(i=0;i<10;i++){\nx[M]=1;\n}';
        var testJson = codeAnalayzer.parseCodeWithLine(testProgram);
        codeAnalayzer.breakCode(testJson);
        assert.equal(
            codeAnalayzer.parsedJson.length,
            4
        );
        cleanJson();
    });
});

describe('check HTML Generation', () => {
    it('parsing program with simple html generation', () => {
        var testProgram= 'x = x+1;';
        var testJson = codeAnalayzer.parseCodeWithLine(testProgram);
        var acc = codeAnalayzer.toHtmlTable(codeAnalayzer.breakCode(testJson));
        assert.equal(
            codeAnalayzer.parsedJson.length,
            1
        );
        assert.equal(
            acc,
            '<table><tr><td>Line</td><td>Type</td><td>Name</td><td>Condition</td><td>Value</td></tr><tr><td>1</td><td>assignment expression</td><td>x</td><td></td><td>x+1</td></tr></table>'
        );
        cleanJson();
    });
});