// JavaScript Document
/*-----------------------------------------------------------------------------
*一个轻量级的js库，用来创建命名空间和动态加载js与css
*作者:Muzi*lei , email:530624206@qq.com
*version:1.0  , 时间：2011-09-14
-----------------------------------------------------------------------------*/
var myLib={
	//创建子命名空间,用的是yui的方法------
	NS:function(ns) {
       if (!ns || !ns.length) {
        return null;
       }
       var levels = ns.split(".");
       var nsobj = myLib;
      for (var i=(levels[0] == "myLib") ? 1 : 0; i<levels.length; ++i) {
        nsobj[levels[i]] = nsobj[levels[i]] || {};
        nsobj = nsobj[levels[i]];
      }
      return nsobj;
      },
	/*--
	动态加载外部js文件，参数path可使用正常路径格式"file/demo/js文件"
	注意：末尾不要加“.js”后缀...
	--*/
	_loadJs:function(path,callback){
	   callback=!(typeof(callback)=="undefined")?callback:function(){};	
       var oHead = document.getElementsByTagName('HEAD').item(0); 
	   var script = document.createElement("script")
           script.type = "text/javascript";
           if (script.readyState){ //IE
                 script.onreadystatechange = function(){
                 if (script.readyState == "loaded" || script.readyState == "complete"){
                          script.onreadystatechange = null;
                          callback();
                               }
                                               };
           } else { //Others: Firefox, Safari, Chrome, and Opera
                   script.onload = function(){
                   callback();
                       };
                 }
       script.src =path+".js";
       oHead.appendChild(script); 
	},
	/*--
	动态加载外部css文件，参数path可使用正常路径格式"file/demo/css文件"
 	注意：末尾不要加“.css”后缀...
	--*/
	_loadCss:function(path){
		if(!path || path.length === 0){
			throw new Error('argument "path" is required !');
		}
		var head = document.getElementsByTagName('head')[0];
        var links = document.createElement('link');
        links.href =path+".css";
        links.rel = 'stylesheet';
        links.type = 'text/css';
        head.appendChild(links);
    }
	,
	 //获取对象类型名,["Array", "Boolean", "Date", "Number", "Object", "RegExp", "String", "Window", "HTMLDocument"]
	_getType:function(object){
		return Object.prototype.toString.call(object).match(/^\[object\s(.*)\]$/)[1];
		},
	//用来判断对象类型
	_is:function(object,typeStr){
		return this._getType(object)==typeStr;
		}
		,
	//动态加载js文件,批量加载js,css文件，path可以是数组格式或用逗号隔开的字符串	
	_import:function(path,fileType){
			 var loadfun;
			 switch(fileType){
				 case "js":
					 loadfun=this._loadJs;
					 break;
				 case "css":
				     loadfun=this._loadCss;
					 break;
				default:
				alert("请检查文件类型");
				 }
		//如果path是以逗号隔开的字符串		 
	   if(this._is(path,"String")){
		if(path.indexOf(",")>=0){
			path=path.split(",");
			}else{
				path=[path];
				}
	   }
	   //循环加载文件
		for(var i=0;i<path.length;i++){
		loadfun(path[i]);		 
		}
		} 
	}
