package com.university.academicassistant.academic;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/academic")
@Tag(name = "Academic Catalog", description = "Endpoints for academic departments, courses, and syllabus subjects")
public class AcademicController {

    private final AcademicService academicService;

    public AcademicController(AcademicService academicService) {
        this.academicService = academicService;
    }

    @GetMapping("/departments")
    @Operation(summary = "List all academic departments")
    public ResponseEntity<List<Department>> getDepartments() {
        return ResponseEntity.ok(academicService.getAllDepartments());
    }

    @GetMapping("/courses")
    @Operation(summary = "List courses, optionally filtered by departmentId")
    public ResponseEntity<List<Course>> getCourses(@RequestParam(required = false) Long departmentId) {
        return ResponseEntity.ok(academicService.getCoursesByDepartment(departmentId));
    }

    @GetMapping("/subjects")
    @Operation(summary = "List subjects, optionally filtered by courseId and semester")
    public ResponseEntity<List<Subject>> getSubjects(
            @RequestParam(required = false) Long courseId,
            @RequestParam(required = false) Integer semester) {
        return ResponseEntity.ok(academicService.getSubjects(courseId, semester));
    }
}
