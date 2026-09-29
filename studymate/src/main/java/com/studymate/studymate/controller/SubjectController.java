package com.studymate.studymate.controller;

import com.studymate.studymate.entity.Subject;
import com.studymate.studymate.entity.StudyTask;
import com.studymate.studymate.repository.SubjectRepository;
import com.studymate.studymate.repository.StudyTaskRepository;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/subjects")
public class SubjectController {

    private final SubjectRepository subjectRepository;
    private final StudyTaskRepository studyTaskRepository;

    public SubjectController(
            SubjectRepository subjectRepository,
            StudyTaskRepository studyTaskRepository) {

        this.subjectRepository = subjectRepository;
        this.studyTaskRepository = studyTaskRepository;
    }

    // ===============================
    // GET SUBJECTS FOR ONE STUDENT
    // ===============================

    @GetMapping
    public List<Subject> getAllSubjects(
            @RequestParam int studentId) {

        return subjectRepository.findByStudentId(studentId);
    }


    // ===============================
    // ADD SUBJECT
    // ===============================

    @PostMapping
    public Subject addSubject(
            @RequestBody Subject subject) {

        return subjectRepository.save(subject);
    }


    // ===============================
    // DELETE SUBJECT
    // ===============================

    @DeleteMapping("/{id}")
    public void deleteSubject(
            @PathVariable int id) {

        List<StudyTask> tasks =
                studyTaskRepository.findBySubjectId(id);

        studyTaskRepository.deleteAll(tasks);

        subjectRepository.deleteById(id);
    }
}