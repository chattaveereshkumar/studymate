package com.studymate.studymate.controller;

import com.studymate.studymate.entity.StudyTask;
import com.studymate.studymate.repository.StudyTaskRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class StudyTaskController {

    private final StudyTaskRepository studyTaskRepository;

    public StudyTaskController(StudyTaskRepository studyTaskRepository) {
        this.studyTaskRepository = studyTaskRepository;
    }

    @GetMapping
    public List<StudyTask> getAllTasks() {
        return studyTaskRepository.findAll();
    }

    @PostMapping
    public StudyTask addTask(@RequestBody StudyTask studyTask) {
        return studyTaskRepository.save(studyTask);
    }

    // Update task duration
    @PutMapping("/{id}")
    public StudyTask updateTask(
            @PathVariable int id,
            @RequestParam int duration) {

        StudyTask task = studyTaskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        task.setDuration(duration);

        return studyTaskRepository.save(task);
    }

    // Mark a study task as completed
    @PutMapping("/{id}/complete")
    public StudyTask completeTask(@PathVariable int id) {

        StudyTask task = studyTaskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        task.setStatus("Completed");

        return studyTaskRepository.save(task);
    }
}