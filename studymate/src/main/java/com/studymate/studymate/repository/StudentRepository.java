package com.studymate.studymate.repository;

import com.studymate.studymate.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudentRepository
        extends JpaRepository<Student, Integer> {

    Optional<Student> findByUserId(int userId);
}