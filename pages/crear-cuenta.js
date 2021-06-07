import React from 'react';
import {css} from '@emotion/react'
import Loyout from '../components/layout/Layout'
import {Formulario, Campo, ImputSubmit} from '../components/ui/Formulario'


const CrearCuenta = () => {
  return (
    <div>
      <Loyout>
        <h1
            css={css`
                text-align: center;
                margin-top: 5rem;                
            `}
        >Crear Cuenta</h1>

        <Formulario>
            <Campo>
                <label htmlFor="nombre">Nombre</label>

                <input
                    type="text"
                    id="nombre"
                    placeholder="Tu nombre"
                    name="nombre"
                />
            </Campo>

            <Campo>
                <label htmlFor="email">Email</label>

                <input
                    type="email"
                    id="email"
                    placeholder="Tu email"
                    name="email"
                />
            </Campo>

            <Campo>
                <label htmlFor="password">Password</label>

                <input
                    type="password"
                    id="password"
                    placeholder="Tu password"
                    name="password"
                />
            </Campo>

            <ImputSubmit
                type="submit"
                value="Crear cuenta"
            />
        </Formulario>

      </Loyout>


    </div>
 

    );
}
 
export default CrearCuenta;