// 库接口检测
$.ajax({
    type: "get",
    url: "/user/allApi",
    success: function (suc) {
        let normalCode = 0;
        let abnormalCode = 0;
        for (i = 0; i < suc.data.length; i++) {
            if (suc.data[i].apiState == 1) {
                normalCode++;
            } else if (suc.data[i].apiState == -1) {
                abnormalCode++;
            }
        }
        let otherCode = suc.data.length - normalCode - abnormalCode;
        $("#allApi").html(suc.data.length);// api总的数量
        $("#normalApi").html(normalCode);// api正常数量
        $("#abnormalApi").html(abnormalCode);// api异常数量
        $("#otherApi").html(otherCode);// api未检测数量
    }
})

// 登录状态验证
if (sessionStorage.getItem('loginState') == 1) {
    layer.msg("已登录，即将跳转到管理页面...", { time: 3000, shade: 0.8 });
    setTimeout(() => {
        window.location.href = "./apimgt.html";
    }, 3000)
} else {
    main()
}

// 第一次打开网页时渲染密码输入框
$("#password").attr("disabled", "");
$("#password").css("cursor", "no-drop");
var pwdBoxTips;
$("#pwdBox").mouseover(function () {
    if ($("#account").val() == "" && $("#password").attr("disabled") == "disabled") {
        pwdBoxTips = layer.tips('请先填写账号！', '#pwdBox', {
            tips: [1, "#1E9FFF"], time: 60000, tipsMore: true
        });
    } else {
        var passwordS;
        var passwordTipsFirst
        $("#password").focus(function () {
            passwordTipsFirst = layer.tips('宝贵的密码', '#password', {
                tips: [3, '#1E9FFF'], time: 50000, tipsMore: true,
                success: function () {
                    $(".layui-layer-tips").css({ 'margin': '-15px 0 0 0' }); //按钮位置 
                }
            });
            if (!(new RegExp(/\s/).test(($("#password").val())))) {
                layer.close(passwordS);
            }
        });
        $("#password").blur(function () {
            layer.close(passwordTipsFirst);
        });
        $("#password").keyup(function () {
            layer.close(passwordTipsFirst);
            passwordRegular();
        });
        function passwordRegular() {
            if (new RegExp(/\s/).test(($("#password").val()))) {
                passwordS = layer.tips('密码不能有空格！', '#password', {
                    tips: [1, '#1E9FFF'], time: 10000
                });
            } else if (!(new RegExp(/\s/).test(($("#password").val())))) {
                layer.close(passwordS);
            }
        }
    }
})
$("#pwdBox").mouseout(function () {
    layer.close(pwdBoxTips);
})
// 密码输入条件验证

// 账号输入条件验证 
layer.tips('支持账号和邮箱登录', '#account', {
    tips: [1, '#1E9FFF'], time: 5000, tipsMore: true,
    success: function () {
        $(".layui-layer-tips").css({ 'margin': '-15px 0 0 0' }); //按钮位置 
    }
});

$("#account").keyup(function () {
    layer.closeAll('tips');
    accountRegular();
})
$("#account").blur(function () {
    accountRegular();
})
function accountRegular() {
    if ($("#account").val() == "") {
        $("#password").attr("disabled", "");
        $("#password").css("cursor", "no-drop");
    } else if (new RegExp("[\u4e00-\u9fa5]").test($("#account").val())) {
        // $("#account").val("");
        layer.tips('账号不能有中文字符！', '#account', {
            tips: [1, '#1E9FFF'], time: 10000
        });
        $("#password").attr("disabled", "");
        $("#password").css("cursor", "no-drop");
    } else if (new RegExp("@").test($("#account").val())) {
        if (!/\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/.test($("#account").val())) {
            layer.tips('邮箱格式不完整，如：*@qq.com', '#account', {
                tips: [1, '#1E9FFF']
            });
            $("#password").attr("disabled", "");
            $("#password").css("cursor", "no-drop");
        } else {
            $("#password").removeAttr("disabled");
            $("#password").css("cursor", "");
        }
    } else if (new RegExp(/\s/).test(($("#account").val()))) {
        layer.tips('账号不能空格！', '#account', {
            tips: [1, '#1E9FFF'], time: 10000
        });
        $("#password").attr("disabled", "");
        $("#password").css("cursor", "no-drop");
    }
    else {
        $("#password").removeAttr("disabled");
        $("#password").css("cursor", "");
    }
};

