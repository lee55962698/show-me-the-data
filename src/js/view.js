(function($) {

    $.escapeHTML = function(s) {
        return s.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
    };
    $.unescapeHTML = function(s){
        return s.replace(/&amp;/g,'&')
            .replace(/&lt;/g,'<')
            .replace(/&gt;/g,'>')
            .replace(/&nbsp;/g,' ')
            .replace(/&quot;/g, "\"");
    };

})(Zepto);

var frameUrl = new Uri(location.href);
var dataUrl = decodeURIComponent(frameUrl.getQueryParamValue('url'));

Prism.hooks.add('before-insert', function(env) {
    env.highlightedCodeArray = env.highlightedCode.match(/((.*\n){40}|[\s\S]+$)/g);
    env.codeArray = env.code.match(/((.*\n){40}|[\s\S]+$)/g);
    env.highlightedCode = ''; //阻止prism默认innerHTML大量dom
});
Prism.hooks.add('after-highlight', function(env) {
    var timeout, i = 0;
    function clearTextNode(startNode) {
        if (!startNode) return;
        var nextNode = startNode.nextSibling;
        if (nextNode) {
            clearTextNode(nextNode);
            nextNode.remove();
            nextNode = null;
        }
    }
    function appendCode() {
        timeout = window.setTimeout(function(){
            var html = (i?'\n':'') + env.highlightedCodeArray[i] + env.codeArray.slice(i+1).join('');
            var lastElement = $(env.element.lastElementChild);
            clearTextNode(lastElement[0]);

            $(env.element).append(html);
            if (i < env.highlightedCodeArray.length - 1) {
                i++;
                appendCode();
            }
        }, 50);
    }
    $(window).on('scroll mousemove keydown', function() {
        if (i < env.highlightedCodeArray.length - 1) {
            if (timeout) {
                window.clearTimeout(timeout);
            }
            appendCode();
        }
    });
    appendCode();
});

$.get(dataUrl,function(data){
    $('#code').html($.escapeHTML(data));
    Prism.highlightAll();
});