import * as esprima from 'esprima';

const parseCodeWithLine = (codeToParse) => {
    return esprima.parseScript(codeToParse, {loc: true});
};

const parseCode = (codeToParse) => {
    return esprima.parseScript(codeToParse,null);
};

var parsedJson = [];

const addToJson = (line, type, name, condition='', value='') =>{
    parsedJson.push({'Line':line,'Type':type,'Name':name,'Condition':condition,'Value':value});
};

const parseFunction = (codeToAnalyze) => {
    addToJson(codeToAnalyze.loc.start.line,'function declaration',codeToAnalyze.id.name);
    codeToAnalyze.params.forEach((element) => {
        addToJson(element.loc.start.line,'variable declaration',element.name);
    });
    breakCode(codeToAnalyze.body);
};

const parseBlockStatement = (codeToAnalyze) => {
    codeToAnalyze.body.forEach((element) => {
        breakCode(element);
    });
};

const identifier = (data) => {
    return data.name;
};
const literal = (data) =>{
    return data.value;
};
const logicalExp = (data) => {
    return parsingFunctions[data.left.type](data.left).toString()+
    (data.operator in opMap? opMap[data.operator].toString() : data.operator.toString())+
    parsingFunctions[data.right.type](data.right).toString();
};
const opMap = {
    '<' : '&lt',
    '>' : '&gt',
    '&&' : '&amp&amp',
    '&' : '&amp'
};

const binaryExpression = (data) =>{
    return parsingFunctions[data.left.type](data.left).toString()+
    (data.operator in opMap? opMap[data.operator].toString() : data.operator.toString())+
    parsingFunctions[data.right.type](data.right).toString();
};
const memberExp = (data) => {
    return parsingFunctions[data.object.type](data.object).toString()+
            '['+parsingFunctions[data.property.type](data.property).toString()+']';
};

const returnState = (data) => {
    parsedJson.push({'Line' : data.loc.start.line,
        'Type' : 'return statement',
        'Name' : '',
        'Value' : parsingFunctions[data.argument.type](data.argument).toString(),
        'Condition':''});
};
const unaryExp = (data) => {
    return data.operator.toString()+
            parsingFunctions[data.argument.type](data.argument).toString();
};

const handleInit = (data) => {
    return (data == null) ? '' : parsingFunctions[data.type](data);
};

const parseVarDecl = (codeToAnalyze) => {
    codeToAnalyze.declarations.forEach((element) =>{
        parsedJson.push({'Line' : element.loc.start.line,
            'Type' : 'variable declaration',
            'Name' : parsingFunctions[element.id.type](element.id),
            'Value' : handleInit(element.init),
            'Condition':''});
    });
};

const updateExp = (data) =>{
    parsedJson.push({'Line' : data.loc.start.line,
        'Type' : 'udpate expression',
        'Name' : parsingFunctions[data.argument.type](data.argument),
        'Value' : (data.prefix)? data.operator.toString()+parsingFunctions[data.argument.type](data.argument).toString() : 
            parsingFunctions[data.argument.type](data.argument).toString()+data.operator.toString(),
        'Condition':''});
};
const assignExp = (data) =>{
    parsedJson.push({'Line' : data.loc.start.line,
        'Type' : 'assignment expression',
        'Name' : parsingFunctions[data.left.type](data.left),
        'Value' : parsingFunctions[data.right.type](data.right),
        'Condition':''});
};

const ExpStatement =
{
    'UpdateExpression' : updateExp,
    'AssignmentExpression' : assignExp
};

const parseExpressionStatement = (data) => {
    ExpStatement[data.expression.type](data.expression);
};
const parseWhile = (data) => {
    parsedJson.push({'Line' : data.loc.start.line,
        'Type' : 'while statement',
        'Name' : '',
        'Value' : '',
        'Condition': parsingFunctions[data.test.type](data.test)});
    parsingFunctions[data.body.type](data.body);
};
 
const forExp = (data) =>{
    parsedJson.push({'Line' : data.loc.start.line,
        'Type' : 'for statement',
        'Name' : '',
        'Value' : '',
        'Condition': parsingFunctions[data.test.type](data.test).toString()});
    parsingFunctions[data.init.type](data.init);
    parsingFunctions[data.update.type](data.update);
    parsingFunctions[data.body.type](data.body);
};

const parseIf = (data,elseIfStat=false) => {
    parsedJson.push({'Line' : data.loc.start.line,
        'Type' :  (elseIfStat)? 'else if statement' : 'if statement',
        'Name' : '',
        'Value' : '',
        'Condition': parsingFunctions[data.test.type](data.test)});
    parsingFunctions[data.consequent.type](data.consequent);
    if (data.alternate!=null) {
        (data.alternate.type == 'IfStatement')?
            parseIf(data.alternate,true) : parsingFunctions[data.alternate.type](data.alternate);
    }
};



const parseProgram = (data) => {
    data.body.forEach((element) => {
        parsingFunctions[element.type](element);
    });
    return parsedJson;
};

const parsingFunctions = 
{
    'FunctionDeclaration' : parseFunction,
    'Program' : parseProgram,
    'BlockStatement' : parseBlockStatement,
    'VariableDeclaration' : parseVarDecl,
    'ExpressionStatement' : parseExpressionStatement,
    'WhileStatement' : parseWhile,
    'IfStatement' : parseIf,
    'BinaryExpression' : binaryExpression,
    'Identifier' : identifier,
    'Literal' : literal,
    'MemberExpression' : memberExp,
    'LogicalExpression' : logicalExp,
    'ReturnStatement' : returnState,
    'UnaryExpression' : unaryExp,
    'ForStatement' : forExp,
    'UpdateExpression' : updateExp,
    'AssignmentExpression' : assignExp
};

const breakCode = (data) =>{
    return parsingFunctions[data.type](data);
};

function toHtmlTable(jsonObj){
    let parsedTable = '<table>' + '<tr><td>' + 'Line' + '</td>' +
        '<td>' + 'Type' + '</td><td>' + 'Name' + '</td>' +
        '<td>' + 'Condition' + '</td>' + '<td>' + 'Value' + '</td></tr>';
    for(var i=0;i< jsonObj.length;i++){
        parsedTable += '<tr><td>' + jsonObj[i]['Line'] + '</td>' +
        '<td>' + jsonObj[i]['Type'] + '</td><td>' + jsonObj[i]['Name'] + '</td>' +
        '<td>' + jsonObj[i]['Condition'] + '</td>' + '<td>' + jsonObj[i]['Value'] + '</td></tr>';
    }
    parsedTable += '</table>';
    return parsedTable;
}

export {parseCode,parseCodeWithLine,breakCode,toHtmlTable,addToJson,parsedJson,parsingFunctions};