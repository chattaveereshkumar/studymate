package com.studymate.studymate.repository;

import com.studymate.studymate.entity.Subject;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubjectRepository
        extends JpaRepository<Subject, Integer> {

    List<Subject> findByStudentId(int studentId);

}