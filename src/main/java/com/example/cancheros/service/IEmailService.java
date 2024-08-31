package com.example.cancheros.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.example.cancheros.entity.MyUser;
import com.example.cancheros.entity.Producto;
import com.example.cancheros.entity.Reserva;

import lombok.extern.log4j.Log4j;

@Service
@Log4j
public class IEmailService {

    private final JavaMailSender mailSender;

    @Autowired
    //Servicio de envío de correos electrónicos.
    public IEmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    //Envía un correo electrónico de confirmación de registro.
    public void sendConfirmationEmail(MyUser user) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("cancherosg4@gmail.com");
        message.setTo(user.getEmail());
        message.setSubject("Confirmación de registro");
        message.setText("Hola " + user.getNombre() + ",\n\nHas registrado la cuenta con el correo electrónico: " + user.getEmail() + "\n\nConfirmación de registro exitosa. " /*+ "\nPuedes iniciar sesión aquí: http://localhost:8080/login"*/ + "\n\nSaludos,\nEl equipo de Cancheros");
        try {
            mailSender.send(message);
        } catch (MailException e){
            System.out.println(e.getMessage() + " " + e.getCause());
            System.out.println(message.getFrom());
        }


    }

    //Envía un correo electrónico de confirmación de reserva.
    public void sendConfirmationReserva(Reserva reserva, MyUser usuario) {
        Producto producto = reserva.getProducto();

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("cancherosg4@gmail.com");
        message.setTo(usuario.getEmail());
        message.setSubject("Confirmación de reserva");

        StringBuilder sb = new StringBuilder();
        sb.append("Hola ").append(usuario.getNombre()).append(",\n\n")
                .append("Has registrado una reserva con el correo electrónico: ").append(usuario.getEmail()).append("\n")
                .append("Detalles de la reserva:\n")
                .append("Producto reservado: ").append(reserva.getProducto().getNombreProducto()).append("\n")
                .append("Descripción del producto: ").append(reserva.getProducto().getDescripcion()).append("\n")
                .append("Fecha: ").append(reserva.getFecha()).append("\n")
                .append("Hora: ").append(reserva.getHora()).append("\n");
                
        // Verificar si el usuario ha proporcionado un número de teléfono y agregarlo al correo
        if (reserva.getTelefono() != null && reserva.getTelefono() != 0) {
            sb.append("Teléfono proporcionado: ").append(reserva.getTelefono()).append("\n");
        }
        // Verificar si el usuario ha proporcionado indicaciones y agregarlas al correo
        if (reserva.getIndicaciones() != null && !reserva.getIndicaciones().isEmpty()) {
            sb.append("Indicaciones: ").append(reserva.getIndicaciones()).append("\n");
        }

        sb.append("\n\n")
                .append("Información de contacto del proveedor: ")
                .append("\n\n")
                .append("Complejo Deportivo Cancheros.").append("\n")
                .append("Dirección: Av. Siempreviva 742.").append("\n")
                .append("Teléfono: 0303456").append("\n")
                .append("Correo electrónico: cancherosg4@gmail.com")
                .append("\n\nConfirmación de reserva exitosa. \n\nSaludos,\nEl equipo de Cancheros.");
        message.setText(sb.toString());

        mailSender.send(message);
    }

}
