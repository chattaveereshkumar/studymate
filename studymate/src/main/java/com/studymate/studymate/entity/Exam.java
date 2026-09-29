package com.studymate.studymate.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

import java.time.LocalDate;

@Entity
public class Exam {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int examId;

    private int studentId;
    private int subjectId;
    private LocalDate examDate;

    public Exam() {
    }

    public Exam(int studentId, int subjectId, LocalDate examDate) {
        this.studentId = studentId;
        this.subjectId = subjectId;
        this.examDate = examDate;
    }

    public int getExamId() {
        return examId;
    }

    public int getStudentId() {
        return studentId;
    }

    public int getSubjectId() {
        return subjectId;
    }

    public LocalDate getExamDate() {
        return examDate;
    }

    public void setStudentId(int studentId) {
        this.studentId = studentId;
    }

    public void setSubjectId(int subjectId) {
        this.subjectId = subjectId;
    }

    public void setExamDate(LocalDate examDate) {
        this.examDate = examDate;
    }
}