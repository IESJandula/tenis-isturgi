package com.isturgi.backend.repositories;

import com.isturgi.backend.models.ContactoMensaje;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContactoMensajeRepository extends JpaRepository<ContactoMensaje, Long> {
}
