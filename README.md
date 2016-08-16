这是一个js模版引擎

可通过如下方式解析template：

方式一：直接写

&lt;template data-render="{ name:'yourName',age:'yourAge' }"&gt;
	<lt;span>gt;my name is {{name}},and my age is {{age}}<lt;/span>gt;
<lt;/template>gt;

方式二：直接引入外部模板

<lt;template data-src="example.tpl">gt;
<lt;/template>gt;

''' exapmle.tpl '''

var dom = '<lt;span>gt;my name is {{name}},and my age is {{age}}<lt;/span>gt;'

var data = { name:'yourName',age:'yourAge' }

''''''

方式三：先引入外部模板后重新赋值

<lt;template data-src="example.tpl" data-render="{ name:'newName',age:'newAge' }">gt;
<lt;/template>gt;

当然，该模版引擎也支持js标准语法

<lt;template data-render="{ numbers:[1,2,3,4,5,6,7,8,9,10] }">gt;
	<lt;div>gt;
		<lt;% for(var number of numbers) { %>gt;
			<lt;h1>gt;{{number}}<lt;/h1>gt;
		<lt;% } %>gt;
	<lt;/div>gt;
<lt;/template>gt;
