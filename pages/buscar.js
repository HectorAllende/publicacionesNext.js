import React, {useState, useEffect} from 'react';
import Layout from '../components/layout/Layout'
import {useRouter} from 'next/router'
import DetallesProducto from '../components/layout/DetallesProducto'
import useProductos from '../hook/useProductos'

const Buscar = () => {

  const router = useRouter()
  const {query:{q}} = router

  const {productos} = useProductos('creado')

  const [resultados, guardarResultado]= useState([])

  useEffect(() => {

    const busqueda= q.toLocaleLowerCase()

    const filtro = productos.filter(producto=>{
      return(
        producto.nombre.toLocaleLowerCase().includes(busqueda) || producto.descripcion.toLocaleLowerCase().includes(busqueda)
      )
    })
    guardarResultado(filtro)
   
  }, [q, productos])

  return (
    <div>
      <Layout>
        <div className="listado-productos">
          <div className="contenedor">
            <ul className="bg-white">
              {resultados.map(producto => (
                <DetallesProducto
                  key={producto.id}
                  producto={producto}
                />
              ))}
            </ul>
          </div>
        </div>
      </Layout>


    </div>
 

    );
}

 
export default Buscar;