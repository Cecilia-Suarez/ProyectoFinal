package com.example.cancheros.controller;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

@Controller
public class LoginController {

    @GetMapping("/login")
    public ResponseEntity<byte[]> login() throws IOException {

        //Creamos un objeto Resource que representa el archivo HTML de inicio de sesión ubicado en la carpeta static.
        Resource resource = new ClassPathResource("static/login.html");

        //Se leen todos los bytes del archivo HTML de inicio de sesión utilizando la clase Files.
        byte[] data = Files.readAllBytes(Path.of(resource.getURI()));

        //Construimos y retornamos un ResponseEntity con el contenido del archivo HTML de inicio de sesión como un array de bytes. Se establece el tipo de contenido como text/html.
        return ResponseEntity.ok().contentType(MediaType.TEXT_HTML).body(data);
    }

}