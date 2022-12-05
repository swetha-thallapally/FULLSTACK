const { request } = require("express");
const express = require("express");
const app = express();
const port = 3000;
const request1 = require('request')

const {initializeApp , cert} = require('firebase-admin/app');
const {getFirestore} = require('firebase-admin/firestore');

var serviceAccount = require("./index.json"); 

initializeApp({
    credential: cert(serviceAccount)
})
const db = getFirestore(); 

app.set('view engine','ejs');


app.get("/",(req,res)=>{
    res.render('home')
});

app.get("/selecttype",(req,res)=>{
    res.render('selecttype')
 });

 app.get("/idsubmit",function(req,res){
     const adid = req.query.adid;
     const nid=req.query.nid;
     const x1=Math.floor(Math.random() * 10);
     if(x1==nid){
      request1('https://api.adviceslip.com/advice/'+adid+'',function(error,response,body){
        const adviceobj=JSON.parse(body).slip;
        const advice = adviceobj.advice;
        console.log(advice)
        res.render('advice',{advice:advice})
     })
  }
  else
  {
    const advice = x1;
    res.render('rs',{advice:advice})
  }
 });
 
 app.get("/randomsubmit",function(req,res){
    const adid = req.query.adid;
    request1('https://api.adviceslip.com/advice',function(error,response,body){
        const adviceobj=JSON.parse(body).slip;
        const advice = adviceobj.advice;
        console.log(advice)
        res.render('advice',{advice:advice})
    })
 });

 app.get("/signin",(req,res)=>{
    res.render('signin')
 });

 app.get("/signinsubmit",(req,res)=>{
    const email = req.query.email;
    const password = req.query.pwd;

    db.collection('Myusers')
    .where("email","==",email)
    .where("password","==",password)
    .get()
    .then((docs) =>{
        if(docs.size >0){
            res.render("selecttype")
        }
        else{
            res.render('signup')
        }
    })

 });


 app.get("/signup",(req,res)=>{
     res.render('signup')
 });

 app.get("/signupsubmit",(req,res)=>{
    
    const firstname = req.query.fname;
    const lastname = req.query.lname;
    const email = req.query.email;
    const phone = req.query.phone;
    const password = req.query.pwd;

db.collection('Myusers').add({
    name : firstname + " "+lastname,
    email : email,
    password : password,
}).then(() =>{
    const advice = " ";
    res.render('registration',{advice:advice})
})

});

app.listen(port ,() =>{
    console.log("example app running $(port)")
});
