var express = require('express');
var router = express.Router();
var db = require("ykt-mongo");
let multiparty = require("multiparty");
let path = require("path");
const { log } = require('console');

/* GET home page. */
router.get('/', function (req, res, next) {
  // res.render('index', { title: 'Express' });
  res.send({
    code: 0,
  })
});

// API数据 获取
router.get('/api/getdata', function (req, res, next) {
  let { page, limit } = req.query;
  db.collection("apis").findByPage(page, limit, {}, function (items) {

    res.send({
      code: 0,
      count: items.total,
      data: items.rows,
      msg: "成功"
    })
  })
});

// API数据 添加
router.post('/api/add', function (req, res, next) {
  delete req.body._id;
  console.log(99, req.body);
  db.collection("apis").insert(req.body, function (items) {
    res.send({
      code: 0,
      count: items.total,
      data: items.rows,
      msg: "成功"
    })
  })
});

// API数据 删除
router.delete('/api/del', function (req, res, next) {
  let { _id } = req.body;
  _id = db.ObjectID(_id);
  db.collection("apis").remove({ _id: _id }, function (items) {
    // console.log(items);
    if (items.result.n == 1 && items.result.ok == 1) {
      res.send({
        code: 0,
        msg: "成功"
      })
    } else {
      res.send({
        code: -1,
        msg: "失败"
      })
    }
  });
});

// API数据 编辑
router.put('/api/update', function (req, res, next) {
  console.log(req.body, 10);
  let _id = db.ObjectID(req.body._id);
  _id = db.ObjectID(_id);
  obj = JSON.parse(JSON.stringify(req.body));
  delete obj._id;
  db.collection("apis").update({ _id }, { $set: obj }, function (items) {
    // console.log(items);
    if (items.result.n == 1 && items.result.ok == 1) {
      res.send({
        code: 0,
        msg: "成功"
      });
    } else {
      res.send({
        code: -1,
        msg: "失败"
      })
    }
    ;
  });
});

//// API数据 查询
router.get('/api/search', function (req, res, next) {
  console.log(2, req.query);
  db.collection("apis").findByPage(req.query.page, req.query.type.limit, { [req.query.type]: req.query.content }, function (items) {
    console.log(items);
    res.send({
      code: 0,
      count: items.total,
      data: items.rows,
      msg: "成功"
    })
  })
})

// api分类获取
router.get('/user/apiclass', function (req, res, next) {
  db.collection("apiClass").find(function (items) {
    res.send({
      code: 0,
      data: items,
      msg: "成功"
    })
  })
});

// api分类添加
router.post('/user/apiclass', function (req, res, next) {
  db.collection("apiClass").insert(req.body, function (items) {
    res.send({
      code: 0,
      data: items,
      msg: "成功"
    })
  })
});

// API分类更新
router.put('/api/apiclassUpdate', function (req, res, next) {
  console.log(req.body, 999);
  let _id = db.ObjectID(req.body._id);
  _id = db.ObjectID(_id);
  obj = JSON.parse(JSON.stringify(req.body));
  delete obj._id;
  db.collection("apiClass").update({ _id }, { $set: obj }, function (items) {
    console.log(items, 665);
    if (items.result.n == 1 && items.result.ok == 1) {
      res.send({
        code: 0,
        msg: "成功"
      });
    } else {
      res.send({
        code: -1,
        msg: "失败"
      })
    }
    ;
  });
});

// Api预览图上传
router.post("/upload", (req, res, next) => {
  let form = new multiparty.Form({
    uploadDir: "./public/upload"  //指定保存上传文件的路径
  })
  form.parse(req, function (err, fields, files) {
    let key = Object.keys(files)[0] //获取上传信息中的key
    if (err) {
      res.send(err)
    } else {
      res.send({
        code: 0,
        url: path.basename(files[key][0].path)
      }) //根据key获取上传的文件名并返回
    }
  })
})

module.exports = router;
