var express=require("express");
var bodyParser=require("body-parser");
var mongoose=require("mongoose");
var methodOverride=require("method-override");
var flash=require("connect-flash");
var fs = require('fs');

var Book=require("./models/book");

var app=express();
app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());

app.use(require("express-session")({
    secret:"Highly Confidential 5XGVLGBHB65555",
    resave: false,
    saveUninitialized: false
}));


//MIDDLEWARE
app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    res.locals.info=req.flash("info");
    next();
})

var url= "mongodb://localhost/booksDB"; 
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true});

app.locals.moment=require('moment');

//=========================================================================
//-------- ROUTES ----------
//=========================================================================

// 1. STORY ROUTES
//INDEX

app.get("/books",function(req,res){
    // res.render("books/index");
    Book.find(function (err, books) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("books/index", { books: books, page: 'home'});
        }
    });
})
app.get("/", function(req,res){
    res.redirect("/books");
});
//NEW
app.get("/books/new",function(req,res){
    res.render("books/new");
})

//CREATE
app.post("/books", function(req,res){
    var title=req.body.title;
    var image=req.body.image;
    var description=req.body.description;
    var price=req.body.price;
    var newBook = {title:title, image:image, description:description, price:price};
    Book.create(newBook, function (err, newlyCreated) {
        if (err) {
            console.log(err);
            req.flash('error', err.message);
            res.redirect('back');
        } else {
            console.log(newlyCreated);
            // var obj= JSON.parse(newlyCreated);
            req.flash("info","You added a new Book: "+ newlyCreated.title);
            res.redirect("/books");
            let json = JSON.stringify(newlyCreated);
            fs.writeFile('book.json', json, 'utf8', function (error, success){
                if(error){
                    console.log(error);
                }
            });
        }
    });
});

//SHOW
app.get("/books/:id",function(req,res){
    Book.findById(req.params.id).exec(function(err,foundBook){
        if(err || !foundBook){
            req.flash("error","Story not found");
            res.redirect("back");
        } else {
            res.render("books/show",{specificBook:foundBook});
        }
    });
})

//EDIT
app.get("/books/:id/edit", function(req,res){
    Book.findById(req.params.id, function(err, foundBook){
        res.render("books/edit",{book:foundBook});
    })
})

//UPDATE
app.put("/books/:id", function(req,res){
    Book.findByIdAndUpdate(req.params.id, req.body.book, function (err, updatedBook) {
        if (err) {
            req.flash("error", err.message);
            res.redirect("back");
        }
        else {
            req.flash("info", "You edited " + updatedBook.title);
            res.redirect("/books/" + req.params.id);
        }
    })
})

//DESTROY or DELETE route
app.delete("/books/:id", function(req,res){
    Book.findByIdAndRemove(req.params.id, function(err, book){
        if(err){
            req.flash("error", err.message);
            return res.redirect("back");
        }
        req.flash("info","You deleted "+book.title);
        res.redirect("/books");
    })
})

//SERVER LISTEN
app.listen(8080,function(){
    console.log("The Server has started n port 8000");
})