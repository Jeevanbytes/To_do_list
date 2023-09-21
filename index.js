
import express from "express";
import bodyParser from "body-parser";
import {dirname} from "path";
import path from "path";
import { fileURLToPath } from "url";
import ejs from "ejs";


const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;
app.set('view engine','ejs');
var Days = ['Sunday', 'Monday', 'Tuesday',
                'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          
var Months = ['January', 'February', 'March', 'April',
                'May', 'June', 'July', 'August', 'September',
                'October', 'November', 'December'];
app.use(express.static(path.join(__dirname,'public')));         
app.use(bodyParser.urlencoded({ extended: true }));
let newitem=[];
app.get("/",(req,res)=>{
    var now=new Date();
    var date=now.getDay();
    res.render("index.ejs",{whatnow:Days[date]+", "+Months[now.getMonth()]+" "+now.getDate(),Listnewitem:newitem});
})
app.get("/work",(req,res)=>{
    res.render("work.ejs",{whatnow:"Work List"});
})
/*app.post("/submit",(req,res)=>{
    console.log(req.body);
    var now=new Date();
    var date=now.getDay();
    res.render("index.ejs",{whatnow:Days[date]+", "+Months[now.getMonth()]+" "+now.getDate(),check:1,list:req.body["todo"]});
})*/
app.post('/',(req,res)=>{
    let newite=req.body.todo;
    newitem.push(newite);
    res.redirect('/');
})
app.listen(port,()=>{
    console.log(`Server is listening..at ${port}`);
})