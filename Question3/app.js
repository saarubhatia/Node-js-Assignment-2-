var express=require("express");
var bodyParser=require("body-parser");
var mongoose=require("mongoose");
var methodOverride=require("method-override");
var app=express();
app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));

var url= "mongodb://localhost/contactsDB"; 
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true});

//=========================================================================
//-------- ROUTES ----------
//=========================================================================
 var newContact={};
//NEW
app.get("/addContacts/new",function(req,res){
    res.render("new");
})

//CREATE
app.post("/addContacts", function(req,res){
    var name=req.body.name;
    var city=req.body.city;
    var phone=req.body.phone;
    var Contact={name:name, city:city, phone:phone}
    res.redirect("/displayContacts/" + city + "/"+ phone);
    newContact=Contact;
    });
    
var checkName = function (req, res, next) {
    if (newContact.name === "Amit") {
        res.status(202);
        next();
    } else {
        res.status(404).send("<h1> OOPS! That's an Error!!! :( </h1>");
    }
}

app.get("/displayContacts/:city/:phone", checkName, function(req,res){
    res.render("display", {city:req.params.city, phone:req.params.phone, name:req.params.name});
});

//SERVER LISTEN
app.listen(8000,function(){
    console.log("The Server has started n port 8000");
})
