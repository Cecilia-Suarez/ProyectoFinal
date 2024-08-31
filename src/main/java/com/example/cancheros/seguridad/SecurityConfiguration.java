package com.example.cancheros.seguridad;

import com.example.cancheros.service.impl.UsuarioServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {
    @Autowired
    private UsuarioServiceImpl userDetailService;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Bean
    // Método para configurar la seguridad
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
                //Deshabilitamos la protección CSRF (Cross-Site Request Forgery).
                .csrf(AbstractHttpConfigurer::disable)

                .authorizeHttpRequests(registry -> {
                    //Acceso solo a los administradores
                    registry.requestMatchers("/admin.html").hasRole("ADMIN");

                    //Acceso solo a los usuarios y administradores
                    registry.requestMatchers("/datosUser.html").hasAnyRole("USER", "ADMIN");
                    registry.requestMatchers("/reservas.html").hasAnyRole("USER", "ADMIN");

                    //Acceso sin autenticación
                    registry.requestMatchers("/**").permitAll();
                })
                .formLogin(httpSecurityFormLoginConfigurer -> { //Manejo del formulario login
                    httpSecurityFormLoginConfigurer

                            //Usamos el manejador personalizado para manejar el post-login.
                            .successHandler(new CustomAuthenticationSuccessHandler())

                            //URL de la pagina login.
                            .loginPage("/login")

                            //URL a la que se le envía el formulario login para su procesamiento.
                            .loginProcessingUrl("/login")

                            //El parametro username es el correo.
                            .usernameParameter("email")

                            //El parametro password es su contraseña.
                            .passwordParameter("password")

                            //Permitimos a todos accedes a login.
                            .permitAll();
                })

                //Configuración por defecto para el cierre de sesión.
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessUrl("/index.html")
                );


        return httpSecurity.build();
    }

    //Configuramos Spring Security para autenticar usuarios contra la base de datos usando JDBC, especificando las consultas SQL que debemos realizar para obtener sus datos y roles.
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {

        //Configuramos la autenticación JDBC.
        auth.jdbcAuthentication()

                //Especificamos la fuente de datos para la autenticación.
                .dataSource(userDetailService.getDataSource())

                //Especificamos la consulta SQL para obtener el email y la constraseña.
                .usersByUsernameQuery("select email, password from usuarios where email=?")

                // Especificamos la consulta SQL para obtener los roles del usuario.
                .authoritiesByUsernameQuery("select email, usuarioRol from usuarios where email=?")

                //Especificamos el codificador de contraseñas.
                .passwordEncoder(passwordEncoder);
    }
}
