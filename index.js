require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const port = process.env.PORT || 3000;
const nodemailer = require("nodemailer");
const date = require(__dirname+ "/date");

const app = express();


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://"+process.env.MONGO_USER+":"+process.env.MONGO_PASSWORD+"@ultimatecodexdb.y5zkr.mongodb.net/ultimatecodexDB?retryWrites=true&w=majority/ultimatecodexDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const blogSchema={
  title:String,
  content:String,
  authur:String,
  category:String,
  date:String,
  imageURL:String
}

const projectSchema={
  title:String,
  imageURL:String
}

const Project = mongoose.model("project",projectSchema);

const Blog = mongoose.model("blog",blogSchema);


var transporter = nodemailer.createTransport({
  service:'gmail',
  auth:{
    user:'ulticodex@gmail.com',
    pass:process.env.PASSWORD
  }
});



app.get("/",function(req,res){
  res.render("home");
});
app.get("/about",function(req,res){
  res.render("about");
});
app.get("/contact",function(req,res){
  res.render("contact");
});

app.get("/projects",function(req,res){
Project.find(function(err,result){
  if(err){
    console.log(err);
  }else{
    res.render("projects",{posts:result});
  }
});
});
app.get("/blogs",function(req,res){
Blog.find(function(err,result){
  if(err){
    console.log(err);
  }else{
    res.render("blogs",{posts:result});
  }
});

});
app.get("/:route/post",function(req,res){
  const routeName=req.params.route;
  if(routeName==="projects")
  {
  res.render("projectform");
}else if(routeName==="blogs"){
  res.render("blogform");
}
});

app.get("/blogs/post/:route",function(req,res){
  const routeName=req.params.route;
  Blog.findOne({_id:routeName},function(err,result){
    if(!err){
      res.render("blogpost",{post:result})
    }
  });
});

app.post("/projects/post",function(req,res){
  if(req.body.password===process.env.PASSWORD)
  {
  const project= new Project({
    title:req.body.title,
    imageURL:req.body.imageURL
  });
  project.save(function(err){
    if(!err){
      res.redirect("/projects");
    }
  });
}else{
  res.redirect("/projects");
}
});

app.post("/blogs/post",function(req,res){
  if(req.body.password===process.env.PASSWORD)
  {
  const blog= new Blog({
    title:req.body.title,
    content:req.body.content,
    authur:(req.body.authur).toUpperCase(),
    category:(req.body.category).toUpperCase(),
    date:date.toUpperCase(),
    imageURL:req.body.imageURL
  });
  blog.save(function(err){
    if(!err){
      res.redirect("/blogs");
    }
  });
}else{
  res.redirect("/blogs");
}
});

app.post("/contact",function(req,res){
  var mailOptions ={
    from:'ulticodex@gmail.com',
    to:'ulticodex@gmail.com',
    subject:'[UltimateCodex Website] Message from '+req.body.name+"---"+ req.body.email,
    text: req.body.content
  };
  transporter.sendMail(mailOptions,function(error,info){
    if(error){
      console.log(error);
      res.render("contact");
    }else{
      console.log("Email sent "+info.response);
      res.redirect("/contact");
    }
  });

});


app.listen(port, function() {
  console.log("Server started on port "+port);
});
