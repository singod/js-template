function fooTemplate(obj) {
	var callback = obj && obj.callback || function(window,load) {};
	var templateNodes = document.querySelectorAll('template');	/* 得到所有的template节点 */

	/* 模版存储对象 */
	var templateStore = {};
	templateStore.number = 0;
	templateStore.queue = [];	/* 一个队列，用于存储解析后的模版字符串 */
	templateStore.add = function(key,val) {
		this.queue[key] = val;
		this.number++;
		if(this.number == templateNodes.length)	/* 当templateStore.queue被填满时触发 */
			this.full();
	}
	templateStore.full = function() {
		for(var i = 0;i < templateNodes.length;i++) {
			var parentNode = templateNodes[i].parentNode;
			parseNode.innerHTML = this.queue.shift();
			parentNode.insertBefore(parseNode.children[0],templateNodes[i]);
			templateNodes[i].remove();
		}
		parseNode.remove();
		callback(window,load);
	}

	/* 创建一个模版转换容器，该容器用于把str类型转化成node类型 */
	var divEle = document.createElement('div');
	divEle.style.display = 'none';
	var body = document.querySelector('body');
	var parseNode = body.appendChild(divEle);

	/* 模版解析引擎 */
	tpl = function(tpl) {
		/* 返回闭包 */
		return {
			render:function(data) {
				var re = /{{([^]+?)}}|<%([^]+?)%>/g;
				var jsCode = [];        /* 存放第一次编译后的得到的js代码 */
				var htmlFrag = [];      /* 存放第二次编译后的html片段 */
				var cursor = 0; /* 游标 */
				for(var key in data)
					eval('var ' + key + ' = data[key];');
				while(match = re.exec(tpl)) {
					var index = match['index'];
					jsCode.push('htmlFrag.push(tpl.substr(' + cursor +',' + index + ' - ' + cursor + '));');
					if(match[0].substr(0,2) == '<%')        /* 如果是js逻辑语句 */
						jsCode.push(match[2]);
					else    /* 否则就是js变量 */
						jsCode.push('htmlFrag.push(' + match[1] + ');');
					cursor = match[0].length + index;
				}   
				jsCode.push('htmlFrag.push(tpl.substring(' + cursor + '));')
				eval(jsCode.join(''));
				return htmlFrag.join('');
			}
		}
	}

	/* 模版加载器 */
	var load = function(src,callback) {
		var scriptEle = document.createElement('script');
		var head = document.getElementsByTagName('head')[0];
		scriptEle.src = src;
		scriptEle.onload = callback;
		head.appendChild(scriptEle);
	};

	/* 引入外部模版并解析 */
	;(function() {
		for(var i = 0;i < templateNodes.length;i++) {
			var tplSrc = templateNodes[i].getAttribute('data-src');
			if((tplSrc)) {
				;(function(i) {
					var tagData =  templateNodes[i].getAttribute('data-render');
					load(tplSrc,function() {
						/* 解析模版并加入存储模版对象 */
						templateStore.add(i,tpl(dom).render(tagData && eval('(' + tagData + ')') || data));
					});
				})(i);
			} else {
				;(function(i) {
					var dom = templateNodes[i].innerHTML;
					var data = eval('(' + templateNodes[i].getAttribute('data-render') + ')');
					/* 替换头尾的空白，以及部分实体字符 */
					var re = /&lt;|&gt;/g;
					dom = dom.replace(re,function(s0) {
						if( s0 == '&lt;')
							return '<';
						else if(s0 == '&gt;')
							return '>';
					});
					/* 解析模版并加入模版存储对象 */
					templateStore.add(i,tpl(dom).render(data));
				})(i);
			}
		}
	})();
};
