new Vue({
	el:"#app",
	data:{
		//登录表单
		form:{
			name:"",
			password:"",
			code:"",
			verify:false,
			numbers:0,
		},
		//忘记密码步骤一表格
		forget1:{
			name:"",
			code:""
		},
		//更改密码表单
		forget2:{
			name:"",
			password:"",
			newpass:""
		},
		//登录通过
		formCode1:true,
		//忘记密码验证
		formCode2:false,
		//重新设置密码
		formCode3:false,
		//提示语
		placeholdermsg:'请输入账号',
		//判断密码是否显示
		passshow:true,
		//判断次数
		count:0,
		//判断验证码是否显示
		show:false,
		//按钮信息
		codemsg:'发送手机验证码',
		//判断是否禁用按钮
		isdisabled:false,
		//短信按钮定时器
		timer:null,
		//cookie保存
		setCookie:(cname,cvalue,exdays)=>{
			var d = new Date();
			d.setTime(d.getTime()+(exdays*24*60*60*1000));
			var expires = "expires="+d.toGMTString();
			document.cookie = cname+"="+cvalue+"; "+expires;
		},
		//cookie查询
		getCookie:(cname)=>{
			var name = cname + "=";
			var ca = document.cookie.split(';');
			for(var i=0; i<ca.length; i++) {
				var c = ca[i].trim();
				if (c.indexOf(name)==0) { return c.substring(name.length,c.length); }
			}
			return "";
		},
	},
	methods:{
		//发送倒计时
		send(){
			let downTime=60;
			if(!this.timer){
				this.timer=setInterval(()=>{
					if(downTime>0 && downTime<=60){
						downTime--;
						if(downTime!==0){
							this.codemsg="重新发送("+downTime+")";
							this.isdisabled=true;
						}else{
							clearInterval(this.timer);
							this.codemsg="发送手机验证码";
							downTime=60;
							this.timer=null;
							this.isdisabled=false;
						}
					}
				},1000)
			}
		},
		//登录表单提交验证
		submitForm(form){
			let mima='123456';
			if(form.password===mima){
				this.setCookie('code',"",-1)
				/* 测试 */
				 this.$message('密码正确');
				 // this.setCookie('name',this.form.name,6)
				 // this.setCookie('pass',this.form.password,6)
				 window.location.href="./page/backstage.html" 
			 
			}else{
				this.count++;
				this.$message('密码错误')
				this.setCookie('code',this.count,6)
			}
			let c = this.getCookie('code')
			if(c==3){
				this.$message('密码错误3次，请使用手机验证码登陆')
				this.placeholdermsg='请输入手机号'
				this.show=true;
				this.passshow=false
			}
		},
		//重置按钮
		resetForm(form) {
		    form.name=''
			form.password=''
			form.code=''
			form.verify=false
			this.setCookie('code',"",-1)
		},
		//记住密码
		remenber(isremenber){
			if(isremenber){
				this.setCookie('name',this.form.name,6)
				this.setCookie('pass',this.form.password,6)
			}
		},
		//忘记密码
		wangji(){
			this.formCode2=true
			this.formCode1=false
			this.formCode3=false
		},
		//忘记密码-验证手机验证码
		next(msg){
			// 验证码接口：通过：ajax
			//举例
			let data=1234
			if(msg.name==null||msg.name==""){
				this.$message('手机号码为空')
			}else if(msg.code==null||msg.code==""){
				this.$message('验证码为空')
			}else if(msg.code==data){
				this.formCode3=true
				this.formCode2=false
				this.formCode1=false
			}
			else{
				this.$message('验证码错误')
			}
		},
		last(){
			this.formCode3=false
			this.formCode2=false
			this.formCode1=true
		},
		//修改密码，成功后返回登录
		finish(msg){
			// let data=JSON.stringify(msg)
			// $.ajax({
			// 	url:"",
			// 	ContextType:{},
			// 	data{
			// 		数据
			// 	},
			// 	success
			// })
			//举例
			if(msg!=null){
				this.formCode3=false
				this.formCode2=false
				this.formCode1=true
			}
		}
	},
	//初始化判断cookie是否有内容，给出提示
	created:function(){
		//判断输入密码是否超过三次，改用手机号登录
		let c = this.getCookie('code')
		if(c>=3){
			this.show=true;
			this.passshow=false;
			this.count=c;
			this.placeholdermsg='请输入手机号';
		}
		//判断是否点击保存密码,直接将值赋予input
		let name=this.getCookie('name')
		let pass=this.getCookie('pass')
		if(name!=""&&pass!=""){
			this.form.verify=true
			this.form.name=name;
			this.form.password=pass;
		}else{
			this.form.verify=false
		}
	}
})