const express=require ('express');
const server=express();

server.use(express.static('public'));

server.listen(5000,()=>{
    console.log('Server listening on port '+5000);
})

server.get('/',(req,res)=>{
    res.render('HomePage.ejs');
})

server.get('/About',(req,res)=>{
    res.render('PortFolio.ejs');
})