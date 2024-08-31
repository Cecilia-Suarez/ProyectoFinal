package com.example.cancheros.service.impl;

import java.util.List;
import java.util.Optional;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.cancheros.entity.Caracteristica;
import com.example.cancheros.repository.ICaracteristicaRepository;
import com.example.cancheros.service.ICaracteristicaService;

@Service
// implementa la interfaz de servicio de características
public class CaracteristicaServiceImpl implements ICaracteristicaService {
    private final ICaracteristicaRepository caracteristicaRepository;
    private static final Logger logger = Logger.getLogger(CaracteristicaServiceImpl.class);

    @Autowired
    // inyecta el repositorio de características
    public CaracteristicaServiceImpl(ICaracteristicaRepository caracteristicaRepository) {
        this.caracteristicaRepository = caracteristicaRepository;
    }

    @Override
    // guarda una nueva característica en la base de datos
    public Caracteristica save(Caracteristica caracteristica) {
        return caracteristicaRepository.save(caracteristica);
    }

    @Override
    //devuelve todas las características disponibles en la base de datos
    public List<Caracteristica> findAll() {
        return caracteristicaRepository.findAll();
    }

    @Override
    // devuelve una característica específica basada en su ID
    public Optional<Caracteristica> findById(Long id) {
        return caracteristicaRepository.findById(id);
    }

    @Override
    // elimina una característica específica basada en su ID
    public void deleteById(Long id) {
        caracteristicaRepository.deleteById(id);
    }

    public class CaracteristicaNotFoundException extends RuntimeException {
        public CaracteristicaNotFoundException(String message) {
            super(message);
        }
    }
    
    private static final Logger LOGGER = Logger.getLogger(CaracteristicaServiceImpl.class);

    @Override
    public void actualizar(Caracteristica caracteristica) {
        LOGGER.info("La caracteristica fue actualizada con exito");
        caracteristicaRepository.save(caracteristica);
    }
}






