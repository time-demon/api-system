const { json } = require('express');
var express = require('express');
var router = express.Router();
var db = require("ykt-mongo");

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

// API数据 获取
router.get('/user/allApi', function (req, res, next) {
  db.collection("apis").find(req.query, function (items) {
    res.send({
      code: 0,
      data: items,
      msg: "成功"
    })
  })
});

// 用户信息 验证
router.get('/user/getuser', function (req, res, next) {
  let account = req.query.account;
  let password = req.query.password;
  db.collection("users").find({ account: account }, function (items) {
    console.log(77, items);
    delete items.password;
    if (items.length != 0) {
      if (items[0].password == password) {
        res.send({
          code: 200,
          data: items,
          msg: "登录成功"
        })
      } else {
        res.send({
          code: 150,
          msg: "密码错误"
        })
      }
    } else {
      res.send({
        code: -1,
        msg: "账号错误"
      })
    }
  })
});

// 用户信息 添加
router.post('/user/adduser', function (req, res, next) {
  console.log(44, req.body);
  let account = req.body.account;
  db.collection("users").find({ account: account }, function (items) {
    if (items.length == 0) {
      db.collection("users").insert(req.body, function (items2) {
        console.log(1, items2);
        if (items2.result.ok == 1 && items2.result.n == 1) {
          res.send({
            code: 200,
            msg: "成功注册"
          })
        } else {
          res.send({
            code: 520,
            msg: "未知错误"
          })
        }
      })
    } else {
      res.send({
        code: -1,
        msg: "账号已被注册"
      })
    }
  })
})



module.exports = router;
