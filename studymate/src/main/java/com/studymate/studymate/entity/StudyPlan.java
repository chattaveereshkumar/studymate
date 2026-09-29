package com.studymate.studymate.entity;

import java.time.LocalDate;

public class StudyPlan {

    private String subjectName;
    private LocalDate studyDate;
    private int duration;
    private String task;

    public StudyPlan() {
    }

    public StudyPlan(String subjectName,
                     LocalDate studyDate,
                     int duration,
                     String task) {

        this.subjectName = subjectName;
        this.studyDate = studyDate;
        this.duration = duration;
        this.task = task;
    }

    public String getSubjectName() {
        return subjectName;
    }

    public LocalDate getStudyDate() {
        return studyDate;
    }

    public int getDuration() {
        return duration;
    }

    public String getTask() {
        return task;
    }

    public void setSubjectName(String subjectName) {
        this.subjectName = subjectName;
    }

    public void setStudyDate(LocalDate studyDate) {
        this.studyDate = studyDate;
    }

    public void setDuration(int duration) {
        this.duration = duration;
    }

    public void setTask(String task) {
        this.task = task;
    }
}