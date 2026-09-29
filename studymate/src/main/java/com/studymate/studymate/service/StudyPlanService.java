package com.studymate.studymate.service;

import com.studymate.studymate.entity.Exam;
import com.studymate.studymate.entity.StudyPlan;
import com.studymate.studymate.entity.Subject;
import com.studymate.studymate.repository.ExamRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
public class StudyPlanService {

    private final ExamRepository examRepository;

    public StudyPlanService(ExamRepository examRepository) {
        this.examRepository = examRepository;
    }

    public List<StudyPlan> generatePlan(
            int studyHours,
            List<Subject> subjects) {

        List<StudyPlan> plans = new ArrayList<>();

        if (subjects == null || subjects.isEmpty()) {
            return plans;
        }

        int totalMinutes = studyHours * 60;

        List<Integer> weights = new ArrayList<>();

        int totalWeight = 0;

        // ==========================================
        // CALCULATE PRIORITY FOR EVERY SUBJECT
        // ==========================================

        for (Subject subject : subjects) {

            int difficultyWeight =
                    getDifficultyWeight(subject);

            int examWeight =
                    getExamWeight(subject);

            // Exam urgency gets stronger priority
            int finalWeight =
                    difficultyWeight + (examWeight * 2);

            weights.add(finalWeight);

            totalWeight += finalWeight;
        }

        int allocatedMinutes = 0;

        // ==========================================
        // GENERATE STUDY PLAN
        // ==========================================

        for (int i = 0; i < subjects.size(); i++) {

            Subject subject = subjects.get(i);

            int duration;

            // Give remaining minutes to the last subject
            if (i == subjects.size() - 1) {

                duration =
                        totalMinutes - allocatedMinutes;

            } else {

                duration =
                        (totalMinutes * weights.get(i))
                                / totalWeight;

                allocatedMinutes += duration;
            }

            StudyPlan plan = new StudyPlan();

            plan.setSubjectName(
                    subject.getSubjectName()
            );

            plan.setStudyDate(
                    LocalDate.now()
            );

            plan.setDuration(
                    duration
            );

            plan.setTask(
                    "Study " + subject.getSubjectName()
            );

            plans.add(plan);
        }

        return plans;
    }


    // ==========================================
    // DIFFICULTY PRIORITY
    // ==========================================

    private int getDifficultyWeight(Subject subject) {

        if (subject.getDifficulty()
                .equalsIgnoreCase("Hard")) {

            return 3;
        }

        if (subject.getDifficulty()
                .equalsIgnoreCase("Medium")) {

            return 2;
        }

        return 1;
    }


    // ==========================================
    // EXAM DATE PRIORITY
    // ==========================================

    private int getExamWeight(Subject subject) {

        List<Exam> exams =
                examRepository.findAll();

        LocalDate today =
                LocalDate.now();

        LocalDate nearestExamDate = null;

        // Find the nearest upcoming exam
        for (Exam exam : exams) {

            // Only consider exams belonging
            // to the current subject
            if (exam.getSubjectId()
                    != subject.getSubjectId()) {

                continue;
            }

            LocalDate examDate =
                    exam.getExamDate();

            // Ignore past exams
            if (examDate.isBefore(today)) {
                continue;
            }

            // First upcoming exam
            if (nearestExamDate == null) {

                nearestExamDate = examDate;

            }
            // Find the closest upcoming exam
            else if (examDate.isBefore(nearestExamDate)) {

                nearestExamDate = examDate;
            }
        }

        // No upcoming exam
        if (nearestExamDate == null) {
            return 0;
        }

        long daysLeft =
                ChronoUnit.DAYS.between(
                        today,
                        nearestExamDate
                );

        // Exam is today
        if (daysLeft == 0) {
            return 3;
        }

        // Exam within 2 days
        if (daysLeft <= 2) {
            return 3;
        }

        // Exam within 7 days
        if (daysLeft <= 7) {
            return 2;
        }

        // Exam more than 7 days away
        return 1;
    }
}