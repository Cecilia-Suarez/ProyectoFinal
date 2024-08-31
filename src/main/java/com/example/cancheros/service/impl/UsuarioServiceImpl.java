package com.example.cancheros.service.impl;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import javax.sql.DataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.example.cancheros.entity.MyUser;
import com.example.cancheros.entity.UsuarioRole;
import com.example.cancheros.exceptions.EmailSendingException;
import com.example.cancheros.exceptions.ResourceNotFoundException;
import com.example.cancheros.repository.IMyUserRepository;
import com.example.cancheros.service.IEmailService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityExistsException;
import lombok.Getter;
import lombok.extern.log4j.Log4j;

@Service
@Log4j
public class UsuarioServiceImpl implements UserDetailsService {

    @Autowired
    public UsuarioServiceImpl(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Autowired
    IMyUserRepository userRepository;

    @Autowired
    ObjectMapper mapper;

    @Getter
    @Autowired
    //DataSource para la conexión a la base de datos.
    private final DataSource dataSource;

    @Autowired
    //Codificador de contraseñas.
    private PasswordEncoder passwordEncoder;

    public MyUser obtenerUsuarioPorEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Autowired
    //Servicio de envío de correos electrónicos.
   private IEmailService emailService;

    @Override
    //Método que carga los detalles del usuario (por email) y lanza una excepcion si no se encuentra el usuario.
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        //Buscamos un usuario en el repositorio por email y lo asigna a MyUser:
        MyUser myUser = userRepository.findByEmail(email);

        //Si el usuario es nulo, lanzamos la excepción de que no fue encontrado.
        if (myUser == null) {
            throw new UsernameNotFoundException("User not found");
        }

        //Si encontramos al usuario, creamos y retornamos un objeto User de Spring Security con el email, la constraseña y su colección de roles.
        return new User(myUser.getEmail(), myUser.getPassword(),
                Collections.singleton(new SimpleGrantedAuthority("ROLE_" + myUser.getUsuarioRole())));
    }

    //Método para guardar un nuevo usuario en la base de datos.
    public MyUser saveUsuario(MyUser usuario) throws EmailSendingException{
        // Verificamos si el correo electrónico ya está registrado
        if (userRepository.findByEmail(usuario.getEmail()) != null) {
            throw new EntityExistsException("Email already registered");
        }

        //Establecemos que cuando creamos un nuevo usuario, por defecto tiene el rol de usuario.
        usuario.setUsuarioRole(UsuarioRole.USER);

        //Codificamos la contraseña antes de guardarla.
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));

        //Guardamos el usuario.
        MyUser savedUser = userRepository.save(usuario);

       try {
            // Enviamos el correo electrónico de confirmación
            emailService.sendConfirmationEmail(savedUser);
        } catch (Exception ex) {
            // Aquí puedes manejar la excepción, por ejemplo, puedes registrar el error y lanzar una excepción personalizada
            log.error("Error al enviar el correo electrónico de confirmación", ex);

            throw new EmailSendingException("Error al enviar el correo electrónico de confirmación", ex);
        }

        return savedUser;
    }

    //Método para buscar un usuario.
    public MyUser buscar(Long id) {
        Optional<MyUser> usuario = userRepository.findById(id);
        return mapper.convertValue(usuario, MyUser.class);
    }

    //Método para listar todos los usuarios.
    public List<MyUser> listarTodos() {
        List<MyUser> usuarios = userRepository.findAll();
        return usuarios;
    }

    //Método para actualizar el usuario.
    public void actualizar(MyUser usuario) throws ResourceNotFoundException {
        if (buscar(usuario.getId()) == null) {
            throw new ResourceNotFoundException("No existe el usuario que desea actualizar.");
        }
        userRepository.save(usuario);
    }

}
