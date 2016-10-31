/* foo模板引擎 */
;(function () {
	var foo = {},
	head = document.querySelector('head'),
	callback = function(window,load) {
		
	},	/* 所有模版渲染完毕后的回调函数 */
	templateNodes = document.querySelectorAll('template'), /* 得到所有的template节点 */
	load = function(src,callback) {	/* 模板（js）加载器 */
		var scriptEle = document.createElement('script');
		scriptEle.src = src;
		scriptEle.onload = callback;
		head.appendChild(scriptEle);
	},
	tplStorage = {},	/* 模版存储对象，用于存放编译后的模板 */
	parseNode = document.querySelector('body').appendChild(document.createElement('div'));

	tplStorage.number = 0;
	tplStorage.queue = [];	/* 一个队列，用于存储解析后的模版字符串 */
	tplStorage.add = function(key,val) {
		this.queue[key] = val;
		this.number++;
		if(this.number == templateNodes.length)	/* 当tplStorage.queue被填满时触发 */
			this.deQueue();
	};
	tplStorage.deQueue = function() {	/* 把所有模板弹出队列 */
		for(var i = 0;i < templateNodes.length;i++) {
			var parentNode = templateNodes[i].parentNode;
			parseNode.innerHTML = this.queue.shift();
			parentNode.insertBefore(parseNode.children[0],templateNodes[i]);
			templateNodes[i].remove();
		}
		parseNode.remove();
		callback(window,load);
	};
	foo.tpl = function(tpl) {
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
	};
	foo.conf = function(conf = {}) {	//默认参数为{}
		callback = conf.callback || callback;
		return foo;
	};
	foo.start = function() {
		for(var i = 0;i < templateNodes.length;i++) {
			var tplSrc = templateNodes[i].getAttribute('data-src');
			if((tplSrc)) {
				;(function(i) {
					var tagData =  templateNodes[i].getAttribute('data-render');
					load(tplSrc,function() {
						/* 解析模版并加入存储模版对象 */
						tplStorage.add(i,foo.tpl(dom).render(tagData && eval('(' + tagData + ')') || data));
					});
				})(i);
			} else {
				;(function(i) {
					var dom = templateNodes[i].innerHTML;
					var data = eval('(' + templateNodes[i].getAttribute('data-render') + ')');
					/* 替换头尾的空白，以及部分实体字符 */
					var re = /&lt;|&gt;/g;	/* 下面的替换是为了解决template标签里面的<和>被浏览器转义的缺陷 */
					dom = dom.replace(re,function(s0) {
						if(s0 == '&lt;')
							return '<';
						else if(s0 == '&gt;')
							return '>';
					});
					/* 解析模版并加入模版存储对象 */
					tplStorage.add(i,foo.tpl(dom).render(data));
				})(i);
			}
		}
	};
	window.foo = foo;
})();
