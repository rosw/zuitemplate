/* 
 * 醉悠枫模板系统 使用{{ }} 作为符号
 * 例：$.template("this is a {{ tmpl }}",{tmpl:"模板"});
 * 高级功能1: 可指定处理函数以处理特殊情况
 * k 为变量名，v为变量值,可对值进行处理后返回
 function(k,v){
  	...
   return v;
  }
 * 例：$.template("this is a {{ tmpl }}",{tmpl:"模板"},function(a,b){});
 * 高级功能2：注入扩展函数，是一个JSON对象，实现扩展的function,用来做循环,子模板嵌套等
 $.template({
  	 each: function(k,v){
 	   //k is tmpl.list
      //v is [{v:'aa'},{v:'bb'},{v:'cc'}]
      var r=[];
      for(var i=0;i<v.length;i++){
  		  r.push($.template('<li>{{v}}</li>',v[i]));
      }
  	   return r.join('');
    }
  });
  $.template("this is ul demo <ul>{{ each(tmpl.list) }}</ul>",{tmpl:{list:[{v:'aa'},{v:'bb'},{v:'cc'}]}});
  $.template("this is ul demo:<ul>{{ each(tmpl.list) }}</ul>",{tmpl:{list:[{v:"模板1"},{v:"模板2"},{v:"模板3"}]}});
 * 高级功能3：this 关键字 {{ this }}  this表示传入的变量本身，可用来做JSON序列化输出
 */
;(function($){
  var tmplext={};
  function template(s,p,f){
  	var ext=typeof f=='object' ? f : tmplext;
  	var isfunc=typeof f=='function';
  	if(typeof s=='object') tmplext=s;
  	else if(typeof s=='string')
  	return s.replace(/\{\{ *[\w_]*(\( *)?(\.?[\w_]*)*( *\))? *\}\}/ig,function(w){
  		var w1=w.replace(/\{|\}/ig,'').trim(),m,_f=null;
  		if((m=w1.match(/([\w_]+)\( *([\w\._]*) *\)/))){
  			_f=m[1];
  			w1=m[2];
  		}
  		var d=w1.split('.');
  		var r='',a=p;
  		while(d.length){
  			var b=d.shift();
  			a=b=='this' ? a : a[b];
  			if(!a) break;
  		}
  		if(_f){
  			r+=(typeof ext[_f]=='function'?ext[_f](w1,a):a)||'';
  		}else{
  			r+=(isfunc ? f(w1,a) : a) || ''; 
  		}
  		return r;
  	});
  }
  var old=$.template;
  $.template = template;
})(Zepto || JQuery);
