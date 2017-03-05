<% var data = [{ name: '竹致远', age: 23 }, { name: '张佳皓', age: 22 }, { name: '叶梅北宁', age: 23 }] %>
<table cellspacing="0">
	<thead>
		<tr>
			<th>
				name
			</th>
			<th>
				age
			</th>
		</tr>
	</thead>
	<tbody>
		<% for(var i = 0; i < data.length; i++) { %>
		<tr>
			<td>
				{{data[i]['name']}}
			</td>
			<td>
				{{data[i]['age']}}
			</td>
		</tr>
		<% } %>
	</tbody>
</table>
