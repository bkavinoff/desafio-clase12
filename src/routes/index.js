const express = require('express')
const { Router } = require('express')
const router = Router()
const path = require('path')

//declaro mi clase contenedor
const Contenedor = require('../controllers/contenedor')

//inicializo el contenedor con el archivo de productos
const contenedor = new Contenedor('./productos.txt');

router.get('/', express.static(path.join(__dirname,'../public')))
router.get('/productos', express.static(path.join(__dirname,'../public')))







module.exports = router; //exporto para poder usarlo en otro file