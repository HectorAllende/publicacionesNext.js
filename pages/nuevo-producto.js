import React, {useContext, useState} from 'react';
import {css} from '@emotion/react'
import Router, {useRouter} from 'next/router'
import FileUploader from 'react-firebase-file-uploader'
import Layout from '../components/layout/Layout'
import {Formulario, Campo, InputSubmit, Error} from '../components/ui/Formulario'
import Error404 from '../components/layout/404'
import Swal from 'sweetalert2';

import {FirebaseContext} from '../firebase'

import useValidacion from '../hook/useValidacion'
import validarCrearProducto from '../validacion/validarCrearProducto'


const STATE_INICIAL = {
  nombre: '',
  empresa: '',
  imagen: '',
  url: '',
  descripcion: ''
}

const NuevoProducto = () => {

  // state de las imgagenes

  const [nombreimagen, guardarNombre]= useState('')
  const [subiendo, guardarSubiendo]= useState(false)
  const [progreso, guardarProgreso]= useState(0)
  const [urlimagen, guardarUrlImagen]= useState('')



  const { valores, errores, handleSubmit, handleChange, handleBlur } = useValidacion(STATE_INICIAL, validarCrearProducto, crearProducto)

  const { nombre, empresa, imagen, url, descripcion } = valores;

  const router = useRouter()


  const { usuario, firebase } = useContext(FirebaseContext)

  // console.log(usuario)

  async function crearProducto() {

    // Si el usuario no esta autenticado llevar al login
    if (!usuario) {
      return router.push("/login")
    }

    // crear el objeto del nuevo producto

    const producto = {
      nombre,
      empresa,
      url,
      urlimagen,
      descripcion,
      votos: 0,
      comentarios: [],
      creado: Date.now(),
      creador: {
        id: usuario.uid,
        nombre: usuario.displayName
      },
      havotado: []
    }

    // Insertarlo en la base de datos

    firebase.db.collection('productos').add(producto)

    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Publicación creada correctamente',
      showConfirmButton: false,
      timer: 1500
    })

    return router.push('/')

  }

  const handleUploadStart=()=>{
    guardarProgreso(0)
    guardarSubiendo(true)

  }

  const handleUploadError = (error) => {
    guardarSubiendo(error)
    console.log(error)
  }

  const handleUploadSuccess = (nombre) => {
    guardarProgreso(100)
    guardarSubiendo(false)
    guardarNombre(nombre)
    firebase
      .storage
      .ref("productos")
      .child(nombre)
      .getDownloadURL()
      .then(url => {
        console.log(url);
        guardarUrlImagen(url);
      });

  }

  const handleProgress= progreso=>{
    guardarProgreso(progreso)
  }

  return (

    <div
      css={css`
        margin-bottom: 5rem;
      `}
    >
      <Layout>

        {!usuario ? <Error404 /> : (
          <>

            <h1
              css={css`
              text-align: center;
              margin-top: 5rem;                
          `}
            >Nueva Publicación</h1>

            <Formulario
              onSubmit={handleSubmit}
              noValidate
            >

              <fieldset>
                <legend>Información General</legend>
                <Campo>
                  <label htmlFor="nombre">Título</label>

                  <input
                    type="text"
                    id="nombre"
                    placeholder="Título de la publicación"
                    name="nombre"
                    value={nombre}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Campo>

                {errores.nombre && <Error>{errores.nombre}</Error>}

                {/* <Campo>
                  <label htmlFor="empresa">Empresa</label>

                  <input
                    type="empresa"
                    id="empresa"
                    placeholder="Nombre empresa o compañia"
                    name="empresa"
                    value={empresa}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Campo> */}

                {/* {errores.empresa && <Error>{errores.empresa}</Error>} */}

                <Campo>
                  <label htmlFor="imagen">Imagen</label>
                  <FileUploader
                    accept="image/*"
                    id="imagen"
                    name="imagen"
                    randomizeFilename
                    storageRef={firebase.storage.ref("productos")}
                    onUploadStart={handleUploadStart}
                    onUploadError={handleUploadError}
                    onUploadSuccess={handleUploadSuccess}
                    onProgress={handleProgress}
                  />



                </Campo>



                <Campo>
                  <label htmlFor="url">Url</label>

                  <input
                    type="url"
                    id="url"
                    placeholder="URL de la publicación"
                    name="url"
                    value={url}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Campo>

                {errores.url && <Error>{errores.url}</Error>}
              </fieldset>
              <fieldset>
                <legend>Sobre tu Publicación</legend>
                <Campo>
                  <label htmlFor="descripcion">Descripción</label>

                  <textarea
                    id="descripcion"
                    name="descripcion"
                    value={descripcion}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Campo>

                {errores.descripcion && <Error>{errores.descripcion}</Error>}
              </fieldset>

              <InputSubmit
                type="submit"
                value="Crear Publicación"
                css={css`
                  margin-top: 2rem;
                `}
              />
            </Formulario>
          </>
        )}


      </Layout>


    </div>


  );

}

export default NuevoProducto;