function main() {
    layui.use(['element', 'layer', 'flow'], function () {
        var element = layui.element
            , layer = layui.layer // 弹出层模块
            , flow = layui.flow // 图片懒加载模块
            , $ = layui.$;

        flow.lazyimg();// 图片懒加载

        // 输入框重载
        function formReload(test) {
            if (test == 1) {
                $("#account").val("");
            } else if (test == 2) {
                $("#password").val("");
            } else {
                $("#account").val("");
                $("#password").val("");
            }
        };
        // formReload(); // 输入框重载调用

        // 登录信息验证
        $("#loginGo").click(function () {
            loginMain();
        })
    });

    function loginMain() {
        if ($("#account").val() == "") {
            layer.msg("请输入账号！");
        } else if ($("#password").val() == "") {
            layer.msg("请输入密码！");
        } else {
            $.ajax({
                type: "get",
                url: "/user/getuser",
                data: {
                    account: $("#account").val(),
                    password: $("#password").val()
                },
                success: function (suc) {
                    console.log(suc);
                    if (suc.code == 200) {
                        layer.load(1, { time: 1000, shade: .3 });
                        setTimeout(() => {
                            layer.msg("<i class='layui-icon layui-icon-loading-1 layui-anim layui-anim-rotate'></i> 登录成功，正在跳转...", { time: 1000 });
                            setTimeout(() => {
                                sessionStorage.setItem('loginState', 1); // 传入登录状态
                                sessionStorage.setItem('userHeadImg', suc.data[0].headImg); // 传入账号头像
                                sessionStorage.setItem('userName', suc.data[0].name); // 传入账号名称
                                sessionStorage.setItem('email', suc.data[0].email); // 传入账号邮箱
                                sessionStorage.setItem('qq', suc.data[0].qq); // 传入账号QQ
                                console.log(sessionStorage);
                                window.location.href = "./apimgt.html";
                            }, 1000)
                        }, 1000);
                    } else if (suc.code == 150) {
                        layer.load(1, { time: 1000, shade: .3 });
                        setTimeout(() => {
                            layer.msg("密码错误，请重新输入密码", { time: 3000 });
                            formReload(2);
                        }, 1000);
                    } else if (suc.code == -1) {
                        layer.load(1, { time: 1000, shade: .3 });
                        setTimeout(() => {
                            layer.msg("账号错误，请重新输入账号", { time: 3000 });
                            formReload();
                        }, 1000);
                    } else {
                        layer.load(1, { time: 1000, shade: .3 });
                        setTimeout(() => {
                            layer.msg("未知错误", { time: 3000 });
                        }, 1000);
                    }
                },
                error: function () {
                    layer.msg("服务器错误");
                }
            })
        }
    }
}

// 右边提示按钮
var tipsT;
$("#tips").mouseover(function () {
    tipsT = layer.tips('使用sessionStorage存储技术，关闭窗口则退出登录', '#tips', {
        tips: [4, "#696"], time: 60000, tipsMore: true,
        area: ['auto', 'auto'],
        success: function () {
            $(".layui-layer-tips").css({ 'margin': '-15px 0 0 0' }); //按钮位置 
        }
    });
});
$("#tips").mouseout(function () {
    layer.close(tipsT);
});

// 输入框选中效果
$(".inputBox input").focus(function () {
    $(this).closest('.inputBox').css("border", "1px solid #1890ff")
})
$(".inputBox input").blur(function () {
    $(this).closest('.inputBox').css("border", "none")
})