这是一个js模版引擎

可通过如下方式解析template：

方式一：直接写
<p>&lt;template data-render="{ name:'yourName',age:'yourAge' }"&gt;</p>
	<p>&lt;span&gt;my name is {{name}},and my age is {{age}}&lt;/span&gt;</p>
<p>&lt;/template&gt;</p>

方式二：直接引入外部模板
<p>&lt;template data-src="example.tpl"&gt;</p>
<p>&lt;/template&gt;</p>

''' exapmle.tpl '''
<p>var dom = '&lt;span&gt;my name is {{name}},and my age is {{age}}&lt;/span&gt;'</p>
<p>var data = { name:'yourName',age:'yourAge' }</p>
''''''

方式三：先引入外部模板后重新赋值
<p>&lt;template data-src="example.tpl" data-render="{ name:'newName',age:'newAge' }"&gt;</p>
<p>&lt;/template&gt;</p>

当然，该模版引擎也支持js标准语法
<p>&lt;template data-render="{ numbers:[1,2,3,4,5,6,7,8,9,10] }"&gt;</p>
	<p>&lt;div&gt;</p>
		<p>&lt;% for(var number of numbers) { %&gt;</p>
			<p>&lt;h1&gt;{{number}}&lt;/h1&gt;</p>
		<p>&lt;% } %&gt;</p>
	<p>&lt;/div&gt;</p>
<p>&lt;/template&gt;</p>
