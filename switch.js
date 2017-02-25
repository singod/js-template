;(function() {
	var z = []
	var navigation = {}
	var tplPath = 'public/tpl/'

	var css = `
		.switch-page {
			transition:transform 500ms;
			transform:translateX(100vw);
			position:fixed;
			left:0px;
			top:0px;
		}   
		.switch {
			transform:translateX(0px);
		} 
	`

	var style = document.createElement('style')
	style.innerHTML = css
	document.querySelector('head').appendChild(style)

	var tpls = [
		'step1',
		'step2',
		'step3',
	]

	;(function(itpls) {
		var obj = {}
		for(var i = 0; i < itpls.length; i++) {
			obj[itpls[i]] = {}
			obj[itpls[i]]['closure'] = null
			obj[itpls[i]]['js'] = null
		}
		tpls = obj
	})(tpls.slice())

	var load = function(url, callback, async = true) {
		var xhr = new XMLHttpRequest()
		xhr.onreadystatechange = function() {
			if(xhr.status == 200 && xhr.readyState == 4) {
				callback(xhr.responseText)
			}
		}
		xhr.open('GET', url, async)
		xhr.send()
	}

	var map = function(index) {
		var packet = tplPath + index
		return {
			tpl: packet + '/index.tpl',
			js: packet + '/index.js'
		}
	}

	var initPage = function() {
		var svitchPage = document.createElement('div')
		svitchPage.classList.add('switch-page')
		svitchPage.inject = function(js = "", data = {}) {
			var env = this
			env.input = data
			eval(js)
			delete svitchPage.inject
			svitchPage.eval = function(js) {
				return eval(js)
			}
		}
		return svitchPage	
	}

	var loadTpl = function(index) {
		var p = new Promise(function(resolve, reject) {
			var src = map(index).tpl
			load(src, function(ret) {
				tpls[index].closure = foo.tpl(ret)
				resolve(tpls[index].closure)
			})
		})

		return p
	}

	var loadJs = function(index) {
		var p = new Promise(function(resolve, reject) {
			var src = map(index).js
			load(src, function(ret) {
				tpls[index].js = ret
				resolve(tpls[index].js)
			})
		})

		return p
	}

	var push = function(index, data = {}) {
		var svitchPage = initPage()
		document.querySelector('body').appendChild(svitchPage)
		setTimeout(function() {
			svitchPage.classList.add('switch')
		}, 1)
		z.push([index, svitchPage])

		;(function() {
			var closure = tpls[index].closure
			if(closure == null)
				return loadTpl(index)
			else
				return new Promise(function(resolve, reject) {
					resolve(closure)
				})
		})()
		.then(function(closure) {
			svitchPage.innerHTML = closure.render({
				id: 'id-' + (new Date()).getTime(),
				input: data
			})
		})
		.then(function() {
			var js = tpls[index].js
			if(js == null)
				return loadJs(index)
			else
				return js
		}).
		then(function(js) {
			svitchPage.inject(js, data)
		})
	}

	var pop = function() {
		var svitchPage = z.pop()[1]
		svitchPage.classList.remove('switch')
		setTimeout(function() {
			svitchPage.remove()
		}, 501)
	}

	var get = function(index) {
		for(var i = 0; i < z.length; i++)
			if(index == z[i][0])
				return z[i][1]
	}

	var view = function(DOM) {
		DOM.inject = function(js, data) {
			var env = this
			env.input = data
			eval(js)
		}
		return {
			load: function(index, data = {}) {
				;(function() {
					var closure = tpls[index].closure
					if(closure == null)
						return loadTpl(index)
					else
						return new Promise(function(resolve, reject) {
							resolve(closure)
						})
				})()
				.then(function(closure) {
					var html = closure.render({
						input: data
					})
					DOM.innerHTML = html
				})
				.then(function() {
					var js = tpls[index].js
					if(js == null)
						return loadJs(index)
					else
						return js
				}).
				then(function(js) {
					DOM.inject(js, data)
				})
			}
		}
	}

	navigation.push = push
	navigation.pop = pop
	navigation.get = get
	window.navigation = navigation
	window.view = view
})()
