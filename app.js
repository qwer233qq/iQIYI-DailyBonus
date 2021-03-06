// version v0.0.1
// create by BlueSkyClouds
// detail url: https://github.com/BlueskyClouds/iQIYI-DailyBonus

const exec = require('child_process').execSync
const fs = require('fs')
const rp = require('request-promise')
const download = require('download')

// 公共变量
const KEY = process.env.iQIYI_COOKIE
const serverJ = process.env.PUSH_KEY

async function downFile () {
    const url = 'https://raw.githubusercontent.com/NobyDa/Script/master/iQIYI-DailyBonus/iQIYI.js'
    await download(url, './')
}

async function changeFiele () {
    let content = await fs.readFileSync('./iQIYI.js', 'utf8')
    content = content.replace(/var cookie = ''/, `var cookie = '${KEY}'`)
    await fs.writeFileSync( './iQIYI.js', content, 'utf8')
}

async function sendNotify (text,desp) {
    const options ={
        uri:  `https://sc.ftqq.com/${serverJ}.send`,
        form: { text, desp },
        json: true,
        method: 'POST'
    }
    await rp.post(options).then(res=>{
        console.log(res)
    }).catch((err)=>{
        console.log(err)
    })
}

async function start() {
    if (!KEY) {
        console.log('请填写 key 后在继续')
        return
    }
    // 下载最新代码
    await downFile();
    console.log('下载代码完毕')
    // 替换变量
    await changeFiele();
    console.log('替换变量完毕')
    // 执行
    await exec("node iQIYI.js >> result.txt");
    console.log('执行完毕')

    let content = "";
    const path = "./result.txt";
    if (fs.existsSync(path)) {
        content = fs.readFileSync(path, "utf8");
    }
    console.log("爱奇艺签到-" + content)

    if (serverJ) {
        await sendNotify("爱奇艺签到-" + new Date().toLocaleDateString(), content);
        console.log('发送结果完毕')
    }
}

start()
