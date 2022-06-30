
//importo dotenv para poder acceder a las variables de entorno que declare en el archivo .env
require('dotenv').config()

const express = require('express')
const rutas = require('./routes/index')
const path = require('path')
const port = process.env.PORT //lee del archivo .env


const app = express()

//declaro mis controllers
const Contenedor = require('./controllers/contenedor')
const Mensajes = require('./controllers/mensajes')

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
    const contenedor = new Contenedor(path.join(__dirname, process.env.PRODUCTS_FILE));

    //obtengo el listado de productos y lo envío al cliente que se conectó:
    contenedor.getAll().then(listProductos =>{
        //console.log(listProductos)
        socket.emit('server:ListProducts', listProductos)
    })
    
    socket.on('client:addProduct', productInfo => {
        
        //agrego el producto:
        contenedor.add(productInfo).then( ()=>{
            //obtengo el listado de productos:
            contenedor.getAll().then(listProductos =>{

                //envío el listado actualizado a todos los clientes
                io.emit('server:ListProducts', listProductos)
            })
        })
    })


    //inicializo el contenedor con el archivo de productos
    const mensajes = new Mensajes(path.join(__dirname, process.env.MESSAGES_FILE));

    //obtengo el listado de productos y lo envío al cliente que se conectó:
    mensajes.getAll().then(messagesArray =>{
        //console.log(messagesArray)
        socket.emit('server:renderMessages', messagesArray)
    })

    //recibo nuevo mensaje del cliente
    socket.on('client:addMessage', messageInfo => {
        //agrego el mensaje:
        mensajes.add(messageInfo).then( ()=>{
            //obtengo el listado de productos:
            mensajes.getAll().then(messagesArray =>{
                //envío el listado actualizado a todos los clientes:
                io.emit('server:renderMessages', messagesArray)
            })
        })
    })
})

