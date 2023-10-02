
import express from "express";
import bodyParser from "body-parser";
import {dirname} from "path";
import path from "path";
import { fileURLToPath } from "url";
import ejs from "ejs";
import mongoose from "mongoose";
import _ from "lodash";
// import ServerlessHttp from "serverless-http";

mongoose.connect("mongodb+srv://jeevanreddy:ultimategohan@cluster0.zib2kc1.mongodb.net/todolist");

const newschema= new mongoose.Schema({
    name:{
        type:String,
        required:[true]
    }
});

const newmodel= mongoose.model("object",newschema);
const list1=new newmodel({
    name:"Wash Clothes"
});
const list2=new newmodel({
    name:"Study webdevelopment"
});
var newitem=[list1,list2];
const listschema=new mongoose.Schema({
    name:String,
    item:[newschema]
})
const List=mongoose.model("List",listschema);


const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

// module.exports.handler=ServerlessHttp(app);
const port = 3000;
app.set('view engine','ejs');
var Days = ['Sunday', 'Monday', 'Tuesday',
                'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          
var Months = ['January', 'February', 'March', 'April',
                'May', 'June', 'July', 'August', 'September',
                'October', 'November', 'December'];
app.use(express.static(path.join(__dirname,'public')));         
app.use(bodyParser.urlencoded({ extended: true }));
//let newitem=[];
app.get("/",async(req,res)=>{
    var now=new Date();
    var date=now.getDay();
    if((await newmodel.find({})).length===0){
        newmodel.insertMany(newitem);
        res.redirect("/");
    }else{
    res.render("index.ejs",{whatnow:Days[date]+", "+Months[now.getMonth()]+" "+now.getDate(),Listnewitem:await newmodel.find({}),listname:""});
    }
})


app.get("/:customlistname",async(req,res)=>{
    const customerlistname= _.capitalize(req.params.customlistname);
    var now=new Date();
    var date=now.getDay();
    const liste =await List.find({name:customerlistname});
    // console.log(liste[0].item[0].name);
    // console.log(liste.length===0);
   if(liste.length===0){
        
        
        const list= new List({
            name:customerlistname,
            item:newitem
        });
        list.save();
       res.redirect("/"+customerlistname);
    } else{
        
        res.render("index.ejs",{whatnow:Days[date]+", "+Months[now.getMonth()]+" "+now.getDate(),Listnewitem: liste[0].item,listname:liste[0].name});

        
    }
    
   
}
)
/*app.post("/submit",(req,res)=>{
    console.log(req.body);
    var now=new Date();
    var date=now.getDay();
    res.render("index.ejs",{whatnow:Days[date]+", "+Months[now.getMonth()]+" "+now.getDate(),check:1,list:req.body["todo"]});
})*/
app.post('/',async (req,res)=>{
    let newite=req.body.todo;
    let listname=req.body.listname;
    let newitemobj=new newmodel({
        name:newite
    })
    
    if(listname===""){
        newitemobj.save();
        res.redirect('/');
    }else{
        const foundlist=await List.find({name:listname});
        
        foundlist[0].item.push(newitemobj);
        foundlist[0].save();
        res.redirect("/"+listname);
    }
    
    //newmodel.insertMany(newitemobj);
    
})
app.post('/delete',async(req,res)=>{
    
    const listyname=req.body.listyname;
   
    if(listyname===""){
        await newmodel.deleteOne({ _id:req.body.delete });
        res.redirect('/');
    }else{
       //const foundlist=await List.find({name:listyname});
        await List.findOneAndUpdate({name:listyname},{$pull:{item:{_id:req.body.delete}}});
        
        res.redirect("/"+listyname);
    }
    
})
app.listen(port,()=>{
    console.log(`Server is listening..at ${port}`);
})