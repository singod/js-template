/* foo模板引擎 */
(function () {
	var foo = {},
	head = document.querySelector('head'),
	tplNodes = document.querySelectorAll('template'),
	loadJs = function(src,callback) {	/* js加载器 */
		var scriptEle = document.createElement('script')
		scriptEle.src = src
		scriptEle.onload = callback
		head.appendChild(scriptEle)
	},
	loadTpl = function(tplNode) {	/* 模板加载器，传入参数为template节点 */
		var src = tplNode.getAttribute('data-src')
		var xhr = new XMLHttpRequest(src) 
		xhr.onreadystatechange = function() {
			if(xhr.status == 200 && xhr.readyState == 4) {
				replace(tplNode, foo.tpl(xhr.responseText).render({}))
				ewent.record()
			}
		}
		xhr.open('GET', src, true)
		xhr.send()
	},
	parseNode = document.createElement('div'),
	replace = function(tplNode, html) {
		var parentNode = tplNode.parentNode
		var fragment = document.createDocumentFragment()
		parseNode.innerHTML = html
		while(parseNode.childNodes.length)
			fragment.appendChild(parseNode.childNodes[0])
		parentNode.replaceChild(fragment, tplNode)
	},
	ewent = {}
	ewent.i = 0
	ewent.record = function() {
		this.i++
		if(this.i == tplNodes.length)
			foo.onload(window,loadJs)
	}

	foo.tpl = function(tpl) {
		var re = /{{([^]+?)}}|<%([^]+?)%>/g
		var jsCode = []        /* 存放第一次编译后的得到的js代码 */
		var cursor = 0 /* 游标 */
		while(match = re.exec(tpl)) {
			var index = match['index']
			jsCode.push('htmlFrag.push(tpl.substr(' + cursor +',' + index + ' - ' + cursor + '));')
			if(match[0].substr(0,2) == '<%')        /* 如果是js逻辑语句 */
				jsCode.push(match[2] + ';')
			else    /* 否则就是js变量 */
				jsCode.push('htmlFrag.push(' + match[1] + ');')
			cursor = match[0].length + index
		}
		jsCode.push('htmlFrag.push(tpl.substring(' + cursor + '));')
		jsCode = jsCode.join('')

		return {
			render:function(data) {
				for(var key in data)
					eval('var ' + key + ' = data[key];')
				var htmlFrag = []      /* 存放第二次编译后的html片段 */
				eval(jsCode)
				return htmlFrag.join('')
			}
		}
	}

	foo.onload = function(w,l) {
	}

	foo.start = function() {
		for(var i = 0;i < tplNodes.length;i++) {
			var tplSrc = tplNodes[i].getAttribute('data-src')
			if(tplSrc)
				loadTpl(tplNodes[i])
			else {
					var dom = tplNodes[i].innerHTML
					var data = eval('(' + tplNodes[i].getAttribute('data-render') + ')')
					var re = /&lt;|&gt;/g
					dom = dom.replace(re,function(s0) {
						if(s0 == '&lt;')
							return '<'
						else if(s0 == '&gt;')
							return '>'
					})
					var html = foo.tpl(dom).render(data)
					replace(tplNodes[i], html)
					ewent.record()
			}
		}
	}
	window.foo = foo
})()
