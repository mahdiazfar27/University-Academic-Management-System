-- IUMS (Integrated University Management System) Database Schema
-- Phase 0: Core Entities

CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'teacher', 'student') NOT NULL DEFAULT 'student',
    status ENUM('active', 'inactive', 'suspended') NOT NULL DEFAULT 'active',
    phone_number VARCHAR(20),
    date_of_birth DATE,
    gender ENUM('M', 'F', 'Other'),
    blood_group VARCHAR(5),
    religion VARCHAR(50),
    profile_image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS departments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL UNIQUE,
    code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    head_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (head_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS teachers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL UNIQUE,
    department_id INT NOT NULL,
    employee_id VARCHAR(50) UNIQUE,
    qualification VARCHAR(255),
    specialization VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE RESTRICT,
    INDEX idx_employee_id (employee_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL UNIQUE,
    department_id INT NOT NULL,
    student_id VARCHAR(50) UNIQUE NOT NULL,
    admission_year YEAR NOT NULL,
    current_semester INT DEFAULT 1,
    gpa DECIMAL(3,2) DEFAULT 0.00,
    cgpa DECIMAL(3,2) DEFAULT 0.00,
    admission_semester VARCHAR(50),
    enrollment_status ENUM('active', 'inactive', 'graduated', 'dropped') DEFAULT 'active',
    father_name VARCHAR(150),
    mother_name VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE RESTRICT,
    UNIQUE KEY unique_student_id (student_id),
    INDEX idx_department_id (department_id),
    INDEX idx_enrollment_status (enrollment_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS semesters (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('planned', 'active', 'completed', 'cancelled') DEFAULT 'planned',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS courses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    credits DECIMAL(3,1) NOT NULL,
    department_id INT NOT NULL,
    prerequisite_course_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE RESTRICT,
    FOREIGN KEY (prerequisite_course_id) REFERENCES courses(id) ON DELETE SET NULL,
    INDEX idx_code (code),
    INDEX idx_department_id (department_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS course_offerings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    teacher_id INT NOT NULL,
    semester_id INT NOT NULL,
    section VARCHAR(20),
    room_number VARCHAR(50),
    max_seats INT NOT NULL DEFAULT 60,
    current_enrollment INT DEFAULT 0,
    schedule_days VARCHAR(50),
    start_time TIME,
    end_time TIME,
    status ENUM('planned', 'active', 'completed', 'cancelled') DEFAULT 'planned',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE RESTRICT,
    FOREIGN KEY (semester_id) REFERENCES semesters(id) ON DELETE CASCADE,
    UNIQUE KEY unique_offering (course_id, teacher_id, semester_id, section),
    INDEX idx_semester_id (semester_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS enrollments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    course_offering_id INT NOT NULL,
    semester_id INT NOT NULL,
    enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('active', 'dropped', 'completed', 'withdrawn') DEFAULT 'active',
    dropped_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (course_offering_id) REFERENCES course_offerings(id) ON DELETE CASCADE,
    FOREIGN KEY (semester_id) REFERENCES semesters(id) ON DELETE CASCADE,
    UNIQUE KEY unique_enrollment (student_id, course_offering_id, semester_id),
    INDEX idx_status (status),
    INDEX idx_semester_id (semester_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS results (
    id INT PRIMARY KEY AUTO_INCREMENT,
    enrollment_id INT NOT NULL,
    course_offering_id INT NOT NULL,
    student_id INT NOT NULL,
    semester_id INT NOT NULL,
    marks_obtained DECIMAL(5,2),
    grade VARCHAR(5),
    grade_point DECIMAL(3,2),
    status ENUM('pending', 'submitted', 'graded', 'challenged') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (enrollment_id) REFERENCES enrollments(id) ON DELETE CASCADE,
    FOREIGN KEY (course_offering_id) REFERENCES course_offerings(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (semester_id) REFERENCES semesters(id) ON DELETE CASCADE,
    UNIQUE KEY unique_result (enrollment_id, semester_id),
    INDEX idx_status (status),
    INDEX idx_student_id (student_id),
    INDEX idx_semester_id (semester_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- VIEWS FOR REPORTING
-- ============================================

CREATE OR REPLACE VIEW student_semester_gpa AS
SELECT 
    s.id as student_id,
    s.student_id as student_code,
    s.user_id,
    sem.id as semester_id,
    sem.name as semester_name,
    COUNT(e.id) as total_credits_taken,
    SUM(r.grade_point * c.credits) / SUM(c.credits) as semester_gpa,
    SUM(c.credits) as total_credits
FROM students s
JOIN enrollments e ON s.id = e.student_id
JOIN course_offerings co ON e.course_offering_id = co.id
JOIN courses c ON co.course_id = c.id
JOIN semesters sem ON e.semester_id = sem.id
LEFT JOIN results r ON e.id = r.enrollment_id
WHERE e.status IN ('active', 'completed')
GROUP BY s.id, sem.id;

CREATE OR REPLACE VIEW student_cgpa AS
SELECT 
    s.id as student_id,
    s.student_id as student_code,
    s.user_id,
    COUNT(DISTINCT sem.id) as semesters_completed,
    ROUND(AVG(r.grade_point), 2) as cgpa,
    SUM(c.credits) as total_credits_earned,
    COUNT(e.id) as total_courses_taken
FROM students s
JOIN enrollments e ON s.id = e.student_id AND e.status IN ('completed')
JOIN results r ON e.id = r.enrollment_id
JOIN course_offerings co ON e.course_offering_id = co.id
JOIN courses c ON co.course_id = c.id
JOIN semesters sem ON e.semester_id = sem.id
GROUP BY s.id;

CREATE OR REPLACE VIEW course_enrollment_summary AS
SELECT 
    co.id as offering_id,
    c.code as course_code,
    c.title as course_title,
    t.id as teacher_id,
    CONCAT(u.first_name, ' ', u.last_name) as teacher_name,
    sem.name as semester,
    co.max_seats,
    co.current_enrollment,
    (co.max_seats - co.current_enrollment) as available_seats,
    co.room_number,
    co.schedule_days,
    co.start_time,
    co.end_time,
    co.status
FROM course_offerings co
JOIN courses c ON co.course_id = c.id
JOIN teachers t ON co.teacher_id = t.id
JOIN users u ON t.user_id = u.id
JOIN semesters sem ON co.semester_id = sem.id;

-- ============================================
-- STORED PROCEDURES
-- ============================================

DELIMITER $$

CREATE PROCEDURE sp_enroll_student(
    IN p_student_id INT,
    IN p_course_offering_id INT,
    IN p_semester_id INT,
    OUT p_result INT,
    OUT p_message VARCHAR(255)
)
BEGIN
    DECLARE v_enrollment_count INT;
    DECLARE v_current_enrollment INT;
    DECLARE v_max_seats INT;
    
    -- Check if student already enrolled
    SELECT COUNT(*) INTO v_enrollment_count
    FROM enrollments
    WHERE student_id = p_student_id 
    AND course_offering_id = p_course_offering_id
    AND status IN ('active', 'completed');
    
    IF v_enrollment_count > 0 THEN
        SET p_result = 0;
        SET p_message = 'Student already enrolled in this course';
    ELSE
        -- Check seat availability
        SELECT current_enrollment, max_seats INTO v_current_enrollment, v_max_seats
        FROM course_offerings
        WHERE id = p_course_offering_id;
        
        IF v_current_enrollment >= v_max_seats THEN
            SET p_result = 0;
            SET p_message = 'Course is full. No seats available';
        ELSE
            -- Create enrollment
            INSERT INTO enrollments (student_id, course_offering_id, semester_id, status)
            VALUES (p_student_id, p_course_offering_id, p_semester_id, 'active');
            
            -- Update current enrollment
            UPDATE course_offerings
            SET current_enrollment = current_enrollment + 1
            WHERE id = p_course_offering_id;
            
            SET p_result = 1;
            SET p_message = 'Enrollment successful';
        END IF;
    END IF;
END$$

CREATE PROCEDURE sp_drop_course(
    IN p_enrollment_id INT,
    OUT p_result INT,
    OUT p_message VARCHAR(255)
)
BEGIN
    DECLARE v_course_offering_id INT;
    DECLARE v_status VARCHAR(20);
    
    -- Get enrollment details
    SELECT course_offering_id, status INTO v_course_offering_id, v_status
    FROM enrollments
    WHERE id = p_enrollment_id;
    
    IF v_status != 'active' THEN
        SET p_result = 0;
        SET p_message = 'Can only drop active enrollments';
    ELSE
        -- Update enrollment status
        UPDATE enrollments
        SET status = 'dropped', dropped_date = CURDATE()
        WHERE id = p_enrollment_id;
        
        -- Update course offering count
        UPDATE course_offerings
        SET current_enrollment = current_enrollment - 1
        WHERE id = v_course_offering_id;
        
        SET p_result = 1;
        SET p_message = 'Course dropped successfully';
    END IF;
END$$

DELIMITER ;

-- ============================================
-- INDEXES (Performance Optimization)
-- ============================================

CREATE INDEX idx_enrollments_student_semester ON enrollments(student_id, semester_id);
CREATE INDEX idx_results_student_semester ON results(student_id, semester_id);
CREATE INDEX idx_course_offerings_semester ON course_offerings(semester_id, status);
