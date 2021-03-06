//文章種類數據模型
module.exports = class Category extends require('./model'){
	//獲取文章種類列表
	static getCategory(){
		return new Promise((resolve,reject)=>{
			let sql = "SELECT id,`name` FROM category ORDER BY `index` DESC"
			this.query(sql).then(results=>{
				resolve(results)
			}).catch(err=>{
				console.log("獲取文章種類失敗:"+err.message)
				reject(err)
			})
		})
	}
	
	//獲取單一筆文章種類名稱
	static getCategoryNameById(id){
		return new Promise((resolve,reject)=>{
			let sql = "SELECT id,`name` FROM category WHERE id=?"
			this.query(sql,id).then(results=>{
				resolve(results[0])
			}).catch(err=>{
				console.log("獲取單一筆文章種類名稱失敗:"+err.message)
				reject(err)
			})
		})
	}
}