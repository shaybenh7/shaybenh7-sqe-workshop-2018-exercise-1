import $ from 'jquery';
import {parseCodeWithLine, colorCode} from './code-analyzer';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let input = $('#inputCode').val().trim().split(', ');
        let parsedCode = parseCodeWithLine(codeToParse);
        let parsedCodeWithLine = parseCodeWithLine(codeToParse);
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
        let afterColoring = colorCode(parsedCodeWithLine, input);
        document.getElementById('newString').innerHTML = '<p>' +afterColoring + '</p>';
    });
});
