package com.example.cancheros.controller;

import com.example.cancheros.entity.MyUser;
import com.example.cancheros.exceptions.ResourceNotFoundException;
import com.example.cancheros.service.impl.UsuarioServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/user")
public class MyUserController {
    private UsuarioServiceImpl usuarioService;

    @Autowired
    public MyUserController(UsuarioServiceImpl usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping("/detail")
    public ResponseEntity<?> getUserInfo() {
        // Obtener el objeto de autenticación
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Verificar si el usuario está autenticado
        if (authentication != null && authentication.isAuthenticated()) {
            Object principal = authentication.getPrincipal();

            // Verificar si el principal es una instancia de UserDetails
            if (principal instanceof UserDetails) {
                UserDetails userDetails = (UserDetails) principal;
                // Aquí puedes acceder a la información del usuario, como nombre de usuario, roles, etc.
                String email = userDetails.getUsername();
                // Obtener el ID del usuario si está disponible
                MyUser usuario = obtenerUsuario(email);
                return ResponseEntity.ok(usuario);
            } else if (principal instanceof String) {
                return ResponseEntity.ok("Usuario no logueado.");
            } else {
                // Principal no es una instancia de UserDetails ni String
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null); // O devolver un mensaje de error apropiado
            }
        } else {
            // Usuario no autenticado, devolver un error 401
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @GetMapping("/authenticated")
    public ResponseEntity<String> authenticated() {
        // Obtener el objeto de autenticación
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Verificar si el usuario está autenticado
        if (authentication != null && authentication.isAuthenticated()) {
            String role = authentication.getAuthorities().stream()
                    .findFirst()
                    .map(GrantedAuthority::getAuthority)
                    .orElse("ROLE_USER"); // Definir un rol por defecto si no se encuentra ninguno
            return ResponseEntity.ok(role);
        } else {
            // Usuario no autenticado, devolver un error 401
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    // Método para obtener el usuario.
    private MyUser obtenerUsuario(String username) {
        return usuarioService.obtenerUsuarioPorEmail(username);
    }

    //Método para listar todos los usuarios.
    @GetMapping("/listarTodos")
    public List<MyUser> listarTodos() {
        return usuarioService.listarTodos();
    }

    //Método para actualizar el usuario.
    @PutMapping("/update")
    public ResponseEntity<?> update(@RequestBody MyUser usuario) throws ResourceNotFoundException {
        usuarioService.actualizar(usuario);
        return ResponseEntity.ok(HttpStatus.OK);
    }


}
