import React, { useContext, useState} from 'react';
import {useRouter} from 'next/router'
import Layout from '../../components/layout/Layout'
import {FirebaseContext} from '../../firebase'

import Error404 from '../../components/layout/404'

const Producto = () => {

    const [producto, guardarProducto]= useState({})

    const [error, guardarError]= useState(false)

    const {firebase} = useContext(FirebaseContext)

    const router = useRouter()
    // console.log(router)
   
    // accedemos al id con router
    const {query:{id}}= router

    const obtenerProducto = async()=>{
        const productoQuery= await firebase.db.collection('productos').doc(id)
        const producto = await productoQuery.get()
        // guardarProducto(producto.data())

        if(producto.exists){
            guardarProducto(producto.data())
         
        }else{
            guardarError(true)
         
        }
       
    }
    obtenerProducto()


    // useEffect(() => {
    //   if(id){
    //       console.log('Ya hay id')
    //   }

    // }, [id])



    return (
        <Layout>

            <>

                {error && <Error404 />}

            </>


        </Layout>
    
        
        );
}
 
export default Producto;