// ==UserScript==
// @name         upcpj
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  automatic evaluation
// @author       Destiny12138
// @match        http://jwxt.upc.edu.cn/jsxsd/xspj/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_openInTab
// @grant        GM_getTabs
// ==/UserScript==

//创建“开始评价”按钮和配置
function createStartButton() {
    let body = document.getElementById('LeftMenu1_divChildMenu');
    let startButton = document.createElement("button");
    startButton.setAttribute("id", "startButton");
    startButton.innerText = "开始评教";
    startButton.className = "egg_study_btn egg_menu";
    startButton.setAttribute('style', "top: 10px;left: 5px;padding: 12px 20px;border-radius: 10px;background-color: #fff;color: #d90609;font-size: 18px;font-weight: bold;text-align: center;");

    //添加事件监听
    try { // Chrome、FireFox、Opera、Safari、IE9.0及其以上版本
        startButton.addEventListener("click", openNew, false);
    } catch (e) {
        try { // IE8.0及其以下版本
            startButton.attachEvent('onclick', openNew);
        } catch (e) { // 早期浏览器
            console.log("error: 开始评教按钮绑定事件失败")
        }
    }
    //插入节点
    body.appendChild(startButton)
}

function waitingClose(newPage) {
    return new Promise(resolve => {
        let doing = setInterval(function() {
            if (newPage.closed) {
                clearInterval(doing);
                resolve('done');
            }
        }, 1000);
    });
}

async function openNew() {
    let param = document.getElementsByTagName('a');
    for (let i = 0; i < param.length; i++) {
        if (param[i].getAttribute('title') == '点击进入评价') {
            let newPage = GM_openInTab('http://jwxt.upc.edu.cn' + param[i].getAttribute('href'), { active: true, insert: true, setParent: true });
            await waitingClose(newPage);
        }
    }
    let startBUtton = document.getElementById('startButton');
    startBUtton.innerText = '评教结束';
}

async function openEvaluate() {
    let param2 = document.getElementsByTagName('a');
    for (let i = 0; i < param2.length; i++) {
        if (param2[i].text == '评价') {
            let newPage2 = GM_openInTab('http://jwxt.upc.edu.cn' + /\'.+\'\,/.exec(param2[i].getAttribute('href'))[0].slice(1, -2), { active: true, insert: true, setParent: true });
            await waitingClose(newPage2);
        }
    }
    window.close();
}


window.onload = function() {
    let url = window.location.href;
    if (url.indexOf("xspj_find.do?") != -1) {
        createStartButton();

    } else if (url.indexOf("xspj_list.do?") != -1) {
        console.log('评价信息')
        openEvaluate()
    } else if (url.indexOf("xspj_edit.do?") != -1) {
        for (let i = 1; i < 9; i++) {
            let buttonA = document.getElementById('pj0601id_' + i + '_1');
            buttonA.click();
        }
        //生成 [ 1, n ] 范围内的随机整数（大于等于1，小于等于n）
        let j = Math.floor(Math.random() * 8) + 1;
        document.getElementById('pj0601id_' + j + '_2').click();
        document.getElementById('pjbfb').value = '100';
        document.getElementById('jynr').value = '无';
        window.confirm = function() { return true }
        window.alert = function() { return true }
        document.getElementById('tj').click();
        setTimeout(function() { window.close(); }, 1000);
    } else {}
}