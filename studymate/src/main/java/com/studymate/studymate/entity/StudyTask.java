package com.studymate.studymate.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

import java.time.LocalDate;

@Entity
public class StudyTask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int taskId;

    private int studentId;
    private int subjectId;
    private String taskName;
    private LocalDate taskDate;
    private int duration;
    private String status;

    public StudyTask() {
    }

    public StudyTask(int studentId, int subjectId, String taskName,
                     LocalDate taskDate, int duration, String status) {
        this.studentId = studentId;
        this.subjectId = subjectId;
        this.taskName = taskName;
        this.taskDate = taskDate;
        this.duration = duration;
        this.status = status;
    }

    public int getTaskId() {
        return taskId;
    }

    public int getStudentId() {
        return studentId;
    }

    public int getSubjectId() {
        return subjectId;
    }

    public String getTaskName() {
        return taskName;
    }

    public LocalDate getTaskDate() {
        return taskDate;
    }

    public int getDuration() {
        return duration;
    }

    public String getStatus() {
        return status;
    }

    public void setStudentId(int studentId) {
        this.studentId = studentId;
    }

    public void setSubjectId(int subjectId) {
        this.subjectId = subjectId;
    }

    public void setTaskName(String taskName) {
        this.taskName = taskName;
    }

    public void setTaskDate(LocalDate taskDate) {
        this.taskDate = taskDate;
    }

    public void setDuration(int duration) {
        this.duration = duration;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}