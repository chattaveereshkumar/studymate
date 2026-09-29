package com.studymate.studymate.controller;

import com.studymate.studymate.entity.Student;
import com.studymate.studymate.repository.StudentRepository;

import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/students")
public class StudentController {

    private final StudentRepository studentRepository;

    public StudentController(
            StudentRepository studentRepository) {

        this.studentRepository =
                studentRepository;
    }

    // =========================
    // GET STUDENT BY USER ID
    // =========================

    @GetMapping("/user/{userId}")
    public Student getStudentByUserId(
            @PathVariable int userId) {

        return studentRepository
                .findByUserId(userId)
                .orElse(null);
    }


    // =========================
    // CREATE STUDENT PROFILE
    // =========================

    @PostMapping
    public Student createStudent(
            @RequestBody Student student) {

        return studentRepository.save(student);
    }


    // =========================
    // UPDATE STUDENT PROFILE
    // =========================

    @PutMapping("/{id}")
    public Student updateStudent(
            @PathVariable int id,
            @RequestBody Student student) {

        Student existingStudent =
                studentRepository
                        .findById(id)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Student not found"
                                )
                        );

        existingStudent.setName(
                student.getName()
        );

        existingStudent.setEmail(
                student.getEmail()
        );

        existingStudent.setStudyHours(
                student.getStudyHours()
        );

        return studentRepository.save(
                existingStudent
        );
    }
}