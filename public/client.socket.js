const socket = io()

function RenderProduct(products){
    fetch('./ListadoPoductos.hbs').then(response =>{
        response.text().then(plantilla =>{
            products.forEach(prod =>{
                const template = Handlebars.compile(plantilla)
                const html = template(prod)
                document.querySelector('#productos').innerHTML += html
            }) 
        })
    })
}

socket.on('server:ListProducts', productos =>{
    RenderProduct(productos)
})
