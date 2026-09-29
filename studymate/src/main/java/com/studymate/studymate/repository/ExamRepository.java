package com.studymate.studymate.repository;

import com.studymate.studymate.entity.Exam;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ExamRepository extends JpaRepository<Exam, Integer> {

    Optional<Exam> findByStudentIdAndSubjectId(
            int studentId,
            int subjectId
    );
}