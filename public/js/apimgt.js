// 登录状态验证
if (sessionStorage.getItem('loginState') != 1) {
    sessionStorage.setItem('firstLgin', 1); // 传入账号名称
    if (sessionStorage.getItem('loginState') != 1) {
        layer.msg("<i class='layui-icon layui-icon-loading-1 layui-anim layui-anim-rotate'></i> 正在检测登录状态...", { icon: 6, shade: .8, time: 500 })
        setTimeout(() => {
            layer.msg("未登录，即将跳转到登录页面...", { time: 500, shade: 0.8 });
            setTimeout(() => {
                window.location.href = "./login.html";
            }, 500)
        }, 500)
    } else {
        layer.msg("<i class='layui-icon layui-icon-loading-1 layui-anim layui-anim-rotate'></i> 正在检测登录状态...", { shade: .8, time: 1500 })
        setTimeout(() => {
            layer.msg("已登录，加载中...", { icon: 6, shade: .8, time: 1500 })
            setTimeout(() => {
                main()
            }, 1500)
        }, 1500)
    }
} else if (sessionStorage.getItem('loginState') == 1) {
    main()
}

// 用户退出登录
$("#logOut").click(function () {
    sessionStorage.clear();
    layer.msg("成功退出登录")
    setTimeout(() => {
        window.location.href = "./login.html";
    }, 1000)
})

