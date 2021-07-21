const express = require("express")
const app = express()

//模板引擎配置 用ejs渲染html 這樣就不用後綴改名成ejs檔
app.set("view engine","html")
app.set("views")
app.engine("html",require("ejs").renderFile)

//靜態資源配置
app.use(express.static("static"))
//調用首頁router
app.use("/",require("./router/index"))
app.use("/index",require("./router/index"))

app.listen(3000,()=>{
	console.log("跑在3000")
})