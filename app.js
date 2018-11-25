var express = require('express');
// APP  路由返回值
var app = express();
var fs = require('fs');
var ejs = require('ejs');
var bodyParser = require("body-parser");

var path = require("path");
var timestamp = require('time-stamp');
var multer = require('multer')

var upload = multer({ dest: 'temp/' });

app.use(bodyParser.urlencoded({ extended: false }));

// 表单提交到自身
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    fs.readdir("./photodata", function (err, files) {
        console.log(files)
        res.render("index", { dirname: files });

    })

});
///photodata/No1/1.jpg"
app.get("/show/:b", (req, res) => {
    var path = req.params["b"]
    console.log(path)
    fs.readdir("./photodata/" + path, function (err, files) {
        if(err) res.render("jump", { msg: "该相册不存在!！",flag:"" });
        console.log(files)
        res.render("show2", { dirname: path, photoname: files });
    })

});
app.get("/photodata/:dir/:photo", (req, res) => {
    var path = req.params["dir"];
    var photo = req.params["photo"];
    res.sendFile(__dirname + "/" + "photodata/" + path + "/" + photo);
});

app.get("/deldir/:dir", (req, res) => {
    var dir = req.params["dir"];
    console.log(dir)
    fs.readdir("./photodata/" + dir, function (err, files) {
        if(err) res.render('jump', { msg: "出错了!!! ",flag:"" });
        if( files.length>=1){
            for (var i = 0; i < files.length; i++) {
                fs.unlinkSync ("./photodata/" + dir +"/"+ files[i], function (err) {
                    if(err) res.render('jump', { msg: "出错了!!! ",flag:"" });
                })           
            }           
        } 
        fs.rmdir("./photodata/" + dir, function (err) {
            if(err) res.render('jump', { msg: "出错了!!! ",flag:"" });
            res.render("jump", { msg: "删除成功!",flag:"" });
        })
    })
});

app.get("/photodel/:dir/:photo", (req, res) => {
    var dir = req.params["dir"];
    var photo=req.params["photo"];
    console.log(dir)   
    fs.unlinkSync ("./photodata/" + dir +"/"+ photo, function (err) {
      //if(err) res.render('jump', { msg: "出错了!!! ",flag:"" });
      if(err) res.end('0');
    })      
    //res.render("jump", { msg: "删除成功!",flag:dir });    
    res.end('1') 
});

app.get("/show/static/:type/:name",(req,res)=>{
    var name = req.params["name"];
    var type = req.params["type"];
    res.sendFile(__dirname + "/static/"+type+"/"+name  );
})


app.post('/newdir', function (req, res) {
    var dir = req.body.dirname;
    console.log(req.body)
    fs.mkdir("./photodata/" + dir, function (err) {
        if(err) res.render('jump', { msg: "出错了!!! ",flag:"" });
        res.render("jump", { msg: "添加成功!",flag:dir });
    })
});

app.post('/newphoto/:dir', upload.single('file'), function (req, res, next) {
    if(req.body.dirname){
        console.log('1');
        var dir = req.body.dirname;
    }else{
        console.log('2');
         var dir = req.params["dir"]
    }
    console.log(dir);
    console.log(req.file);
    console.log(req.file.originalname);
    var time = timestamp("YYYYMMDDHHMMss");
    var rand = Math.floor(Math.random() * 8999 + 1000);
    var extname = path.extname(req.file.originalname)
    console.log(extname);
    var oldP = __dirname + '/' + req.file.path;
    var newP = __dirname + '/photodata/' + dir + '/' + time + rand + extname;
    fs.rename(oldP, newP, function (err) {
        if (err) throw err;
    });
    res.render("jump", { msg: "上传成功!",flag:dir });
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
})

app.use(function(req,res){
    res.render('jump', { msg: "出错了!!! ",flag:"" })
})


app.listen(3333);