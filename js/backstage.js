new Vue({
	el:'#app2',
	data:{
		//菜单缩放
		isCollapse:false,
		//header搜索
		state:'',
		//搜索下拉列表值
		restaurants:[],
		
	},
	methods:{
		//过滤筛选对应下拉列表值
		querySearch(queryString, cb) {
		        let restaurants = this.restaurants;
		        let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
		        // 调用 callback 返回建议列表的数据
		        cb(results);
				//查询跳转
				var newAll=this.loadAll();
				document.onkeydown=function(event){
					var e = event || window.event || arguments.callee.caller.arguments[0];
					if(e&&e.keyCode==13){
						var add=''
						newAll.filter((item)=>{
							if(item.value.indexOf(queryString)!=-1){
								add=item.address
							}
						});
						if(add!=null||add==""){
							if(add.indexOf(".html")!=-1){
								window.location.href=""+add
							}
						}
					}
				};
		      },
		//创建过滤器
		createFilter(queryString) {
		    return (restaurant) => {
		        return (restaurant.value.indexOf(queryString) === 0);
		    };
		},
		//点击列表跳转
		handleSelect(ev){
			console.log(ev.address)
			window.location.href=""+ev.address
		},
		//AJAX传入参数
		loadAll(){
			return [
				{"value": "三全鲜食（北新泾店）","address": "./login.html" },
				{"value": "Hot honey 首尔炸鸡（仙霞路）","address": "长宁区北新泾街道天山西路490-1号"},
				{"value": "新旺角茶餐厅"},
				{"value": "泷千家(天山西路店)"},
				{"value": "胖仙女纸杯蛋糕（上海凌空店）"},
				{"value": "贡茶"},
			];
		},
		//登录用户系图标下拉列表
		selectdrop(e){
			console.log(e)
		},
		//左边导航栏下拉列表
		select(e,a){
			console.log(e,a)
		},
	},
	//生命周期钩子方法加载页面传递数据到搜索框restaurants中
	mounted:function(){
		// let el=document.querySelector('.el-menu')
		// let ifarme=document.querySelector('#uiui')
		// console.log(ifarme.getAttribute('s	rc'))
		// console.log(el)
		this.restaurants=this.loadAll();
	}
})