function main() {

    // 用户信息渲染
    console.log(sessionStorage);
    let userName = sessionStorage.getItem('userName');
    $("#userName").html(userName);
    $("#userHeadImg").attr("src", sessionStorage.getItem('userHeadImg'))

    //JS 
    layui.use(['element', 'layer', 'util', 'table', 'form', 'layedit', 'upload'], function () {
        var element = layui.element
            , layer = layui.layer
            , util = layui.util
            , table = layui.table
            , form = layui.form
            , upload = layui.upload
            , layedit = layui.layedit
            , $ = layui.$;

        // 条件搜索重置
        $("#searchReset").click(tableReload)

        // 条件搜索
        $("#search").click(function () {
            if ($("#searchContent").val() == "" && $("#searchClass").val() == "") {
                layer.msg("请选择查询条件和输入查询内容嘞")
            } else if ($("#searchContent").val() != "" && $("#searchClass").val() == "") {
                layer.msg("请选择查询条件")
            } else if ($("#searchContent").val() == "" && $("#searchClass").val() != "") {
                layer.msg("请输入查询内容")
            } else {
                table.render({
                    elem: '#demo'
                    // , height: 315 //容器高度
                    , method: "get"
                    , url: "/api/search"
                    , where: {
                        type: $("#searchClass").val(),
                        content: $("#searchContent").val()
                    }// 传参
                    , page: true//分页
                    , limit: 2// 每页行数
                    , toolbar: true// 头部工具栏区域
                    , cols: [[
                        { field: '', type: 'checkbox', title: '选择', fixed: 'left' },
                        { field: '_id', title: 'ID', hide: true, sort: true, },
                        { field: 'isSeen', title: '可见性', width: 80, templet: '#apiIsSeen', style: 'text-align:center', fixed: 'left' },
                        { field: 'apiState', title: '连通性', width: 80, templet: '#titleTpl', style: 'text-align:center' },
                        { field: 'apiClass', title: '分类', width: 120, style: 'text-align:center' },
                        { field: 'apiImg', title: '图标', width: 80, style: 'text-align:center', templet: '#apiImgSeen' },
                        { field: 'name', title: '名称', width: 120, sort: true, style: 'text-align:center' },
                        { field: 'method', title: 'Method', width: 80, style: 'text-align:center' },
                        { field: 'url', title: 'Api 请求地址', width: 150 },
                        { field: 'parameter', title: '请求参数', width: 100 },
                        { field: 'desc', title: '描述', width: 150 },
                        { field: 'date', title: '添加时间', width: 150, sort: true },
                        { field: 'dateUpdate', title: '更新时间', width: 150, sort: true },
                        { fixed: 'right', title: '更多操作', width: 230, align: 'center', toolbar: '#barOption' }
                    ]] //设置表头
                });
                $("th").css("text-align", "center")
            }
        })

        // 分类的查询
        $.ajax({
            type: "get",
            url: "/user/apiclass",
            data: {
            },
            success: function (suc) {
                for (i = 0; i < suc.data.length; i++) {
                    $("#apiClassSelect").append(`<option value="${suc.data[i].name}">${suc.data[i].name}</option>`)
                }
            }
        })

        // 数据表格渲染
        var tableIns = table.render({
            elem: '#demo'
            // , height: 315 //容器高度
            , method: "get"
            , url: "/api/getdata"
            , where: {}// 传参
            , page: true//分页
            // , limit: 2// 每页行数
            // , toolbar: true// 头部工具栏区域
            , cols: [[
                { field: '', type: 'checkbox', title: '选择', fixed: 'left' },
                { field: '_id', title: 'ID', hide: true, sort: true, },
                { field: 'isSeen', title: '可见性', width: 80, templet: '#apiIsSeen', style: 'text-align:center', fixed: 'left' },
                { field: 'apiState', title: '连通性', width: 80, templet: '#titleTpl', style: 'text-align:center' },
                { field: 'apiClass', title: '分类', width: 120, style: 'text-align:center' },
                { field: 'apiImg', title: '图标', width: 80, style: 'text-align:center', templet: '#apiImgSeen' },
                { field: 'name', title: '名称', width: 120, sort: true, style: 'text-align:center' },
                { field: 'method', title: 'Method', width: 80, style: 'text-align:center' },
                { field: 'url', title: 'Api 请求地址', width: 150 },
                { field: 'parameter', title: '请求参数', width: 100 },
                { field: 'desc', title: '描述', width: 150 },
                { field: 'date', title: '添加时间', width: 150, sort: true },
                { field: 'dateUpdate', title: '更新时间', width: 150, sort: true },
                { fixed: 'right', title: '更多操作', width: 230, align: 'center', toolbar: '#barOption' }
            ]], //设置表头
            initSort: {
                field: '_id' //排序字段，对应 cols 设定的各字段名
                , type: 'null' //排序方式  asc: 升序、desc: 降序、null: 默认排序
            }
        });
        $("th").css("text-align", "center")

        // 数据表格重载
        function tableReload() {
            tableIns.reload({
                where: {},
                page: {
                    curr: 1 //重新从第 1 页开始
                }
            });
            form.val("searchForm", { //aeApi 即 class="layui-form" 所在元素属性 lay-filter="" 对应的值
                searchClass: '',
                searchContent: ''
            });
            $("th").css("text-align", "center")
        };
        // tableReload(); // 数据表格重载调用

        // 弹窗表单重载
        function formReload() {
            form.val("aeApi", { //aeApi 即 class="layui-form" 所在元素属性 lay-filter="" 对应的值
                state: '',
                date: '',
                name: '',
                method: 'GET',
                url: '',
                parameter: '',
                desc: '',
                helpDoc: '',
                codeCus: '',
                docUrl: '',
                isSeen: "on",
                apiClass: ""
            });
            $("#imgEl").attr("src", "");
            apiHelpContent = "";
            $("#testStatus").html('检测连通性');
        };
        // formReload(); // 弹窗表单重载调用

        // Api 添加
        var openadd;// 弹窗index
        $("#addApi").click(function () {
            apiStateNum = "";
            $("#testStatus").html('测试连通性')
            if ($(this).attr("data-click") == "false") {
                layer.msg("请先关闭已打开的弹窗");
            } else {
                $(this).attr("data-click", "false");
                formReload(); // 弹窗表单重载调用
                aeUrl = "/api/add";
                aeType = "post";
                let zz = new Date();
                let zzp = zz.toLocaleString();
                formGo(aeType, aeUrl, zzp);
                openadd = layer.open({
                    title: "Api添加",
                    type: 1,
                    maxmin: true,
                    skin: "layui-layer-molv",
                    content: $("#aeApi"), //这里content是一个普通的String
                    cancel: function () {
                        // 右上角关闭事件的逻辑
                        $("#addApi").attr("data-click", "true");
                    }
                });
            }
        })

        // 添加时帮助文档编辑
        $("#helpEdit").click(addhelpDoc);
        function addhelpDoc() {
            var thislayedit;
            layer.open({
                title: "帮助文档编辑",
                type: 1,
                content: $("#docEdit"),
                btn: ["保存", "重置", "取消"],
                success: function () {
                    $("#demo2").val(apiHelpContent);
                    layedit.build('demo2'); //建立编辑器
                    thislayedit = layedit.build(demo2);
                },
                yes: function (index) {
                    apiHelpContent = layedit.getContent(thislayedit);
                    // console.log(apiHelpContent, 66);
                    // aeUrl = "/api/update";
                    // aeType = "put";
                    formGo(aeType, aeUrl);
                    layer.close(index);
                    $(".layui-layedit").remove();
                },
                btn2: function () {
                    $("#demo2").val("");
                    layedit.build('demo2'); //建立编辑器
                    return false
                },
                btn3: function () {
                    $("#demo2").val(apiHelpContent);
                    layedit.build('demo2'); //建立编辑器
                    $(".layui-layedit").remove();
                }
            })
        }



        // 图片上传
        var uploadInst = upload.render({
            elem: '#pImg' //绑定元素
            ,
            url: "/upload" //上传接口
            ,
            done: function (res) {
                $("#imgEl").attr("src", "");
                $("#imgEl").attr("src", "/upload/" + res.url)
                apiImgSrc = res.url;
                //上传完毕回调
            },
            error: function () {
                //请求异常回调
                console.log("呃呃呃");
            }
        });


        // 查看当前api帮助文档时编辑
        function seehelpDoc(thisApiDoc, data, findex) {
            var thislayedit;
            layer.open({
                title: "帮助文档编辑",
                type: 1,
                content: $("#docEdit"),
                btn: ["保存", "重置", "取消"],
                success: function () {
                    console.log(thisApiDoc);
                    if (thisApiDoc != undefined) {
                        $("#demo2").val(thisApiDoc);
                    } else {
                        $("#demo2").val(apiHelpContent);
                    }
                    layedit.build('demo2'); //建立编辑器
                    thislayedit = layedit.build(demo2);
                },
                yes: function (index) {
                    thisApiDoc = layedit.getContent(thislayedit);
                    $.ajax({
                        type: "put",
                        url: "/api/update",
                        data: {
                            _id: data._id,
                            helpDoc: thisApiDoc
                        }
                    })
                    tableReload(); // 数据表格重载调用
                    layer.msg("成功保存")
                    layer.close(index);
                    layer.close(findex);
                    $(".layui-layedit").remove();
                },
                btn2: function () {
                    $("#demo2").val("");
                    layedit.build('demo2'); //建立编辑器
                    return false
                },
                btn3: function () {
                    $("#demo2").val(apiHelpContent);
                    layedit.build('demo2'); //建立编辑器
                    $(".layui-layedit").remove();
                }
            })
        }

        // 监听提交事件
        var apiStateNum = "";// api连通性
        var apiHelpContent = ""; // api帮助文档
        function formGo(aeType, aeUrl, zzp) {
            form.on('submit(formDemo)', function () {
                var formData = form.val("aeApi");// 获取表单的所有内容
                console.log(formData, 772);
                if (apiStateNum == "") {// api连通性
                    formData.apiState = 0;
                } else {
                    formData.apiState = apiStateNum;
                }
                formData.helpDoc = apiHelpContent;// 帮助文档
                let isSeen;// 是否可见
                if (formData.isSeen == "on") {
                    isSeen = 1;
                } else {
                    isSeen = 0;
                }
                console.log(formData, 99090);
                let imgEl = $("#imgEl").attr("src");
                $.ajax({
                    type: aeType,
                    url: aeUrl,
                    data: {
                        _id: ontableId,
                        apiClass: formData.apiClass,
                        apiState: formData.apiState,
                        state: 6,
                        date: zzp,
                        dateUpdate: new Date().toLocaleString(),
                        type: "类别",
                        name: formData.name,
                        method: formData.method,
                        url: formData.url,
                        parameter: formData.parameter,
                        desc: formData.desc,
                        helpDoc: formData.helpDoc,
                        docUrl: formData.docUrl,
                        isSeen: isSeen,
                        apiImg: $("#imgEl").attr("src")
                    },
                    success: function (suc) {
                        if (suc.code == 0) {
                            tableReload(); // 数据表格重载调用
                            layer.msg("保存成功");// 成功弹窗
                            apiStateNum = 1;
                        } else if (suc.code == -1) {
                            layer.msg("错误");
                        };
                    }
                });
                $("#addApi").attr("data-click", "true");
                layer.close(openadd);// 关闭弹出层
                return false;
            });
        }

        // Api 删除
        $("#delApi").click(function () {
            console.log(checkAllArr, 77);
            let nameArr = [];
            for (i = 0; i < checkAllArr.length; i++) {
                nameArr.push(checkAllArr[i].name)
            }
            layer.open({
                type: 0,
                icon: 0,
                title: "警告",
                content: "是否删除：" + `<font style="color:red;font-weight:bold;">${nameArr}</font>`,
                btn: ["是的", "取消"],
                yes: function () {
                    for (i = 0; i < checkAllArr.length; i++) {
                        $.ajax({
                            type: "delete",
                            url: "/api/del",
                            data: {
                                _id: checkAllArr[i]._id
                            },
                            success: function (suc) {
                                if (suc.code == 0) {
                                    layer.msg("删除成功");
                                    tableReload(); // 数据表格重载调用
                                } else if (suc.code == -1) {
                                    layer.msg("删除失败")
                                    tableReload(); // 数据表格重载调用
                                }
                            }
                        })
                    }
                }
            })
        })

        // 测试Api状态
        $("#testStatus").click(function () {
            var formData = form.val("aeApi");// 获取表单的所有内容
            console.log(formData, 1);
            let parameter = formData.parameter;
            if (formData.url == "") {
                layer.msg("请输入Api 的 url！")
                return
            }
            console.log(parameter, 1);
            $.ajax({// api的检测
                type: formData.method,
                url: formData.url,
                dataType: "json",
                data: parameter,
                success: function (suc) {
                    apiStateNum = 1;
                    layer.open({
                        type: 3,
                        icon: 1,
                        time: 1000
                    })
                    setTimeout(() => {
                        if (suc.code == 200 || JSON.parse(suc).code == 200) {
                            let pp2 = JSON.stringify(suc.data);
                            if (pp2 == undefined) {
                                pp2 = JSON.stringify(JSON.parse(suc).data);
                            }
                            $("#testStatus").html('<span class="layui-badge-dot layui-bg-orange"></span> <span style="color:orange;">接口正常</span>')
                            layer.msg("接口可用！返回内容：<br>" + pp2)
                        } else {
                            layer.msg("接口异常")
                        }
                    }, 1000)
                },
                error: function (xhr, state, errorThrown) {
                    apiStateNum = -1;
                    layer.open({
                        type: 3,
                        icon: 1,
                        time: 1000
                    })
                    setTimeout(() => {
                        $("#testStatus").html('<span class="layui-badge-dot layui-bg-red"></span> <span style="color:red;">接口异常</span>')
                        layer.msg("接口异常")
                    }, 1000)
                }
            })
        })

        // 监测api输入框的变化更改api测试区域
        $("#url").bind("input propertychange", function (event) {
            $("#testStatus").html('检测连通性')
        });
        $("#codeCus").bind("input propertychange", function (event) {
            $("#testStatus").html('检测连通性')
        });
        $("#parameter").bind("input propertychange", function (event) {
            $("#testStatus").html('检测连通性')
        });
        form.on('radio(method)', function (data) {
            $("#testStatus").html('检测连通性')
        });

        // Api 数据表格右侧功能区
        var ontableId;
        table.on('tool(apiTable)', function (obj) { //注：tool 是工具条事件名，test 是 table 原始容器的属性 lay-filter="对应的值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的 DOM 对象（如果有的话）
            ontableId = data._id;// 选中行的_id

            if (layEvent === 'test') { //测试api状态
                let parameter = data.parameter;
                $.ajax({
                    type: data.method,
                    url: data.url,
                    data: parameter,
                    success: function (suc) {
                        console.log(88, suc);
                        // data.testDoc = JSON.stringify( data);
                        data.apiState = 1;
                        // data._id = data._id;
                        $.ajax({ // 数据库的更新
                            type: "put",
                            url: "/api/update",
                            data: data
                        })
                        layer.open({
                            type: 3,
                            icon: 1,
                            time: 1000
                        })
                        setTimeout(() => {
                            tableReload(); // 数据表格重载调用
                            if (suc.code == 200 || JSON.parse(suc).code == 200) {
                                let pp2 = JSON.stringify(suc.data);
                                if (pp2 == undefined) {
                                    pp2 = JSON.stringify(JSON.parse(suc).data);
                                }
                                $("#testStatus").html('<span class="layui-badge-dot layui-bg-orange"></span> <span style="color:orange;">接口正常</span>')
                                layer.msg("接口可用！返回内容：<br>" + pp2)
                            }
                            else {
                                layer.msg("接口异常")
                                console.log(suc);
                            }
                        }, 1000)
                    },
                    error: function (xhr, state, errorThrown) {
                        data.apiState = -1;
                        $.ajax({ // 数据库的更新
                            type: "put",
                            url: "/api/update",
                            data: data
                        })
                        layer.open({
                            type: 3,
                            icon: 1,
                            time: 1000
                        })
                        setTimeout(() => {
                            $("#testStatus").html('<span class="layui-badge-dot layui-bg-red"></span> <span style="color:red;">接口异常</span>')
                            layer.msg("接口异常")
                            tableReload(); // 数据表格重载调用
                        }, 1000)
                    }
                })
            } else if (layEvent === 'testapiIsSeen') {// api前台是否展示
                console.log(data.isSeen, 779);
                let zz;
                if (data.isSeen == 1) {
                    zz = 0
                } else {
                    zz = 1
                }
                console.log(zz, 985);
                $.ajax({
                    type: "put",
                    url: "/api/update",
                    data: {
                        _id: data._id,
                        isSeen: zz
                    },
                    success: function (suc) {
                        if (suc.code == 0) {
                            if (data.isSeen == 1) {
                                layer.msg("已更改为 不可见")
                            } else {
                                layer.msg("已更改为 可见")
                            }
                            tableReload(); // 数据表格重载调用
                        } else if (suc.code == -1) {
                            layer.msg("接口异常")
                        }
                    }
                })
            }
            else if (layEvent === 'testapiImgSeen') { // 图标点击

                layer.open({
                    type: 1,
                    title: `${data.name} 的图标`,
                    btn: ["下载图片", "取消"],
                    content: `<div style="text-align:center;padding: 10px;"><img src="${data.apiImg}" style="min-height: 150px; max-height: 350px;"></div>` //这里content是一个普通的String
                    , yes: function () {
                        layer.msg("已启动下载...")
                        var a = document.createElement('a');              // 创建一个a节点插入的document
                        let gg = data.apiIm;
                        console.log(gg);
                        var event = new MouseEvent('click')               // 模拟鼠标click点击事件
                        a.download = '图标.png'                            // 设置a节点的download属性值,图片名称
                        a.href = `${data.apiImg}`;                              // 将图片的src赋值给a节点的href
                        a.dispatchEvent(event);
                        return false;
                    }
                });
            }
            else if (layEvent === 'del') { //删除
                layer.confirm(`是否删除 <font style="color:red;font-weight:bold;">${data.name}</font> `, { icon: 0, title: '警告', btn: ["是的", "取消"] }, function (index) {
                    obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                    layer.close(index);
                    //向服务端发送删除指令
                    $.ajax({
                        type: "delete",
                        url: "/api/del",
                        data: {
                            _id: data._id
                        },
                        success: function (suc) {
                            if (suc.code == 0) {
                                layer.msg("删除成功");
                                tableReload(); // 数据表格重载调用
                            } else if (suc.code == -1) {
                                layer.msg("删除失败")
                                tableReload(); // 数据表格重载调用
                            }
                        }
                    })
                });
            } else if (layEvent === 'edit') { //编辑
                //do something

                $("#testStatus").html('检测连通性');
                apiStateNum = data.apiState;
                aeUrl = "/api/update";
                aeType = "put";
                formGo(aeType, aeUrl);
                openadd = layer.open({
                    title: "Api编辑",
                    type: 1,
                    skin: "layui-layer-molv",
                    content: $("#aeApi"), //这里content是一个普通的String
                    yes: function () {
                        apiStateNum = "";
                    }
                });
                // 表单赋值
                apiHelpContent = data.helpDoc;
                if (data.apiState == 1) {
                    $("#testStatus").html('<span class="layui-badge-dot layui-bg-orange"></span> <span style="color:orange;">接口正常</span>')
                } else if (data.apiState == -1) {
                    $("#testStatus").html('<span class="layui-badge-dot layui-bg-red"></span> <span style="color:red;">接口异常</span>')
                }
                console.log(779, data.isSeen);
                let isSeenZt;
                if (data.isSeen == 1) {
                    isSeenZt = "on"
                } else {
                    isSeenZt = ""
                }
                form.val("aeApi", { //formTest 即 class="layui-form" 所在元素属性 lay-filter="" 对应的值
                    state: data.state,
                    date: data.date,
                    name: data.name,
                    method: data.method,
                    url: data.url,
                    parameter: data.parameter,
                    desc: data.desc,
                    helpDoc: data.helpDoc,
                    isSeen: isSeenZt,
                    docUrl: data.docUrl,
                    apiClass: data.apiClass,
                });

                //同步更新缓存对应的值
                obj.update({
                    username: '123'
                    , title: 'xxx'
                });
            } else if (layEvent === 'LAYTABLE_TIPS') {
                layer.alert('Hi，头部工具栏扩展的右侧图标。');
            } else if (layEvent == "helpDoc") { // 查看文档
                layer.open({
                    title: "查看文档",
                    type: 0,
                    content: data.helpDoc,
                    btn: ['编辑', '官方文档', "关闭"],
                    yes: function (index) {
                        let thisApiDoc = data.helpDoc;// 帮助文档的内容
                        let findex = index;
                        layedit.build('demo2'); //建立编辑器
                        seehelpDoc(thisApiDoc, data, findex);
                        return false
                    },
                    btn2: function () {
                        var Expression = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
                        if (Expression.test(data.docUrl)) {// 检测是否有协议头
                            window.open(data.docUrl);
                        } else {
                            window.open("http://" + data.docUrl);
                        }
                        return false
                    }
                })
            }
        });

        // 修改当前api帮助文档弹出框按钮样式
        var checkAllArr = [];
        table.on('checkbox(apiTable)', function (obj) {
            console.log(checkAllArr, 2);
            if (checkAllArr.findIndex((value) => value._id == obj.data._id) == -1) {
                checkAllArr.push(obj.data);
            } else {
                checkAllArr.splice(checkAllArr.findIndex((value) => value._id == obj.data._id), checkAllArr.findIndex((value) => value._id == obj.data._id) + 1)
            }
            // console.log(obj); //当前行的一些常用操作集合
            // console.log(obj.checked); //当前是否选中状态
            // console.log(obj.data); //选中行的相关数据
            // console.log(obj.type); //如果触发的是全选，则为：all，如果触发的是单选，则为：one
        });

        // code码自定义输入框提示
        $("#codeCus").focus(function () {
            var thistips = layer.tips('可自定义，默认：200', this, {
                tips: [1, '#1E9FFF']
            }); //在元素的事件回调体中，follow直接赋予this即可
            $("#codeCus").blur(function () {
                layer.close(thistips);
            })
        })

        // 头部刷新按钮
        $("#refresh").click(function () {
            tableReload();
            layer.msg("已刷新")
        })

        //头部事件
        util.event('lay-header-event', {
            //左侧菜单事件
            menuLeft: function (othis) {
                layer.msg('展开左侧菜单的操作', { icon: 0 });
            }
            , menuRight: function () {
                layer.open({
                    type: 1
                    , content: '<div style="padding: 15px;">处理右侧面板的操作</div>'
                    , area: ['260px', '100%']
                    , offset: 'rt' //右上角
                    , anim: 5
                    , shadeClose: true
                });
            }
        });
    });
}