这是一个js模版引擎

可通过如下方式解析template：

方式一：直接写
<code>
<template data-render="{ name:'yourName',age:'yourAge' }">
	<span>my name is {{name}},and my age is {{age}}</span>
</template>
</code>

方式二：直接引入外部模板
<code>
<template data-src="example.tpl">
</template>
</code>

''' exapmle.tpl '''
<code>
var dom = '<span>my name is {{name}},and my age is {{age}}</span>'
var data = { name:'yourName',age:'yourAge' }
</code>
''''''

方式三：先引入外部模板后重新赋值
<code>
<template data-src="example.tpl" data-render="{ name:'newName',age:'newAge' }">
</template>
</code>

当然，该模版引擎也支持js标准语法
<code>
<template data-render="{ numbers:[1,2,3,4,5,6,7,8,9,10] }">
	<div>
		<% for(var number of numbers) { %>
			<h1>{{number}}</h1>
		<% } %>
	</div>
</template>
</code>
