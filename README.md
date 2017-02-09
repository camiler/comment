## 评论模块客户端参考

主要用于第三方接入H5评论。这里只是客户端逻辑参考，服务端接口可用node开发。
    
sign: 页面标志，默认是页面地址   
name: 页面名称，默认是页面title   


div.qb-cmt-wrap必须添加，方便根据页面结构在qb-cmt-wrap外层添加包裹div，或者再添加其他样式自定义评论模块的显示。   

引入html：   
```
<div class="qb-cmt-wrap"></div>
<script type="text/javascript">
    var _jdqbc ={sign: '记录的地址或者站点(默认是页面地址)', name: '记录的标题或者名称(默认为页面标题)'};
    (function() {
        var js = document.createElement('script'); js.type = 'text/javascript'; js.async = true;
        js.src = (document.location.protocol == 'https:' ? 'https:' : 'http:') + '//存放的/qbcmt.min.js'; js.charset = 'UTF-8';
        var s = document.head.getElementsByTagName('script')[0];
        s ? s.parentNode.insertBefore(js,s) : document.head.appendChild(js);
    })();
</script>
```

### 查看项目demo   
gulp server

### 构建目标文件  
gulp build