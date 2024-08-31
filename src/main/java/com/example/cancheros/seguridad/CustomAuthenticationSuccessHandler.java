package com.example.cancheros.seguridad;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import java.io.IOException;
import java.util.Collection;


public class CustomAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    /*Este método se llama cuando un usuario se autentica con éxito. Recibe tres parámetros:
     HttpServletRequest request: La solicitud entrante HTTP.
     HttpServletResponse response: La respuesta HTTP.
     Authentication authentication: El objeto de autenticación que contiene información sobre el usuario autenticado.*/

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {

        //Se obtiene una colección de las autoridades (roles) del usuario autenticado. Cada autoridad es un objeto que implementa la interfaz GrantedAuthority.
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();

        //Iteramos a través de cada "GranatedAuthority en la coleccion authorities
        for (GrantedAuthority authority : authorities) {
            if (authority.getAuthority().equals("ROLE_ADMIN")) {

                //Si el usuario tiene el rol ROLE_ADMIN, será redirigido a /admin.html.
                response.sendRedirect("/index.html");
                return;

            } else if (authority.getAuthority().equals("ROLE_USER")) {
                //Si el usuario tiene el rol ROLE_USER, será redirigido a /user.html.
                response.sendRedirect("/index.html");
                return;
            }
            System.out.println(authority.getAuthority());
        }

        // Redirección predeterminada si no se encuentra el rol.
        response.sendRedirect("/index.html");
    }
}
