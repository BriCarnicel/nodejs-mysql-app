const express = require("express");
const { restart } = require("nodemon");
const router = express.Router();
const pool = require("../database");

router.get("/add", (req, res) => {
    res.render("links/add");
});

router.post("/add", async (req,res) => {
    const {title,url,description} = req.body;
    const newLink = {
        title,
        url,
        description
    };
    await pool.query("INSERT INTO links set ?", [newLink]);
    req.flash("success","Link saved successfully");
    res.redirect("/links");
});

router.get("/",async (req,res) => {
    const links = await pool.query("select * from links");
    console.log(links);
    res.render("links/list", {links});
 });

 router.get("/delete/:id", async(req,res) => {
    const {id} = req.params;
    await pool.query("delete from links where id = ?",[id]);
    req.flash("success","Link Removed Succes");
    res.redirect("/links");
 });

 router.get("/edit/:id", async(req,res) => {
     const { id } = req.params;
     const links = await pool.query("select * from links where id = ?",[id]);
     res.render("links/edit",{link: links[0]});
 });


 router.post("/edit/:id", async(req,res) => {
    const { id } = req.params;
    const { title,description,url } = req.body;
    const newLink = {
        title,
        description,
        url
    };
    await pool.query("update links set ? where id = ?",[newLink,id]);
    req.flash("success","Link Update Succesfully");
    res.redirect("/links");
 });
 
 module.exports = router;

