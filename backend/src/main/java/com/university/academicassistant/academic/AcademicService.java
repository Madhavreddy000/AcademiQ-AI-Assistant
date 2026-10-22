package com.university.academicassistant.academic;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AcademicService {

    private final DepartmentRepository departmentRepository;
    private final CourseRepository courseRepository;
    private final SubjectRepository subjectRepository;

    public AcademicService(DepartmentRepository departmentRepository,
                           CourseRepository courseRepository,
                           SubjectRepository subjectRepository) {
        this.departmentRepository = departmentRepository;
        this.courseRepository = courseRepository;
        this.subjectRepository = subjectRepository;
    }

    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    public List<Course> getCoursesByDepartment(Long departmentId) {
        if (departmentId != null) {
            return courseRepository.findByDepartmentId(departmentId);
        }
        return courseRepository.findAll();
    }

    public List<Subject> getSubjects(Long courseId, Integer semester) {
        if (courseId != null && semester != null) {
            return subjectRepository.findByCourseIdAndSemester(courseId, semester);
        } else if (courseId != null) {
            return subjectRepository.findByCourseId(courseId);
        }
        return subjectRepository.findAll();
    }
}
