const path = require("node:path");
const express = require("express");
const session = require('express-session');
const passport = require("./src/passport.js");
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const { PrismaClient } = require("./generated/prisma/client");


const invRouter = require("./routes/invRouter.js");
require("dotenv").config()
const app = express();

app.set('trust proxy', 1);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const secretK = process.env.SECRET_KEY || "asqGAhhsdq32A54gfsdsa"

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV == 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // ms
    },
    secret: secretK,
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(
      new PrismaClient(),
      {
        checkPeriod: 2 * 60 * 1000,  //ms
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }
    )
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) =>{
    res.locals.currentUser = req.user;
    next();
})
app.use("/", invRouter)

app.listen(process.env.PORT||3000, (error) => {
  if (error) {
    throw error;
  }
  console.log(`app listening on port ${process.env.PORT || 3000}!`);
});