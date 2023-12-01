
const express = require("express");
const path = require("path");
const util = require("./util");

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('share'))

app.get("/", (req, res) => {
    res.render("index",{
        files: util.shared()
    });
});

app.get("/download/:file",(req,res) => {
    let file = path.join(__dirname,"share",req.params.file);
    res.download(file);
});

module.exports = app;