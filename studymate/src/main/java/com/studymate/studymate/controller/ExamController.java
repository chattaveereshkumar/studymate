package com.studymate.studymate.controller;

import com.studymate.studymate.entity.Exam;
import com.studymate.studymate.repository.ExamRepository;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/exams")
public class ExamController {

    private final ExamRepository examRepository;

    public ExamController(ExamRepository examRepository) {
        this.examRepository = examRepository;
    }

    @GetMapping
    public List<Exam> getAllExams() {
        return examRepository.findAll();
    }

    @PostMapping
    public Exam addOrUpdateExam(@RequestBody Exam exam) {

        Optional<Exam> existingExam =
                examRepository.findByStudentIdAndSubjectId(
                        exam.getStudentId(),
                        exam.getSubjectId()
                );

        if (existingExam.isPresent()) {

            Exam currentExam = existingExam.get();

            currentExam.setExamDate(
                    exam.getExamDate()
            );

            return examRepository.save(currentExam);
        }

        return examRepository.save(exam);
    }
}