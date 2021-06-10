import React, { useContext, useState } from 'react';
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

    const { firebase } = useContext(FirebaseContext)

    const router = useRouter()
    // console.log(router)

    // accedemos al id con router
    const { query: { id } } = router

    const obtenerProducto = async () => {
        const productoQuery = await firebase.db.collection('productos').doc(id)
        const producto = await productoQuery.get()
        // guardarProducto(producto.data())

        if (producto.exists) {
            guardarProducto(producto.data())

        } else {
            guardarError(true)

        }

    }
    obtenerProducto()


    // useEffect(() => {
    //   if(id){
    //       console.log('Ya hay id')
    //   }

    // }, [id])

    if (Object.keys(producto).length === 0) return 'Cargando...'



    const { comentarios, creado, descripcion, empresa, nombre, url, urlimagen, votos } = producto;

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

                            <h2>Agrega tu comentario</h2>

                            <form>
                                <Campo>
                                    <input
                                        type="text"
                                        name="mensaje"
                                    />
                                </Campo>
                                <InputSubmit
                                    type="submit"
                                    value="Agregar comentario"
                                />

                            </form>

                            <h2
                                css={css`
                                    margin: 2rem 0
                                `}
                            >Comentarios</h2>

                            {comentarios.map(comentario => (
                                <li>
                                    <p>{comentario.nombre}</p>
                                    <p>Escrito por: {comentario.usuarioNombre}</p>
                                </li>
                            ))}

                        </div>

                        <aside>
                            <Boton
                                target="_blank"
                                bgColor="true"
                                href={url}
                            >Visitar pagina</Boton>

                            <div
                                css={css`
                                    margin-top: 5rem;
                                `}
                            >
                                <Boton>Me gusta</Boton>
                                <p
                                    css={css`
                                    text-align: center;
                                `}
                                >Les gusta a {votos}</p>

                            </div>



                        </aside>

                    </ContenedorProducto>
                </div>

            </>


        </Layout>
    
        
        );
}
 
export default Producto;