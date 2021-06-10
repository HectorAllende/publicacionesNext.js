import React, {useState} from 'react';
import {css} from '@emotion/react'
import Router from 'next/router'
import Loyout from '../components/layout/Layout'
import {Formulario, Campo, InputSubmit, Error } from '../components/ui/Formulario'

import firebase from '../firebase'

import useValidacion from '../hook/useValidacion'
import validarIniciarSesion from '../validacion/validarInicioSesion'

const STATE_INICIAL={
  email:'',
  password:''
}


const Login = () => {

  const [error, guardarError]= useState(false)

  const {valores, errores, handleSubmit, handleChange, handleBlur} = useValidacion(STATE_INICIAL, validarIniciarSesion, iniciarSesion )

  const {email, password}= valores;

  async function iniciarSesion(){
    try {
      await firebase.login(email, password)
      Router.push("/")

    } catch (error) {
      console.error("Hubo un error al autenticar al usuario", error.message)
      guardarError(error.message)
    }
  }




  return (
    <div>
      <Loyout>
        <h1
          css={css`
            text-align:center;
            margin-top: 5rem;
          `}
        >Login</h1>

        <Formulario
          onSubmit={handleSubmit}
          noValidate
        >
         

            <Campo>
                <label htmlFor="email">Email</label>

                <input
                    type="email"
                    id="email"
                    placeholder="Tu email"
                    name="email"
                    value={email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
            </Campo>
            {errores.email && <Error>{errores.email}</Error> }

            <Campo>
                <label htmlFor="password">Password</label>

                <input
                    type="password"
                    id="password"
                    placeholder="Tu password"
                    name="password"
                    value={password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
            </Campo>
            {errores.password && <Error>{errores.password}</Error> }

            {error && <Error>{error}</Error>}

            <InputSubmit
                type="submit"
                value="Iniciar Sesión"
            />
        </Formulario>

      </Loyout>


    </div>
 


    );
}
 
export default Login;