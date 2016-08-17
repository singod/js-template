js-template
===========

* 可通过如下方式解析template：
----------------------------

方式一：直接写
```html
<template data-render="{ name:'yourName',age:'yourAge' }">
	<span>my name is {{name}},and my age is {{age}}</span>
</template>
```

方式二：直接引入外部模板
```html
<template data-src="example.tpl">
</template>
```

exapmle.tpl
```javascript
var dom = '<span>my name is {{name}},and my age is {{age}}</span>'
var data = { name:'yourName',age:'yourAge' }
```

方式三：先引入外部模板后重新赋值
```html
<template data-src="example.tpl" data-render="{ name:'newName',age:'newAge' }">
</template>
```

* 该模版引擎也支持js标准语法
---------------------------

```html
<template data-render="{ numbers:[1,2,3,4,5,6,7,8,9,10] }">
	<div>
		<% for(var number of numbers) { %>
			<h1>{{number}}</h1>
		<% } %>
	</div>
</template>
```

更多事例请查看：https://yuanzhizhu.github.io/js-template/example1.html
