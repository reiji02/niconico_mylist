titles = window.titles = []

var content  = 'abc';
var mimeType = 'application/json';
var file_name     = document.title+'.json';

var a = document.createElement('a');
a.download = file_name;
a.target   = '_blank';

function getParam(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

bf_page = Number(getParam("bf_page"))
page= Number(getParam("page"))

if(bf_page != page || bf_page == 0)
{
    next_page = page == 0 ? 2 : page + 1

    document.getElementsByClassName('NC-MediaObjectTitle').forEach(element => titles.push(element.innerText))

    var bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
    var blob = new Blob([ bom, JSON.stringify(titles) ], { "type" : mimeType });
    var userAgent = window.navigator.userAgent.toLowerCase();

    if (userAgent.indexOf('msie') != -1 || userAgent.indexOf('trident') != -1) {
        // for IE
        window.navigator.msSaveBlob(blob, file_name)
    }
    else if (userAgent.indexOf('chrome') != -1 || userAgent.indexOf('firefox') != -1) {
        // for Firefox
        a.href = window.URL.createObjectURL(blob);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
    else {
        // for Safari or Other
        window.open('data:' + mimeType + ';base64,' + window.Base64.encode(content), '_blank');
    }

    window.location.href = window.location.href.split("?")[0] + "?page=" + next_page + "&bf_page=" + page 
}