new  Vue({
	el:'#app3',
	data:{
		//查询数据
		// search:"",
		fullscreenLoading: false,//加载
		imfile:'',//导入
		outfile:'',//导出
		//模拟数据
		tableData:[
			{'dateTime': '2016-05-02','name': '王小虎','address': '上海市普陀区金沙江路 1518 弄'}
		],
		//储存选中数据
		Selection:[],
		//添加数据对话框控件
		isaddtab:false,
		//添加数据form表单
		addform:{
			dateTime:'',
			name:'',
			address:''
		},
		//更新数据对话框控件
		isUpdata:false,
		//更新数据表单
		updata:{
			dateTime:'',
			name:'',
			address:''
		},
		//控制更新数据下标
		index:'',
	},
	mounted(){
		this.imfile=document.getElementById('imFile')
		this.outfile=document.getElementById('downlink');
		Vue.prototype.$ajax=axios;
		this.$ajax.get('../json/file.json').then(res=>{
			this.tableData=res.data
		})
	},
	methods:{
		//更新按钮
		handleEdit(index,row){
			// let arr=[]
			// this.$ajax.get('./json/file.json').then(res=>{
			// 	arr=res.data
			// })
			this.isUpdata=true;
			this.updata=row
			this.index=index
		},
		//更新表单  
		handleEditupdata(){
			this.updata.dateTime=this.formatDate(this.updata.dateTime)
			this.tableData[this.index]=this.updata
			this.isUpdata=false;
			this.$message({message: '更新成功',type: 'success'});
		},
		//批量删除
		delBates(Selection){
			console.log(Selection.length)
			this.$confirm("确定删除选中的"+Selection.length+"记录吗?",'提示',{
				type:'warning'
			}).then(()=>{
				for(let i=0;i<this.tableData.length;i++){
					for(let j=0;j<Selection.length;j++){
						if(this.tableData[i]==Selection[j]){
							this.tableData.splice(i,1)
						}
					}
				}
			})
			
		},
		//删除操作
		handleDelete(index,row){
			this.$confirm('确定删除当前选中记录吗?','提示',{
				type:'warning'
			}).then(()=>{
				row.splice(index, 1);
			})
		},
		//时间格式
		formatDate(date) {
			if(date instanceof Date){
				var y = date.getFullYear();  
				var m = date.getMonth() + 1;  
				m = m < 10 ? ('0' + m) : m;  
				var d = date.getDate();  
				d = d < 10 ? ('0' + d) : d;  
				return y + '-' + m + '-' + d;
			}
				return date
		},
		//添加操作
		handleEditadd(){
			let data=this.addform
			if(data.dateTime==null||data.dateTime==""){
				this.$message.error('时间不能为空');
			}else if(data.name==null||data.name==""){
				this.$message.error('名字不能为空');
			}else if(data.address==null||data.address==""){
				this.$message.error('地址不能为空');
			}else{
				data.dateTime=this.formatDate(data.dateTime)
				this.tableData.push(data)
				this.isaddtab=false
				this.$message({
				    message: '添加成功',
				    type: 'success'
				});
				this.addform={}
			}
		},
		//获取checkbox选中表全部数据
		handleSelectionChange(val){
			this.Selection=val
		},
		//点击导入按钮
		uploadFile(){
			this.imfile.click()
		},
		//点击导出按钮 
		downloadFile(re){
			let data=[{}]
			for(let key in re[0]){
				data[0][key]=key
			}
			data=data.concat(re)
			this.downloadExl(data,"医院信息")
		},
		//导入操作change事件
		importFile() { // 导入excel
		    this.fullscreenLoading = true
		    let obj = this.imfile
		    if (!obj.files) {
		        this.fullscreenLoading = false
		        return
		    }
		    var f = obj.files[0] 
		    var reader = new FileReader()
		    let $t = this
		    reader.onload = function (e) {
		        var data = e.target.result
		        if ($t.rABS) {
		            $t.wb = XLSX.read(btoa(this.fixdata(data)), {  // 手动转化
		            type: 'base64'
					})
		        } else {
		            $t.wb = XLSX.read(data, {
		            type: 'binary'
		            })
		        }
		          let json = XLSX.utils.sheet_to_json($t.wb.Sheets[$t.wb.SheetNames[0]])
		          // console.log(typeof json)
		          $t.dealFile($t.analyzeData(json)) // analyzeData: 解析导入数据
		        }
		        if (this.rABS) {
		          reader.readAsArrayBuffer(f)
		        } else {
		          reader.readAsBinaryString(f)
		        }
		},
		//导出操作引用事件具体实现
		downloadExl(json, downName, type) {// 导出到excel
		        let keyMap = [] // 获取键
		        for (let k in json[0]) {
		          keyMap.push(k)
		        }
		        // console.info('keyMap', keyMap, json)
		        let tmpdata = [] // 用来保存转换好的json
		        json.map((v, i) => keyMap.map((k, j) => Object.assign({}, {
		          v: v[k],
		          position: (j > 25 ? this.getCharCol(j) : String.fromCharCode(65 + j)) + (i + 1)
		        }))).reduce((prev, next) => prev.concat(next)).forEach(function (v) {
		          tmpdata[v.position] = {
		            v: v.v
		          }
		        })
				//替换字符串
				for(let key in tmpdata){
					if(tmpdata[key].v=='dateTime'){
						tmpdata[key].v='日期'
					}else if(tmpdata[key].v=='name'){
						tmpdata[key].v='名字'
					}else if(tmpdata[key].v=='address'){
						tmpdata[key].v='地址'
					}
				}
		        let outputPos = Object.keys(tmpdata)  // 设置区域,比如表格从A1到D10
		        let tmpWB = {
		          SheetNames: ['mySheet'], // 保存的表标题
		          Sheets: {
		            'mySheet': Object.assign({},
		              tmpdata, // 内容
		              {
		                '!ref': outputPos[0] + ':' + outputPos[outputPos.length - 1] // 设置填充区域
		              })
		          }
		        }
		        let tmpDown = new Blob([this.s2ab(XLSX.write(tmpWB,
		          {bookType: (type === undefined ? 'xlsx' : type), bookSST: false, type: 'binary'} // 这里的数据是用来定义导出的格式类型
		        ))], {
		          type: ''
		        })  // 创建二进制对象写入转换好的字节流
		        var href = URL.createObjectURL(tmpDown)  // 创建对象超链接
		        this.outfile.download = downName + '.xlsx'  // 下载名称
		        this.outfile.href = href  // 绑定a标签
		        this.outfile.click()  // 模拟点击实现下载
		        setTimeout(function () {  // 延时释放
		          URL.revokeObjectURL(tmpDown) // 用URL.revokeObjectURL()来释放这个object URL
		        }, 100)
		},
		analyzeData(data) {  // 此处可以解析导入数据
		    return data
		},
		dealFile(data) {   // 处理导入的数据
			// console.log(data[0])
			//替换表头
			let newdata=[]
			for(let i=0;i<data.length;i++){
				let json1 = JSON.parse(JSON.stringify(data[i]).replace(/日期/g,"dateTime"));
				let json2 = JSON.parse(JSON.stringify(json1).replace(/名字/g,"name"));
				let json3 = JSON.parse(JSON.stringify(json2).replace(/地址/g,"address"));
				newdata.push(json3)
			}
		    this.imfile.value = ''
		    this.fullscreenLoading = false
			if (newdata.length <= 0) {
				this.$message.error('请导入正确信息');
		    } else {
				this.$message({
				          message: '导入成功',
				          type: 'success'
				        });
		        this.tableData = newdata
		    }
		},
		s2ab(s) { // 字符串转字符流
		    var buf = new ArrayBuffer(s.length)
		    var view = new Uint8Array(buf)
		    for (var i = 0; i !== s.length; ++i) {
		        view[i] = s.charCodeAt(i) & 0xFF
		    }
			return buf
		},
		getCharCol(n) { // 将指定的自然数转换为26进制表示。映射关系：[0-25] -> [A-Z]。
		        let s = ''
		        let m = 0
		    while (n > 0) {
		        m = n % 26 + 1
				s = String.fromCharCode(m + 64) + s
		        n = (n - m) / 26
		    }
		    return s
		},
		fixdata(data) {  // 文件流转BinaryString
		    var o = ''
		    var l = 0
		    var w = 10240
		    for (; l < data.byteLength / w; ++l) {
		          o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)))
		    }
		    o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)))
				return o
		}
	},
	
})