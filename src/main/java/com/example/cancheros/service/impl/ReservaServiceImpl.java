package com.example.cancheros.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import com.example.cancheros.entity.MyUser;
import com.example.cancheros.entity.Producto;
import com.example.cancheros.entity.Reserva;
import com.example.cancheros.exceptions.EmailSendingException;
import com.example.cancheros.exceptions.InternalServerErrorException;
import com.example.cancheros.repository.IMyUserRepository;
import com.example.cancheros.repository.IProductoRepository;
import com.example.cancheros.repository.IReservaRepository;
import com.example.cancheros.service.IEmailService;
import com.example.cancheros.service.IReservaService;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class ReservaServiceImpl implements IReservaService {

    private IReservaRepository reservaRepositorio;
    private IProductoRepository productoRepositorio;
    private IMyUserRepository usuarioRespositorio;
    private IEmailService emailService;

    private static final Logger LOGGER = Logger.getLogger(ReservaServiceImpl.class);

    @Autowired
    ObjectMapper mapper;

    @Autowired
    public ReservaServiceImpl(IReservaRepository reservaRepositorio, IProductoRepository productoRepositorio,
            IMyUserRepository usuarioRespositorio, IEmailService emailService) {
        this.reservaRepositorio = reservaRepositorio;
        this.productoRepositorio = productoRepositorio;
        this.usuarioRespositorio = usuarioRespositorio;
        this.emailService = emailService;
    }

    @Override
    public ResponseEntity<Reserva> guardar(@RequestBody Reserva reserva) throws InternalServerErrorException {
        try {
            LOGGER.info("Guardando reserva con id: " + reserva.getIdReserva());

            Optional<MyUser> usuario = usuarioRespositorio.findById(reserva.getUsuario().getId());
            Optional<Producto> producto = productoRepositorio.findById(reserva.getProducto().getId());

            if (usuario.isPresent() && producto.isPresent()) {
                // Asignamos el usuario y el producto a la reserva
                reserva.setProducto(producto.get());
                reserva.setUsuario(usuario.get());

                // Verificamos si el número de teléfono está presente y es válido
                if (reserva.getTelefono() != null && reserva.getTelefono() != 0) {
                    LOGGER.info("Número de teléfono proporcionado: " + reserva.getTelefono());
                }
                // Verificamos si las indicaciones están presentes y son válidas
                if (reserva.getIndicaciones() != null && !reserva.getIndicaciones().isEmpty()) {
                    LOGGER.info("Indicaciones proporcionadas: " + reserva.getIndicaciones());
                }

                reservaRepositorio.save(reserva);
                LOGGER.info("Reserva guardada con éxito.");

                //enviarCorreoConfirmacion(reserva, usuario.get());
                return ResponseEntity.ok(reserva);
            } else {
                LOGGER.error("No se ha encontrado el usuario o el producto con los IDs proporcionados.");
                throw new InternalServerErrorException("No se ha encontrado el usuario o el producto con los IDs proporcionados.");
            }

        } catch (Exception e) {
            LOGGER.error("Error al guardar la reserva: ", e);
            throw new InternalServerErrorException("Error al guardar la reserva");
        }
    }

    private void enviarCorreoConfirmacion(Reserva savedReserva, MyUser usuario) throws EmailSendingException {
        try {
            // Enviamos el correo electrónico de confirmación de reserva
            emailService.sendConfirmationReserva(savedReserva, usuario);
        } catch (Exception ex) {
            // Si falla el envío del correo electrónico, lanzamos una excepción
            LOGGER.error("Error al enviar el correo electrónico de confirmación de reserva", ex);
            throw new EmailSendingException("Error al enviar el correo electrónico de confirmación de reserva", ex);
        }
    }

    @Override
    public List<Reserva> listarTodos() {
        LOGGER.info("Listando todas las reservas");
        return reservaRepositorio.findAll();
    }

    @Override
    public List<Reserva> listarReservasPorUsuario(Long idUsuario) {
        // Aquí va tu lógica para listar las reservas por usuario.
        // Por ejemplo, podrías buscar el usuario por su ID y luego obtener todas sus reservas.
        Optional<MyUser> usuario = usuarioRespositorio.findById(idUsuario);
        if (usuario.isPresent()) {
            return reservaRepositorio.findByUsuarioId(idUsuario);
        } else {
            // Lanza una excepción o devuelve una lista vacía si el usuario no existe.
            return new ArrayList<>();
        }
    }

    @Override
    public Reserva buscar(Long id) throws ResourceNotFoundException {
        LOGGER.info("Buscando reserva con el ID: " + id);
        return reservaRepositorio.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No existe la reserva solicitada: " + id));
    }

    @Override
    public void eliminar(Long id) throws ResourceNotFoundException {
        LOGGER.info("Eliminando la reserva: " + id);
        Reserva reserva = buscar(id);
        reservaRepositorio.delete(reserva);
        LOGGER.info("Reserva eliminada con éxito: " + id);
    }

    @Override
    public void actualizar(Reserva reserva) throws ResourceNotFoundException {
        LOGGER.info("Actualizando la reserva con id: " + reserva.getIdReserva());
        Reserva reservaExistente = reservaRepositorio.findById(reserva.getIdReserva())
                .orElseThrow(() -> new ResourceNotFoundException("No existe la reserva solicitada: " + reserva.getIdReserva()));

        reservaExistente.setFecha(reserva.getFecha());
        reservaExistente.setHora(reserva.getHora());

        Producto producto = productoRepositorio.findById(reserva.getProducto().getIdProducto())
                .orElseThrow(() -> new ResourceNotFoundException("No existe el producto con ID: " + reserva.getProducto().getIdProducto()));
        MyUser usuario = usuarioRespositorio.findById(reserva.getUsuario().getId())
                .orElseThrow(() -> new ResourceNotFoundException("No existe el usuario con ID: " + reserva.getUsuario().getId()));

        reservaExistente.setProducto(producto);
        reservaExistente.setUsuario(usuario);

        reservaRepositorio.save(reservaExistente);
        LOGGER.info("Reserva actualizada con éxito.");
    }
}
