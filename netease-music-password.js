"ui";

//线程执行其任务
var thread = null
var hasFound = false
var storage = storages.create("password");

//消息提示
function toast_console(msg, tshow) {
    console.log(msg);
    if (tshow) toast(msg);
}

//点击控件
function btn_click(x) { if (x) return x.click() }

ui.layout(
    <vertical>
        <button id="start" text="Start" />
        <input id="pass" text={storage.get("latest_password", "0")}/>
    </vertical>
)

function main() {
    console.show()
    if (jumpIntoUI()) {
        startPasswordTest()
    }
}

function jumpIntoUI() {
    app.launch('com.netease.cloudmusic')
    sleep(1500)
    if (text("青少年模式已开启").findOne(1000)) {
        btn_click(text('关闭青少年模式').findOne(500))
        console.log("进入密码界面")
        return true
    } else if (text("请输入密码确认关闭青少年模式").findOne(500)) {
        console.log("进入密码界面")
        return true
    } else {
        console.log("没找到青少年模式")
        return false
    }
}

function startPasswordTest() {
    var password = Number(ui.pass.getText())
    while (password < 10000 && !hasFound) {
        if (password < 10) {
            enterPassword("000" + password)
        } else if (password < 100) {
            enterPassword("00" + password)
        } else if (password < 1000) {
            enterPassword("0" + password)
        } else {
            enterPassword("" + password)
        }
        password++
    }
}

function enterPassword(password) {
    console.log("Test pw: " + password)
    input(password)
    sleep(1000)
    if (!text("请输入正确的密码").findOne(500)) {
        hasFound = true
        console.log("正确密码是" + password)
        storage.put("latest_password", password)
    }
    sleep(2000)
}

ui.start.click(
    function () {
        if (thread && thread.isAlive()) {
            toast_console("Running, not run again!", true)
            return
        }
        thread = threads.start(
            function () {
                main()
                exit()
            }
        )
    }
)