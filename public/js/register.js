// 账号输入条件验证 
var accountTipsFirst = layer.tips('请勿输入中文字符和空格！', '#account', {
    tips: [3, '#1E9FFF'], time: 50000, tipsMore: true,
    success: function () {
        $(".layui-layer-tips").css({ 'margin': '-15px 0 0 0' }); //按钮位置 
    }
});
$("#account").keyup(function () {
    accountRegular();
});
function accountRegular() {
    if ($("#account").val() != "") {
        layer.close(accountTipsFirst);
        if (new RegExp("[\u4e00-\u9fa5]").test($("#account").val())) {
            layer.tips('账号不能有中文字符！', '#account', {
                tips: [1, '#1E9FFF'], time: 10000
            });
        } else if (new RegExp("@").test($("#account").val())) {
            if (!/\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/.test($("#account").val())) {
                layer.tips('邮箱格式不完整，如：*@qq.com', '#account', {
                    tips: [1, '#1E9FFF']
                });
            }
        } else if (new RegExp(/\s/).test(($("#account").val()))) {
            layer.tips('账号不能空格！', '#account', {
                tips: [1, '#1E9FFF'], time: 10000
            });
            $("#password").attr("disabled", "");
            $("#password").css("cursor", "no-drop");
        }
    };
};

// 密码输入条件验证
var passwordS;
var passwordTipsFirstF;
$("#password").focus(function () {
    layer.close(accountTipsFirst);
    passwordTipsFirst = layer.tips('最好拿个小本本记一下哟！', '#password', {
        tips: [3, '#1E9FFF'], time: 50000, tipsMore: true,
        success: function () {
            $(".layui-layer-tips").css({ 'margin': '-15px 0 0 0' }); //按钮位置 
        }
    });
    if (!(new RegExp(/\s/).test(($("#password").val())))) {
        layer.close(passwordS);
    }
});
$("#password").keyup(function () {
    layer.close(passwordS);
    passwordRegular();
});
$("#password").blur(function () {
    layer.close(passwordTipsFirst);
});
function passwordRegular() {
    if (new RegExp(/\s/).test(($("#password").val()))) {
        passwordS = layer.tips('密码不能有空格！', '#password', {
            tips: [1, '#1E9FFF'], time: 10000, tipsMore: true
        });
    } else if (!(new RegExp(/\s/).test(($("#password").val())))) {
        layer.close(passwordS);
    }
}

// 注册提交条件验证
// JS
layui.use(['element', 'layer', 'form'], function () {
    var element = layui.element
        , layer = layui.layer
        , form = layui.form
        , $ = layui.$;
    $("#registerGo").click(function () {
        if ($("#accountName").val() == "" && $("#account").val() != "" && $("#password").val() != "") {
            layer.tips('还没有给自己取名称哟~', '#accountName', {
                tips: [1, '#1E9FFF'], time: 10000
            });
        }
    })

    form.on('submit(formDemo)', function (data) {
        console.log($("#accountName").val());
        if (new RegExp("[\u4e00-\u9fa5]").test($("#account").val())) {
            layer.tips('账号不能有中文字符！', '#account', {
                tips: [1, '#1E9FFF'], time: 10000
            });
            return false;
        } else if (new RegExp("@").test($("#account").val())) {
            if (!/\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/.test($("#account").val())) {
                layer.tips('邮箱格式不完整，如：*@qq.com', '#account', {
                    tips: [1, '#1E9FFF']
                });
            }
            return false;
        } else if (new RegExp(/\s/).test(($("#account").val()))) {
            layer.tips('账号不能空格！', '#account', {
                tips: [1, '#1E9FFF'], time: 10000
            });
            $("#password").attr("disabled", "");
            $("#password").css("cursor", "no-drop");
            return false;
        } if (new RegExp(/\s/).test(($("#password").val()))) {
            passwordS = layer.tips('密码不能有空格！', '#password', {
                tips: [1, '#1E9FFF'], time: 10000
            });
            return false;
        } else {

            let formArr = data.field;// 获取表里的所有value
            console.log(formArr.account);
            $.ajax({
                type: "post",
                url: "/user/adduser",
                data: {
                    state: -1,
                    account: formArr.account,
                    password: formArr.password,
                    name: formArr.accountName,
                    qq: formArr.qq,
                    email: formArr.email
                },
                success: function (suc) {
                    if (suc.code == 200) {
                        layer.load(1, { time: 1000, shade: .3 });
                        setTimeout(() => {
                            layer.msg("<i class='layui-icon layui-icon-loading-1 layui-anim layui-anim-rotate'></i> 注册成功，正在跳转登录页面...", { time: 1000 });
                            setTimeout(() => {
                                window.location.href = "./login.html";
                            }, 1000);
                        }, 1000);
                    } else if (suc.code == -1) {
                        layer.load(1, { time: 1000, shade: .3 });
                        setTimeout(() => {
                            layer.msg("账号已被注册，请重新输入账号", { time: 1000 });
                            formReload();
                        }, 1000);
                    } else if (suc.code == 520) {
                        layer.load(1, { time: 1000, shade: .3 });
                        setTimeout(() => {
                            layer.msg("未知错误", { time: 1000 });
                        }, 1000);
                    } else {
                        layer.load(1, { time: 1000, shade: .3 });
                        setTimeout(() => {
                            layer.msg("未知错误", { time: 1000 });
                        }, 1000);
                    }
                },
                error: function () {
                    console.log("服务器错误");
                }
            })
            return false;
        }
    });

    // 表单重载
    function formReload() {
        form.val("form", { //aeApi 即 class="layui-form" 所在元素属性 lay-filter="" 对应的值
            account: '',
            password: ''
        });
        $("#testStatus").html('检测连通性');
    };
    // formReload(); // 弹窗表单重载调用
})