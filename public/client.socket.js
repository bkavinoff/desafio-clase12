const socket = io()

//productos:
const addProductFormContainer = document.querySelector('#addProductFormContainer')
const addProductForm = document.querySelector('#addProductForm')
const txtNombreProd = document.querySelector('#txtNombreProd')
const txtThumbnailProd = document.querySelector('#txtThumbnailProd')
const txtPriceProd = document.querySelector('#txtPriceProd')
const productsPool = document.querySelector('#productsPool')

//chat:
const addMessageForm = document.querySelector('#addMessageForm')
const txtUserEmail = document.querySelector('#txtUserEmail')
const txtUserMessage = document.querySelector('#txtUserMessage')
const chatPool = document.querySelector('#chatPool')

//EVENT LISTENERS
addProductForm.addEventListener('submit', event => {
    event.preventDefault()
    const productInfo = {nombre:txtNombreProd.value, thumbnail:txtThumbnailProd.value, precio:txtPriceProd.value}
    SendNewProduct(productInfo)
})

addMessageForm.addEventListener('submit', event => {
    event.preventDefault()

    //obtengo la fecha y hora
    let [date, time] = new Date().toLocaleString('en-GB').split(', ');
    const messageDateTime = date + ' - ' + time;

    const messageInfo = {email:txtUserEmail.value, message:txtUserMessage.value, messageDateTime:messageDateTime}

    SendNewMessage(messageInfo)
})

//FUNCTIONS 
function RenderProduct(products){
    fetch('./ListadoPoductos.hbs').then(response =>{
        response.text().then(plantilla =>{
            //vacío el contenedor de productos
            productsPool.innerHTML = "" 

            //cargo los productos recibidos
            products.forEach(prod =>{
                const template = Handlebars.compile(plantilla)
                const html = template(prod)
                productsPool.innerHTML += html
            }) 
        })
    })
}

function RenderAddProductForm(){
    fetch('./addProductForm.hbs').then(response =>{
        response.text().then(plantilla =>{
            const template = Handlebars.compile(plantilla)
            const html = template(plantilla)
            addProductFormContainer.innerHTML = html
        })
    })
}

function RenderMessages(messagesInfo){
    if (messagesInfo != 'No hay mensajes'){
        const html = messagesInfo.map((msg) => {
            return (`<div>
            <strong style="color:blue">${msg.email} </strong>
            <span style="color:brown">[${msg.messageDateTime}]: </span>
            <em style="color:green">${msg.message}</em>
            </div>`)
        }).join(' ')
        chatPool.innerHTML=html
    }
}

//MESSAGES TO THE SERVER
function SendNewProduct(productInfo){
    socket.emit('client:addProduct', productInfo)
}
function SendNewMessage(messageInfo){
    socket.emit('client:addMessage', messageInfo)
}


//MESSAGES FROM THE SERVER
socket.on('server:ListProducts', productos =>{
    RenderProduct(productos)
})

socket.on('server:renderMessages', messagesInfo =>{
    RenderMessages(messagesInfo)
})