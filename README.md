# 来源
> 该项目主要服务于 Edmodo web-app项目，用于富文本能力的技术预研，目前实现包括以下内容

# 阶段任务

Phase 1:
  * [x] 基础富文本能力，标题/加粗/斜体/中划线/有序列表/无序列表/代码块。
  * [x] 富文本内容按照 Markdown 格式输出。
  * [x] 插入/取消链接能力
  
Phase 2:
  * [x] Mention 能力
  * [x] Hashtag 能力
   
Phase 3:
  * [x] MathJax 公式插入/编辑能力

# 启动
- npm install 
- npm run start

# 语法规则
> Edmodo 关于富文本的表述规则由标准的 markdown 语法+自定义语法组成。自定义语法用于进行公式存储和表述，形如

```
[math]a^2=1[/math]
```