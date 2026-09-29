package com.studymate.studymate.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

@Entity
public class Subject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int subjectId;

    private int studentId;
    private String subjectName;
    private String difficulty;

    public Subject() {
    }

    public Subject(int studentId, String subjectName, String difficulty) {
        this.studentId = studentId;
        this.subjectName = subjectName;
        this.difficulty = difficulty;
    }

    public int getSubjectId() {
        return subjectId;
    }

    public int getStudentId() {
        return studentId;
    }

    public String getSubjectName() {
        return subjectName;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setStudentId(int studentId) {
        this.studentId = studentId;
    }

    public void setSubjectName(String subjectName) {
        this.subjectName = subjectName;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }
}
