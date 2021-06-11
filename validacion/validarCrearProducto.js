const validarCrearProducto = (valores) => {

    let errores = {}

    if(!valores.nombre){
        errores.nombre = "El nombre es obligatorio"
    }

    // if(!valores.empresa){
    //     errores.empresa = "El nombre de empresa es obligatorio"
    // }

    if(!valores.url){
        errores.url = "La URL del la publicación es obligatorio"
    }else if(!/^(ftp|http|https):\/\/[^ "]+$/.test(valores.url)){
        errores.url= "URL mal formateada o no válida"
    }

    if(!valores.descripcion){
        errores.descripcion= "Agrega una descripción de tu publicación"
    }


    return errores;
}
 
export default validarCrearProducto;