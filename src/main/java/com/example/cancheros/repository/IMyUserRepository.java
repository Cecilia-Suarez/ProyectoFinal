package com.example.cancheros.repository;

import com.example.cancheros.entity.MyUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IMyUserRepository extends JpaRepository<MyUser, Long> {
    MyUser findByEmail(String email);
}
