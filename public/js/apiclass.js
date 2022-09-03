// 登录状态验证
console.log(sessionStorage);
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
    }, 1500)
})

function main() {

    // 用户信息渲染
    console.log(sessionStorage);
    let userName = sessionStorage.getItem('userName');
    $("#userName").html(userName);
    $("#userHeadImg").attr("src", sessionStorage.getItem('userHeadImg'))

    // 分类列表获取和重载
    function classGet() {
        $(".bigBox").html("");
        $.ajax({// api分类数据
            type: "get",
            url: "/user/apiclass",
            data: {

            },
            success: function (suc) {
                for (i = 0; i < suc.data.length; i++) {
                    let pp;
                    if (suc.data[i].isSeen == 1) {
                        pp = "on";
                    } else {
                        pp = "off";
                    }
                    $(".bigBox").append(`
                    <div class="layui-card">
                        <div class="layui-card-header">${suc.data[i].name}
                            <div class="fa fa-toggle-${pp}" id="onOff" data-isSeen="${suc.data[i].isSeen}" data-_id="${suc.data[i]._id}"></div>
                        </div>
                        <div class="layui-card-body">描述：${suc.data[i].desc}</div>
                        <div class="layui-card-body" style="text-align:center;">
                        <button id="ggg" data-name="${suc.data[i].name}" dataNum="${i}" class="layui-btn layui-btn-primary layui-border-green">点我查看分类列表</button>
                        </div>
                        <div class="layui-card-body" id="apiArr" apiArrdataNum="${i}"></div>
                    </div>
                `);
                }
            }
        })
    } classGet();

    // 更改状态
    $(".bigBox ").click(".layui-card", function (e) {
        var onOffNum = "";
        if ($(e.target).attr("data-isSeen") == 1) {
            onOffNum = 0;
        } else if ($(e.target).attr("data-isSeen") == 0) {
            onOffNum = 1;
        }
        if ($(e.target).attr("data-isSeen") != undefined) {
            console.log(onOffNum, 99);
            console.log($(e.target).attr("data-_id"));
            $.ajax({
                type: "put",
                url: "/api/apiclassUpdate",
                data: {
                    _id: $(e.target).attr("data-_id"),
                    isSeen: onOffNum
                }
            })
        }
        classGet();
    })

    // 点击查看分类下的api数据
    $(".bigBox ").click("#ggg", function (e) {
        $.ajax({
            type: "get",
            url: "/user/allApi",
            data: {
                apiClass: $(e.target).attr("data-name")
            },
            success: function (suc) {
                let ll = `button[dataNum = ${$(e.target).attr("datanum")}]`;
                $(ll).html(`<i class="layui-icon layui-icon-loading-1 layui-anim layui-anim-rotate layui-anim-loop"></i> 获取中`)
                setTimeout(() => {
                    $(ll).html("点我刷新数据");
                    let zg = `div[apiArrdataNum = ${$(e.target).attr("datanum")}]`;
                    for (i = 0; i < suc.data.length; i++) {
                        console.log(zg);
                        $(zg).append(
                            `<div class="apiArrC">${i+1}&nbsp;${suc.data[i].name}</div>`
                        )
                    }
                }, 500)
            }
        })

    })

    // 头部刷新按钮
    $("#refresh").click(function () {
        classGet();
    })

    layui.use(['element', 'layer', 'util', 'table', 'form', 'layedit'], function () {
        var element = layui.element
            , layer = layui.layer
            , util = layui.util
            , table = layui.table
            , form = layui.form
            , layedit = layui.layedit
            , $ = layui.$;


        // api分类添加
        $("#addClass").click(() => {
            layer.msg("被选中了");
            openadd = layer.open({
                title: "添加分类",
                type: 1,
                maxmin: true,
                skin: "layui-layer-molv",
                content: $("#aeApiClass"), //这里content是一个普通的String
                cancel: function () {
                    // 右上角关闭事件的逻辑
                    $("#addApi").attr("data-click", "true");
                }
            });
            formGo();
            // formGo(aeType, aeUrl);
        })

        // 监听提交
        function formGo(aeType, aeUrl,) {
            form.on('submit(formDemo)', function () {
                console.log(2);
                var formData = form.val("aeApiClass");// 获取表单的所有内容
                console.log(formData);
                if (formData.isSeen == "on") {
                    isSeen = 1
                } else {
                    isSeen = 0
                }
                $.ajax({
                    type: "post",
                    url: "/user/apiclass",
                    data: {
                        name: formData.name,
                        desc: formData.desc,
                        isSeen: isSeen
                    },
                    success: function (suc) {
                        layer.msg("添加成功");
                        setTimeout(() => {
                            classGet();
                        }, 3000)
                    }
                })
            })
        }

    })
}