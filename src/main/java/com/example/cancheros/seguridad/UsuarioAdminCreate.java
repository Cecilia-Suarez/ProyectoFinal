package com.example.cancheros.seguridad;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import com.example.cancheros.entity.MyUser;
import com.example.cancheros.entity.UsuarioRole;
import com.example.cancheros.repository.IMyUserRepository;

@Component
public class UsuarioAdminCreate implements ApplicationRunner {

    @Autowired
    IMyUserRepository usuarioRepositorio;

    @Override
    public void run(ApplicationArguments args) throws Exception {

        // Definimos la contraseña
        BCryptPasswordEncoder password = new BCryptPasswordEncoder();
        String passSinCifrar = "1234";
        String passCifrado = password.encode(passSinCifrar); // Encode permite codificar la contraseña.

        // Verificamos si el usuario ya existe
        String email = "ceci08@gmail.com";
        MyUser usuarioExistente = usuarioRepositorio.findByEmail(email);

        if (usuarioExistente == null) {
            // Definimos un usuario si no existe
            MyUser usuarioAInsertar = new MyUser("Cecilia", "Suarez", email, passCifrado, UsuarioRole.ADMIN);

            // Guardamos el usuario creado.
            usuarioRepositorio.save(usuarioAInsertar);
        }
    }
}
