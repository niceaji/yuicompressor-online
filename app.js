
/**
 * Module dependencies.
 */

var express = require('express')
  , fs = require('fs')
  , exec = require('child_process').exec;
  // , routes = require('./routes');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  // app.set('views', __dirname + '/views');
  // app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  // app.use(app.router);
  // app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes
// req.params , req.body , req.files
app.get('/', function(req ,res){

  res.end(fs.readFileSync("index.html"));

});

app.post('/compress', function(req, res){
 
  var upfile = req.files.upfile ,
      fileName = upfile.name,

      extType = fileName.substring( fileName.lastIndexOf('.') + 1 , fileName.length),
      targetPath = "./output/" + (new Date()).getTime() ,
      tmpPath = upfile.path;


  var options = {
      type : req.body.type || extType, // js|css
      charset : req.body.charset || "utf-8",
      linebreak : req.body.linebreak || "1000"
  };


  var order = [];

  order.push("java -jar lib/yuicompressor-2.4.7.jar");

  if(options.type) {
    order.push("--type "+options.type);
  }
  if(options.charset) {
    order.push("--charset "+options.charset);
  } 
  if(options.linebreak) {
    order.push("--line-break "+options.linebreak);
  } 

  order.push("-o " + targetPath);
  order.push(tmpPath);

  order = order.join(" ");

  //console.log(order);

  exec(order, function(error, stdout, stderr){
    var output = "";
    console.log(stdout, stderr);

    if(error){
    }
    else {

      var output = fs.readFileSync(targetPath);
      res.end(output);
      fs.unlinkSync(targetPath);

    }
  });

});


app.listen(9999, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});



