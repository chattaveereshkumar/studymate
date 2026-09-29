package com.studymate.studymate.repository;

import com.studymate.studymate.entity.StudyTask;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudyTaskRepository extends JpaRepository<StudyTask, Integer> {

    List<StudyTask> findBySubjectId(int subjectId);
}