const express = require("express")
const articleApp = express()
//這邊是 http://localhost:3000/admin
//引入後台 article頁的 中間件
const article = require("../../middleware/article.js")
const category = require("../../middleware/category.js")
articleApp.get("/",[article.countTotalArticle],(req,res,next)=>{
	//注意點:邏輯是 先拿頁面參數算現在在 第幾頁,頁固定幾個資料  然後next呼叫article.getPage函數渲染
	let {articleCount} = req
	//不用做分頁的話是返回 pageList 就好 
	//做分頁所以要封裝page{}對象裡面list{}是所有每一筆article資料的集合 page.list 這樣供前端調用
	//即page.list.article[0] 取第一筆資料對象的概念
	//每頁5條
	let size = 5
	//
	req.page = {}
	//page.count總筆數
	req.page.count = articleCount
	//page.total 總頁數
	req.page.total = Math.ceil(req.page.count/size) //無條件進位 => 總數量➗5後還剩幾筆資料在最後一頁 所以進位(或無條件捨去+1)
	//p代表此頁頁數 判斷p在多少 0<page.p<page.total 意即第一頁～最大頁數頁
	//這邊注意req.page.p型態 三元表達式返回值
	req.page.p = req.query.p ? parseInt(req.query.p) : 1
	//console.log(req.page.p)
	//page.p是否大於總頁數
	req.page.p = req.page.p > req.page.total ? req.page.total : req.page.p
	//page.p是否小於第一頁
	req.page.p = req.page.p < 1 ? 1 : req.page.p
	//console.log(req.page.p)
	//往中間件傳參調用方法
	//必須把參數掛載res傳給下一個中間件當function參數
	res.start = (req.page.p - 1) * size
	res.size = size
	
	next()
	
},[article.getPage,category.getCategory],(req,res)=>{
	//抓到參數後開始渲染本頁指定資料
	let { user,pageList,page,categories } = req
	page.list = pageList
	let { category_id,hot } = req.query
	res.render("admin/article/index",{
		//因為在最上面header右上方要顯示使用者名稱
		user:user,
		page:page,
		categories:categories,
		category_id:category_id,
		hot:hot
	})
})

//顯示添加文章頁面
articleApp.get("/add",category.getCategory,(req,res)=>{
	let { categories,user } = req
	res.render("admin/article/add",{
		//因為在最上面header右上方要顯示使用者名稱
		//這邊傳code是因為添加成功或失敗返回的值想顯示在客戶端 先做處理
		code:"",
		categories:categories,
		user:req.user
	})
})

//刪除文章功能
articleApp.get("/del",article.del,(req,res)=>{
	if(req.affectedRows > 0) return  res.json({code:1,message:"刪除文章成功"})
	res.json({code:0,message:"刪除文章失敗"})
})

//獲取edit編輯文章頁面
articleApp.get("/edit/:id",[category.getCategory,article.getArticleById],(req,res)=>{
	let {user,categories,article} = req
	res.render("admin/article/edit",{
		//因為在最上面header右上方要顯示使用者名稱
		categories:categories,
		user:user,
		article:article,
	})
})

//更新(發post)edit編輯文章頁面
articleApp.post("/edit",[article.edit],(req,res)=>{
	if(req.affectedRows > 0) return res.render("admin/alert",{code:true,title:"成功提示",message:"文章編輯成功",url:"/admin/article/"})
	res.render("admin/alert",{
		code:false,
		title:"失敗提示",
		message:"文章編輯失敗",
		url:"/admin/article/edit/"+req.body.id,
	})
})


//add頁面post表單
articleApp.post("/add",article.add,category.getCategory,(req,res)=>{
	let { categories,user } = req
	if(req.insertId) return res.render("admin/article/add",{code:1,categories:categories,user:req.user,article:article})
	return res.render("admin/article/add",{
			//因為在最上面header右上方要顯示使用者名稱
			code:0,
			categories:categories,
			user:req.user
	})
})

// ckeditor 上傳
articleApp.post("/ckeditor",(req,res)=>{
	if(req.uploadUrl) return res.json({uploaded:true,url:req.uploadurl})
	return res.json({uploaded:false,err:{message:"上傳失敗"}})
})

articleApp.get("/category",(req,res)=>{
	res.render("admin/category/index",{
		//因為在最上面header右上方要顯示使用者名稱
		user:req.user,
	})
})

//設置熱門checkbox
articleApp.get("/sethot",article.setHot,(req,res)=>{
	if(req.affectedRows > 0) return  res.json({code:1,message:"設置熱門成功"})
	res.json({code:0,message:"設置熱門失敗"})
})

module.exports = articleApp