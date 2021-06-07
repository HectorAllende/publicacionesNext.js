import React from 'react';
import {css} from '@emotion/react'
import Loyout from '../components/layout/Layout'
import {Formulario, Campo, ImputSubmit} from '../components/ui/Formulario'



const Login = () => {
  return (
    <div>
      <Loyout>
        <h1
          css={css`
            text-align:center;
            margin-top: 5rem;
          `}
        >Login</h1>

        <Formulario>
         

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
                value="Iniciar Sesión"
            />
        </Formulario>

      </Loyout>


    </div>
 


    );
}
 
export default Login;