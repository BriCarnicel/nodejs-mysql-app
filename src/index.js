const express = require("express");
const morgan = require("morgan");
const path = require("path");
const exphbs = require("express-handlebars");
const flash = require("connect-flash");
const session = require("express-session");
const MySQLStore = require("express-mysql-session");
const passport = require("passport");

const {database} = require("./keys");

//initialization 
const app = express();
require("./lib/passport");

//seting
app.set("port", process.env.PORT || 4000);
app.set("views", path.join(__dirname,"views"));

app.engine(".hbs",exphbs({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    extname: ".hbs",
    helpers: require('./lib/handlebars.js')
}));

app.set("view engine", ".hbs");

//middlewares
app.use(session({
    secret: "briancarnicel",
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
})),
app.use(flash());
app.use(morgan("dev"));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());


//global variables
app.use((req, res, next) => {
    app.locals.success = req.flash("success");
    app.locals.message = req.flash("message");
    next();
});

//routes
app.use(require('./routes/index'));
app.use(require('./routes/authentication'));
app.use('/links', require('./routes/links'));


//public files 
app.use(express.static(path.join(__dirname,"public")))

//starting server
app.listen(app.get("port"), () =>{
    console.log("server is in port ", app.get("port"))
})