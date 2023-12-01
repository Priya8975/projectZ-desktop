const path = require('path');
const fs = require('fs');

let utils = {};

utils.shared = function () {
    let shared = path.join(__dirname,"share");
    let files = fs.readdirSync(shared);
    let output = [];
    files.forEach(function (file) {
        if (fs.lstatSync(path.join(shared, file)).isDirectory()) return;
        let obj = {};
        const stats = fs.statSync(path.join(shared, file));
        obj.name = file;
        obj.size = Math.round(((stats.size / 1000000.0 + Number.EPSILON) * 100) / 100) + "MB";

        if (file.endsWith(".pdf")) obj.class = "icon-application-pdf"
        else if (file.endsWith(".html") || file.endsWith(".htm")) obj.class = "icon-text-html"
        else if (file.endsWith(".zip") || file.endsWith(".bz") || file.endsWith(".7z") || file.endsWith(".rar")) obj.class = "icon-application-zip"
        else obj.class = "icon-text";

        output.push(obj);
    });
    return output;
}

utils.makePWD = function (length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

module.exports = utils;