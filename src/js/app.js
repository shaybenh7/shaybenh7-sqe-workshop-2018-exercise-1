import $ from 'jquery';
import {parseCode,parseCodeWithLine,breakCode,toHtmlTable} from './code-analyzer';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        let parsedCodeWithLine = parseCodeWithLine(codeToParse);
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
        document.getElementById('tableSpot').innerHTML = toHtmlTable(breakCode(parsedCodeWithLine));
    });
});
