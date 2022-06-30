const fs = require('fs');

class Mensajes {
    constructor (nombreArchivo) {
        this.path = nombreArchivo;
        //console.log('Path del archivo creado: ', nombreArchivo)
    }

    async add(obj) {
        try{
            if (fs.existsSync(this.path)){
                
                //el archivo existe, obtengo los mensajes
                let messages = await fs.promises.readFile(this.path, 'utf-8');

                let arrMensajes = [];

                if (messages.length === 0)
                {
                    obj.id = 1;
                }else
                {
                    //parseo de string a json
                    let prodJSON = JSON.parse(messages);
                    
                    arrMensajes = this.transformJSONtoArray(prodJSON);

                    //seteo el id de mi mensaje
                    obj.id = arrMensajes.length + 1;
                }

                //agrego el mensaje al array
                arrMensajes.push(obj);
                
                //sobreescribo el archivo con el nuevo mensaje
                await fs.promises.writeFile(this.path, JSON.stringify(arrMensajes));
                //console.log("Agregado el mensaje a la lista con id: ", obj.id)
            }else{
                //seteo el id 1 a mi obj
                obj.id = 1;

                //no existe el archivo, lo creo
                await fs.promises.writeFile(this.path, JSON.stringify([obj]));
                //console.log("Agregado el mensaje a la lista con id: ", obj.id)
            }
            return
            
        }catch(err){
            console.log('Hubo un error al intentar guardar: ', err);
        }
    }

    async getMessagesCount(){
        try{
            if (fs.existsSync(this.path)){                
                //el archivo existe, obtengo los mensajes
                let messages = await fs.promises.readFile(this.path, 'utf-8');
                
                //parseo de string a jsonObject
                let messagesList = JSON.parse(messages);
                
                //retorno
                return messagesList.length
            }else{
                //no existe el archivo
                console.log('No existe el archivo')
            }
        }catch(err){
            console.log('Hubo un error al intentar leer el archivo de mensajes');
        }
    }

    async getAll(){
        try{
            if (fs.existsSync(this.path)){                
                //el archivo existe, obtengo los mensajes
                let messages = await fs.promises.readFile(this.path, 'utf-8');
                
                //parseo de string a jsonObject
                let messagesList = JSON.parse(messages);
                
                //retorno
                if (messagesList.length > 0){
                    return messagesList;
                }else{
                    return ('No hay mensajes');
                }
            }else{
                //no existe el archivo
                console.log('No existe el archivo')
            }
        }catch(err){
            console.log('Hubo un error al intentar leer el archivo de mensajes');
        }
    }

    async deleteAll(){
        try{
            if (fs.existsSync(this.path)){  
                await fs.promises.writeFile('mensajes.txt', '');
                console.log('Se han eliminado con éxito todos los mensajes.')
            }
        }catch(err){
            console.log('Hubo un error al intentar leer el archivo de mensajes');
        }
    }

    transformJSONtoArray(json){
        let arrayNuevo = [];
        //paso de jsonObject a Array:
        for (let msg of json){
            arrayNuevo.push(msg);
        }

        //retorno el array
        return arrayNuevo;
    }

}




module.exports = Mensajes // 👈 Export class