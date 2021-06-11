import React, { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import Layout from '../../components/layout/Layout'
import { FirebaseContext } from '../../firebase'
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { es } from 'date-fns/locale';
import Error404 from '../../components/layout/404';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Campo, InputSubmit } from '../../components/ui/Formulario'
import Boton from '../../components/ui/Boton'




const ContenedorProducto = styled.div`
    @media (min-width:768px){
        display: grid;
        grid-template-columns: 2fr 1fr;
        column-gap: 2rem
    }

`
const Producto = () => {

  

    const [producto, guardarProducto] = useState({})
    const [error, guardarError] = useState(false)
    const [comentario, guardarComentario]= useState({})
    const [consultarDB, guardarConsultarBD]= useState(true)

    const { usuario ,firebase } = useContext(FirebaseContext)

    const router = useRouter()
    // console.log(router)

    // accedemos al id con router
    const { query: { id } } = router

    

    useEffect(() => {
      if(id && consultarDB){
        const obtenerProducto = async () => {
            const productoQuery = await firebase.db.collection('productos').doc(id)
            const producto = await productoQuery.get()
            // guardarProducto(producto.data())
    
            if (producto.exists) {
                guardarProducto(producto.data())
                guardarConsultarBD(false)
    
            } else {
                guardarError(true)
                guardarConsultarBD(false)
            }
    
        }
        obtenerProducto()
    
          

      }

    }, [id,producto ])

    if (Object.keys(producto).length === 0) return 'Cargando...'



    const { comentarios, creado, descripcion, empresa, nombre, url, urlimagen, votos, creador, havotado } = producto;

    const votarProducto=()=>{
        if(!usuario){
            return router.push('/login')
        }


        // obtener y sumar me gusta

        const nuevoTotal = votos + 1

        // Verificar si el usuario actual ha votado

        if(havotado.includes(usuario.uid)) return;

        // Guardar el id del usuario que ha votado

        const nuevoHaVotado = [...havotado, usuario.uid]

        //Actualizar en la base de datos

        firebase.db.collection('productos').doc(id).update({votos:nuevoTotal, havotado: nuevoHaVotado })

          
        // Actualizar el state
        
        guardarProducto({
            ...producto,
            votos: nuevoTotal
        })
        guardarConsultarBD(true) // hay un voto por lo tanto consultar la base de datos
        

    }

    // Funcion para crear comentarios

    const comentarioChange = e=>{
        guardarComentario({
            ...comentario,
            [e.target.name] : e.target.value 
        })
    }
    

    const agregarComentario=e=>{
        e.preventDefault()

        if(!usuario){
            return router.push('/login')
        }

        // Informacion extra al comentario
        comentario.usuarioId = usuario.uid;
        comentario.usuarioNombre = usuario.displayName;

        // Tomar copia de comentarios y agregarlos al arreglo

        const nuevosComentarios = [...comentarios, comentario]

        // Actualizamos la base de datos
        firebase.db.collection('productos').doc(id).update({
            comentarios: nuevosComentarios
        })


        // Actualizamos el state

       guardarProducto({
           ...producto,
           comentarios: nuevosComentarios
       })


       guardarConsultarBD(true) //hay un comentario consutar la base de datos

             
    }

    const puedeBorrar=()=>{
        if(!usuario) return false;

        if(creador.id === usuario.uid){
            return true
        }
    }

    const eliminarProducto=async ()=>{
        if(!usuario){
            return router.push('/login')
        }

        if(creador.id !== usuario.uid){
            return router.push('/')
        }

        try {
            await firebase.db.collection('productos').doc(id).delete()
            router.push('/')
        } catch (error) {
            console.log(error)
        }
    }



    return (
        <Layout>

            <>

                {error && <Error404 />}


                <div className="contenedor">
                    <h1 css={css`
                        text-align: center;
                       
                    `}>{nombre} </h1>

                    <ContenedorProducto>
                        <div>
                            
                            <img src={urlimagen} />
                            <p
                                css={css`
                                    text-align: right;
                                `}
                            >Publicado hace: {formatDistanceToNow(new Date(creado), { locale: es })}</p>

                            <p>{descripcion}</p>

                            {usuario ? (
                                <>
                                <h2>Agrega tu comentario</h2>
                                    <form
                                        onSubmit={agregarComentario}
                                    >
                                        <Campo>
                                            <input
                                                type="text"
                                                name="mensaje"                                            
                                                onChange={comentarioChange}
                                            />
                                        </Campo>
                                        <InputSubmit
                                            type="submit"
                                            value="Agregar comentario"
                                        />

                                    </form>
                                </>
                            ) : null}



                            

                        
                        
                            <h2
                                css={css`
                                      margin: 2rem 0
                                      `}
                            >Comentarios</h2>

                            {comentarios.length === 0 ? "Aún no hay comentarios" : (
                                <ul>
                                    {comentarios.map(comentario => (
                                        <li
                                            css={css`
                                                border: 1px solid #e1e1e1;
                                                padding: 2rem;
                                            `}
                                        >
                                            <p>{comentario.mensaje}</p>
                                           
                                            <p>Escrito por: 
                                                <span
                                                    css={css`
                                                            font-weight: bold;
                                                        `
                                                    }
                                                >{''} {comentario.usuarioNombre}
                                                </span></p>
                                        </li>
                                    ))}
                                </ul>


                            )}
                      


                        </div>

                        <aside>
                            <Boton
                                target="_blank"
                                bgColor="true"
                                href={url}
                            >Visitar pagina</Boton>

                            <p>Creado por {creador.nombre}</p>

                            <div
                                css={css`
                                    margin-top: 5rem;
                                `}
                            >

                             {usuario ? <Boton onClick={votarProducto}>Me gusta</Boton> : null }   

                                <p
                                    css={css`
                                    text-align: center;
                                `}
                                >Les gusta a {votos}</p>

                            </div>



                        </aside>

                    </ContenedorProducto>

                    {puedeBorrar()&&
                        <Boton
                            onClick={eliminarProducto}
                        >Eliminar Publicación</Boton>
                    }

                    
                </div>

            </>


        </Layout>
    
        
        );
}
 
export default Producto;