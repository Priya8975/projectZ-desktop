const ip = require("ip");
const { spawn } = require("child_process");
const ftpServer = require("./app");
const util = require('./util');
var os = require("os")

let cmdServer;

let btn = document.querySelector(".btn");
let notice = document.querySelector(".notice");
let sysInfo = document.querySelector(".sys-info");
let fileNotice = document.querySelector(".file-notice");
let terminal = document.querySelector(".terminal");

let cpus = os.cpus();

let arch = os.arch();
let platform = os.platform();
let mbTotal = ((os.totalmem())/1048576);
let mbFree = ((os.freemem())/1048576);

sysInfo.innerHTML = "CPU : "+cpus[0].model+"<br>";
sysInfo.innerHTML += "Architecture : "+arch+"<br>";
sysInfo.innerHTML += "OS : "+platform+"<br>";
sysInfo.innerHTML += "Total RAM : "+mbTotal+" MB<br>";
sysInfo.innerHTML += "Available RAM : "+mbFree+" MB<br>";




fileNotice.innerHTML = "You can add or remove files to be sharable by adding or removing them to the folder "+ __dirname +"/Share/ ";

let btn2 = document.querySelector(".btn2");
let notice2 = document.querySelector(".notice2");

function openPage(pageName, elmnt) {
    let i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].style.backgroundColor = "";
    }
    document.getElementById(pageName).style.display = "block";
    elmnt.style.backgroundColor = "#101935";
}

document.getElementById("defaultOpen").click();

btn.addEventListener("click", () => {
    if (btn.classList.contains("on")) {
        btn.classList.remove("on");
        btn.style.backgroundColor = "#88FF88"
        btn.innerHTML = "Start"
        notice.innerHTML = "Server is stopped";
        cmdServer.kill("SIGINT")
    } else {
        let pwd = util.makePWD(8);
        btn.classList.add("on");
        btn.style.backgroundColor = "#FF8888"
        btn.innerHTML = "Stop";
        notice.innerHTML = "Server started on <strong>" + ip.address() + ":9999 </strong> <br> The password is : "+pwd;
        cmdServer = spawn("java", ["pns.project.z.server.Server",pwd]);
        cmdServer.stdout.on("data",(data)=>{
            terminal.innerHTML +="<br> "+data;
        })
    }
});

btn2.addEventListener("click",()=>{
    if (!btn2.classList.contains("on")) {
        ftpServer.listen(8000,()=>{
            btn2.classList.add("on");
            btn2.innerHTML = "Running";
            notice2.innerHTML = "FTP Server started on <strong>" + ip.address() + ":8000 </strong> <br> It will remain active for this session";
        });
    }
});

