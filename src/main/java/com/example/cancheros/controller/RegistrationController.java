package com.example.cancheros.controller;

import com.example.cancheros.entity.MyUser;
import com.example.cancheros.repository.IMyUserRepository;
import com.example.cancheros.service.impl.UsuarioServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

@Controller
public class RegistrationController {

    @Autowired
    private UsuarioServiceImpl usuarioService;
    @Autowired
    private IMyUserRepository myUserRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/register")
    public ResponseEntity<byte[]> register() throws IOException {

        // Creamos un objeto Resource que representa el archivo HTML de registro ubicado en la carpeta static del classpath.
        Resource resource = new ClassPathResource("static/register.html");

        //Lee todos los bytes del archivo HTML de registro utilizando la clase Files.
        byte[] data = Files.readAllBytes(Path.of(resource.getURI()));

        //Construimos y controlamos un ResponseEntity con el contenido del archivo HTML de registro como un array de bytes. Se establece el tipo de contenido como text/html.
        return ResponseEntity.ok().contentType(MediaType.TEXT_HTML).body(data);
    }


    @PostMapping("/register")
    //ModelAtributte: usuario esta compuesto por los datos del formulario.
    public String registerUser(@ModelAttribute MyUser usuario) {
        try {
            usuarioService.saveUsuario(usuario);
        } catch (Exception e){
            System.out.println("Ya esta registrado un usuario con este correo");
            System.out.println(e.getMessage());
            return "redirect:/UsuarioRegistrado.html";
        }

        //Redirigimos al usuario a la pagina de inicio de sesion despues de un registro exitoso!!!
        return "redirect:/login";

    }
}


