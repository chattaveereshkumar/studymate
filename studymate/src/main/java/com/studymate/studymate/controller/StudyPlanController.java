package com.studymate.studymate.controller;

import com.studymate.studymate.entity.StudyPlan;
import com.studymate.studymate.entity.Subject;
import com.studymate.studymate.service.StudyPlanService;
import com.studymate.studymate.repository.SubjectRepository;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/study-plan")
public class StudyPlanController {

    private final StudyPlanService studyPlanService;
    private final SubjectRepository subjectRepository;

    public StudyPlanController(
            StudyPlanService studyPlanService,
            SubjectRepository subjectRepository) {

        this.studyPlanService = studyPlanService;
        this.subjectRepository = subjectRepository;
    }

    @GetMapping("/{studyHours}")
    public List<StudyPlan> generateStudyPlan(
            @PathVariable int studyHours,
            @RequestParam int studentId) {

        List<Subject> subjects =
                subjectRepository.findByStudentId(studentId);

        return studyPlanService.generatePlan(
                studyHours,
                subjects
        );
    }
}