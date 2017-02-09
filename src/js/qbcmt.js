(function(w,d){

    var isDev = false,
        envconfig = {
            dev: {
                staticPath: '../src/',
                nodePath: '开发环境后台地址'
            },
            product: {
                staticPath: '生成环境前端js路径',
                nodePath: '生产环境后台地址'
            }
        };
    

    var params = {},pageParams = {},
        userParams={
            sid: getParameterByName('sid'),
            auth: getParameterByName('auth'),
            //jdpin: '风信子806',
            ploginUrl: '登录地址'+w.location.href,
            env: isDev ? envconfig.dev : envconfig.product
        };

    if ( _jdqbc.sign && _jdqbc.name ) {
        params.sign = _jdqbc.sign || '';
        params.name = _jdqbc.name || '';
    }else{
        if ( d ) {
            params.sign = d.URL || '';
            params.name = d.title || '';
        }
    }

    var Render = {
        commentList: function(data){
            var comments = data.comments,
                lis = [],
                main = '';

            if ( data.count == 0 ) {
                //显示没有评论
                Dom.el('#qbcmt-nocom').innerHTML = '目前没有评论';
                Dom.el('#qbcmt-nocom').style.display = 'block';
            }else{
                for (var i = 0; i <= comments.length - 1; i++) {
                    lis.push(Dom.generateLi(comments[i]));
                }
                if ( data.currentPage > 1 ) {
                    return Dom.el('.cmt-list').innerHTML = Dom.el('.cmt-list').innerHTML + lis.join('');
                }else{
                    Dom.el('.cmt-list').innerHTML = lis.join('');
                }
            }
        },
        createMainView: function(){
            var main = '<div class="cmt-form"><div class="area-wrap"><textarea class="cmt-textarea" id="qbc_ta"></textarea></div><div class="align-right"><button class="cmt-btn" id="qbc_pub">发表评论</button></div></div><p class="warn" id="qbcmt-nocom">目前没有评论</p><ul class="cmt-list"></ul>';

            Dom.el('.qb-cmt-wrap').innerHTML = main;
        },
        noComments: function(){
            Dom.el('#qbcmt-nocom').innerHTML = '评论获取失败，<a href="'+ window.location.href +'">刷新看看</a></p><ul class="cmt-list">';
            Dom.el('#qbcmt-nocom').style.display = 'block';
        },
        error: function(msg, callback){
            if ( typeof msg === "string" ) {
                this.loading(msg);
            }
            if ( typeof msg === "function" ) {
                callback = msg;
            }
            setTimeout(function(){
                Render.hideLoading();
                callback && callback();
            }, 2000);
        },
        loading: function(msg){
            var loadingTemp = '',loadingWrap = null;

            loadingTemp = msg ? '<p class="loading-text">'+msg+'</p>' : '<p><span class="qbcmt-loading"></p>';

            if ( Dom.el('.qbcmt-lwrap') ) {
                loadingWrap = Dom.el('.qbcmt-lwrap');
            }else{
                loadingWrap = d.createElement('div');
                Dom.setAttr(loadingWrap, {'class':'qbcmt-lwrap'});
                d.body.appendChild(loadingWrap); 
            }
            loadingWrap.innerHTML = loadingTemp;
        },

        hideLoading: function(){
            Dom.el('.qbcmt-lwrap') && Dom.el('.qbcmt-lwrap').remove();
        },
        showScrollTip: function(tip){
            var scrollTip = null;

            if ( Dom.el('#qbcmt-st') ) {
                scrollTip = Dom.el('#qbcmt-st');
            }else{
                scrollTip =  d.createElement('p');
                Dom.setAttr(scrollTip, {'class':'warn', 'id': 'qbcmt-st'});
                Dom.el('.qb-cmt-wrap').appendChild(scrollTip);
            }

            scrollTip.innerText = tip;
            scrollTip.style.display = 'block';          
        },
        hideScrollTip: function(){
            if ( Dom.el('#qbcmt-st') ){
                Dom.el('#qbcmt-st').style.display = 'none';
            } 
        }
    }
    
    var Dom = {
        el: function(sel){
            return d.querySelector(sel);
        },
        generateLi: function(data){
            data.publishTime = handleTime(data.publishTime);

            var liTemp = 
            ['<li class="cmt-single">',
                '<div class="cmt-user">',
                    '<img src="' + data.photo + '" width="40px" class="cmt-photo">',
                '</div>',
                '<div class="cmt-comment">',
                    '<p class="cmt-nick">' + data.nickName + '</p>',
                    '<div class="cmt-cont">' + data.content + '</div>',
                    '<div class="align-right"><span class="cmt-time">' + data.publishTime + '</span></div>',
                '</div>',
            '</li>'];
            return liTemp.join('');
        },

        setAttr: function(tar, obj){
            if ( tar.nodeType ) {
                if ( typeof obj === "object" ) {
                    for (var key in obj){
                        tar.setAttribute(key, obj[key]);
                    }
                }
            }
            return tar;
        },

        insertStylesheet: function(){
            var css = d.createElement('link'); 
            css.type = 'text/css';
            css.rel = 'stylesheet';
            css.href = (document.location.protocol == 'https:' ? 'https:' : 'http:') + userParams.env.staticPath + 'css/qbcmt.css';
            var l = d.getElementsByTagName('link')[0];
            l ? l.parentNode.insertBefore(css,l) : document.head.appendChild(css);
        }
    }

    function handleTime(time){
        var t = new Date(time),
            y = t.getFullYear(),
            m = t.getMonth() + 1,
            d = t.getDate(),
            ft = m + '月' + d + '日',
            now = new Date();

        if ( now.getFullYear() !== y ){
            return y + '年' + ft;
        }else{
            return ft;
        }
    }

    function listenScroll(){
        //获取滚动条当前的位置 
        function getScrollTop() { 
            var scrollTop = 0; 
            if (d.documentElement && d.documentElement.scrollTop) { 
                scrollTop = d.documentElement.scrollTop; 
            } else if (d.body) { 
                scrollTop = d.body.scrollTop; 
            } 
            return scrollTop; 
        } 

        //获取当前可视范围的高度 
        function getClientHeight() { 
            var clientHeight = 0; 
            if (d.body.clientHeight && d.documentElement.clientHeight) { 
                clientHeight = Math.min(d.body.clientHeight, d.documentElement.clientHeight); 
            } else { 
                clientHeight = Math.max(d.body.clientHeight, d.documentElement.clientHeight); 
            } 
            return clientHeight; 
        } 

        //获取文档完整的高度 
        function getScrollHeight() { 
            return Math.max(d.body.scrollHeight, d.documentElement.scrollHeight); 
        }

        /* 总数大于0才监听滚动事件*/
        if ( pageParams.count > 0 ) {
            window.onscroll = function () { 
                if (getScrollTop() + getClientHeight() == getScrollHeight()) {

                    if ( pageParams.currentPage < pageParams.totalPage ) {

                        Render.showScrollTip('正在加载更多...');
                        getPageComment( Number(pageParams.currentPage) + 1 );
                        Render.hideScrollTip();

                    }else{
                        Render.showScrollTip('没有更多了');
                    }
                }
            }
        }
    }

    function postComment(data, successCb, errorCb){
        if ( userParams.sid || userParams.auth || userParams.jdpin) {
            data['sid'] = userParams.sid;
            data['auth'] = userParams.auth;
            data['jdpin'] = userParams.jdpin;

            ajaxCors({
                url: userParams.env.nodePath + 'p/comment?' + objToStr(data),
                success: function(r){
                    setTimeout(function(){
                        getPageComment(1);
                        Render.hideLoading();
                        successCb && successCb(r);
                    }, 1200);
                },
                error: function(r){
                    if ( r && r.msg ) {
                        Render.error('提交评论失败');
                    }else{
                        Render.error('网络繁忙，请稍后再试');
                    }
                    errorCb && errorCb(r);
                }
            })
        }else{
            window.location.href = userParams.ploginUrl; 
        }  
    }

    function getPageComment(page, successCb, errorCb){
        page = page || pageParams.currentPage || 1;

        ajaxCors({
            url: userParams.env.nodePath + 'p/getCom?page=' + page + '&' + objToStr(params),
            success: function(r){
                if ( r.code === 1 ) {
                    var data = r.data;
                    Render.commentList(data);
                    pageParams = {
                        currentPage: data.currentPage,
                        totalPage: data.total,
                        count: data.count
                    }
                    Render.hideLoading();
                    successCb && successCb(data);   
                }
            },
            error: function(msg){
                Render.error(function(){Render.noComments()});
                errorCb && errorCb(msg);
            }
        })
    }

    function ajaxCors(options){
        var url = options.url || "", 
            type = (options.type || "get").toLowerCase(), 
            data = options.data || null, 
            async = options.async === undefined && true, //是否异步，默认为true. 
            error = options.error || function() {}, //错误执行的函数
            success = options.success || function() {}; //

        function createXhr(){
            if ( w.XMLHttpRequest ) {
                return new XMLHttpRequest();
            } else {
                var versions = ["Microsoft", "msxm3", "msxml2", "msxml1"];
                for (var i = 0; i < versions.length; i++) {
                    try {
                        var version = versions[i] + ".XMLHTTP";
                        return new ActiveXObject(version);
                    } catch (e) {}
                }
            }
        }

        var xhr = createXhr();
        xhr.open(type, url, async);
        if ( type === "post" ) {
            xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        }
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                    var r = JSON.parse(xhr.responseText);
                    if ( r.code === 1 ) {
                        success(r);
                    }else{
                        error(r);
                    }
                } else {
                    error();
                }
            }
        };
        xhr.send(type === "get" ? null : data);
    }

    function objToStr(obj){
        obj = obj || {};

        var strArr = []
        for(var key in obj){
            strArr.push(key + '=' + encodeURIComponent(obj[key]));
        }

        return strArr.join('&');
    }

    function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    w.onload = function(){
        if ( userParams.sid || userParams.auth || userParams.jdpin) {
            Render.loading();
            Dom.insertStylesheet();
            if ( params.name && params.sign ) {

                Render.createMainView();

                Dom.el('#qbc_pub').onclick = function(e){
                    Render.loading('提交待审核中...');
                    var data = params;
                    data.content = Dom.el('#qbc_ta').value;
                    if ( !data.content ) {
                        return Render.error('请填写内容再提交');
                    }
                    postComment(data, function(){
                        Dom.el('#qbc_ta').value = '';
                    });
                }

                getPageComment(null, function(r){
                    listenScroll();
                    Render.hideLoading();
                });
            }else{
                alert("请填写sign和name");
                Render.hideLoading();
            }
        }else{
            window.location.href = userParams.ploginUrl; 
        }  
        
    }
})(window,document);