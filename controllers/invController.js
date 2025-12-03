const passport = require("../lib/passport.js");
const encrypt = require('../lib/encrypt.js');
const connection = require('../connection.js');
const crypto = require('crypto');
const { console } = require("inspector");
const ErrorWrapper = require("../utils/errorWrapper.js");

// pagina de inicio
exports.home = async(req, res, next) => {
  try {
    const items = await connection.$queryRaw`SELECT item.user_id, item.item_id, item.description, category.name AS category FROM item JOIN category ON item.category_id = category.id ORDER BY item.description ASC`;
    res.render("index",{
        title: "Products",
        items: items
    })
 } catch (error) {
    console.error(error);
    next(error);
   } 
}
// formulario de registro
exports.getSignUp = (req, res) => {res.render("sign-up-form")};
// procesar formulario de registro
exports.postSignUp = async (req, res, next) => {   
 try {
  const hashedPassword = await encrypt.genPassword(req.body.password)
  const sameName = await connection.$queryRaw`SELECT * FROM "user" WHERE username = ${req.body.username}`
  const id = crypto.randomUUID();
  if(sameName[0]){
   throw new ErrorWrapper("Nombre de usuario usado, intente con otro", 400);
  }
  await connection.user.create({
   data: {
      id: id,
      username:req.body.username,
      password:hashedPassword
   }
  })
   this.postLogIn(req, res, next);
 } catch (error) {
    console.error(error);
    next(error);
   }
}
// formulario de login
exports.getLogIn = (req, res) => {res.render("log-in")};
// procesar formulario de login
exports.postLogIn = passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/"
  });
// cerrar sesion
exports.getLogOut = (req, res, next) => {
  req.logout((err) => {
    try{
      if (err) {
        throw new ErrorWrapper("Error al cerrar sesión", 500);
      }
      res.redirect("/");
    } catch (error) {
    console.error(error);
    next(error);
   }
  });
}
// leer producto unico
exports.getShowunique = async (req,res,next)=>{
  try{
    const item = await connection.$queryRaw`SELECT item.item_id, item.description, category.name AS category FROM item JOIN category ON item.category_id = category.id WHERE item.item_id = ${req.params.id}`;
    res.render("./actions/show",{
        title: "Product",
        item: item[0]   
    })
    } catch (error) {
    console.error(error);
    const err = new ErrorWrapper("Error al obtener el producto", 500);
    next(err);
   }
}
// crear producto
exports.getCreateProduct = async (req,res)=>{
    res.render("./actions/create",{
        title: "Create Product"
    })
}
// procesar creacion de producto
exports.postCreateProduct = async (req,res,next)=>{
  try{
    const { description,category } = req.body;
    const item_id = crypto.randomUUID();
    
    if(!req.user || !req.user.id){
      throw new ErrorWrapper("Usuario no autenticado", 401);
    }
    
    if(!description || !category){
      throw new ErrorWrapper("Faltan datos obligatorios", 400);
    }
    await connection.item.create({
        data: {
            item_id:item_id,
            user_id: req.user.id,
            category_id: parseInt(category),
            description: description,
        }
    });
    res.redirect("/")
    } catch (error) {
    console.error(error);
    next(error);
   }
}
// actualizar producto
exports.getUpdateProduct = async (req,res,next)=>{
  try{
    const { id } = req.params;  
    const item = await connection.item.findUnique({
      where: {
        item_id: id
      }
    });
    res.render("./actions/update",{
        title: "Update Product",
        item: item   
    })
    } catch (error) {
    const err = new ErrorWrapper("Error al obtener el producto", 500);
    console.error(error);
    next(err);
   }  
}
// procesar actualizacion de producto
exports.postUpdateProduct = async (req,res,next)=>{
  try{
    const { id } = req.params;
    const { description,category } = req.body;
    await connection.item.update({
      where: {
        item_id: id
      },
      data: {
        description: description,
        category_id: parseInt(category)
      }
    });
    res.redirect("/")
    } catch (error) {
    const err = new ErrorWrapper("Error al actualizar el producto", 500);
    console.error(error);
    next(err);
   }
}
// eliminar producto
exports.getDeleteProduct = async (req,res,next)=>{
  try{
    const { id } = req.params;  
    await connection.item.deleteMany({
      where: {
        item_id: id
      }
    });
    res.redirect("/")
    } catch (error) {
    const err = new ErrorWrapper("Error al eliminar el producto", 500);
    console.error(error);
    next(err);
   }
}