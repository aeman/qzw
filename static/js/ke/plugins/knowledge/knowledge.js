//知识树插件 KindEditor
KindEditor.plugin('knowledge', function(K) {
	var self = this, name = "knowledge";
	var getHtml = function() {
			var html_head = '<div class="bd"><div class="fix"><div style="margin: 4px 5px;"><input type="text" id="searchInput" placeholder="输入知识点查询" style="border: solid 1px #ccc; height: 25px; width: 300px; margin-left: 20px;"/></div><div class="tag-list mt20 fix" style="padding: 0 5px 5px 20px; height: 350px; overflow: auto"><ul>';
			var htmls = [], kps = window.kps || [];
			for (var i = 0, j = kps.length; i < j; i++) {
				var item = kps[i];
				htmls.push("<li class='kp_class_");
				htmls.push(item.id);
				htmls.push("'><a href='javascript: choiceKP(");
				htmls.push(item.id);
				htmls.push(")' title='");
				htmls.push(item.name || "");
				htmls.push("'>");
				htmls.push(item.name || "");
				htmls.push("</a></li>");
			}
			var html_tail = '</ul></div><p class="i-line"></p></div>';
			return html_head + htmls.join("") + html_tail;
	};
	function insertContent(knowledgePoints) {
		var htmls = [];
			for (var i = 0, j = knowledgePoints.length; i < j; i++) {
				var item = knowledgePoints[i];
				var href = item.href, name = item.name || "";
				var k_htmls = [];
				k_htmls.push("<a href=\"javascript:void(0)\" ");
				k_htmls.push("my-data-value=\"");
				k_htmls.push(item.id);
				k_htmls.push("\" class=\"kpc_");
				k_htmls.push(item.id);
				k_htmls.push(" kpc_stub\">");
				k_htmls.push(name);
				k_htmls.push("</a>");
				htmls.push(k_htmls.join(""));
			}
			self.insertHtml(htmls.join("&nbsp;&nbsp;"));
	};
	self.plugin.knowledge = {
		click : function() {
			self.createDialog({
				name : 'insertKnowledge',
				width : 450,
				height: 400,
				title : '插入知识点',
				body : getHtml(),
				yesBtn : {
					name : '确定',
					click : function(e) {
						var kps = [];
						var window_kps = window.kps || [];
						for (var i = 0, j = window_kps.length; i < j; i++) {
							var item = window_kps[i];
							if (item.checked) {
								kps.push(item);
								item.checked = false;
							}
						}
						insertContent(kps);
						self.hideDialog().focus();
					}
				}
			});
			if (window.knowledgeBindSearch) {
				window.knowledgeBindSearch("searchInput");
			}
		}
	};
	self.clickToolbar(name, self.plugin.knowledge.click);
});
