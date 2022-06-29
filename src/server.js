
const express = require('express')
const rutas = require('./routes/index')
const path = require('path')
const port = 8080

const app = express()

//declaro mi clase contenedor
const Contenedor = require('./controllers/contenedor')

//archivos estaticos:
app.use(express.static(path.join(__dirname,'../public')))

//para poder acceder al body
app.use(express.json())
app.use(express.urlencoded({extended:true}))

//rutas
app.use('/', rutas)

//middleware de error:
app.use((error, req, res, next)=>{    
    console.log(error.statusMessage)
    res.status(500).send(error.message)
    //res.error(error)
})

//socket.io
const { Server: IOServer } = require('socket.io')
const expressServer=app.listen(port, (err) =>{
    console.log(`Servidor escuchando puerto ${port}`)
    if (err){
        console.log(`Hubo un error al iniciar el servidor: ${err}`)
    }else{
        console.log(`Servidor iniciado, escuchando en puerto: ${port}`)
    }
})
const io = new IOServer(expressServer)

io.on('connection', socket =>{
    console.log(`Se conectó un cliente con id: ${socket.id}`)

    //inicializo el contenedor con el archivo de productos
    const contenedor = new Contenedor(path.join(__dirname, './productos.txt'));

    //obtengo el listado de productos:
    contenedor.getAll().then(listProductos =>{
        console.log(listProductos)
        socket.emit('server:ListProducts', listProductos)
    })    
})

