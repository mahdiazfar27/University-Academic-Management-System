// API Service for IUMS Backend
const API_BASE_URL = 'http://localhost:8000/api/v1';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get token from localStorage
  getToken() {
    return localStorage.getItem('auth_token');
  }

  // Set token in localStorage
  setToken(token) {
    localStorage.setItem('auth_token', token);
  }

  // Remove token from localStorage
  removeToken() {
    localStorage.removeItem('auth_token');
  }

  // Make API request with proper headers
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add Authorization header if token exists
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log(`[API] Sending request to ${endpoint}`, {
        token_length: token.length,
        token_preview: token.substring(0, 50) + '...'
      });
    } else {
      console.log(`[API] No token available for request to ${endpoint}`);
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Get response text first before parsing to avoid "body already read" errors
      const responseText = await response.text();
      let data;
      
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        if (!response.ok) {
          throw new Error(`HTTP Error ${response.status}: ${responseText.substring(0, 100)}...`);
        }
        console.error('Failed to parse response as JSON:', parseError);
        console.error('Response text:', responseText);
        throw new Error(`Server returned invalid JSON. Status: ${response.status}`);
      }

      if (!response.ok) {
        // Handle 401 - token expired or invalid
        if (response.status === 401) {
          console.warn('[API] Token expired or invalid - redirecting to login');
          // Show a notification about token expiration
          const event = new CustomEvent('tokenExpired', {
            detail: { message: data.message || 'Your session has expired. Please log in again.' }
          });
          window.dispatchEvent(event);
          
          this.removeToken();
          localStorage.removeItem('user');
          // Use setTimeout to allow any pending requests to complete
          setTimeout(() => {
            window.location.href = '/login';
          }, 500);
        }
        const error = new Error(data.message || `HTTP ${response.status}`);
        error.response = { data, status: response.status };
        error.validationErrors = data.errors;
        throw error;
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // AUTH ENDPOINTS
  async register(firstName, lastName, email, password, role) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        role,
      }),
    });
    
    // Handle nested data structure from backend
    if (response.success) {
      const token = response.data?.token || response.token;
      if (token) {
        this.setToken(token);
      }
    }
    return response;
  }

  async login(email, password, role) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    });
    
    // Handle nested data structure from backend
    if (response.success) {
      const token = response.data?.token || response.token;
      if (token) {
        this.setToken(token);
      }
    }
    return response;
  }

  async logout() {
    this.removeToken();
    return this.request('/auth/logout', { method: 'POST' });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // GENERIC CRUD ENDPOINTS
  async getAll(resource) {
    return this.request(`/${resource}`);
  }

  async getOne(resource, id) {
    return this.request(`/${resource}/${id}`);
  }

  async create(resource, data) {
    return this.request(`/${resource}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async update(resource, id, data) {
    return this.request(`/${resource}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(resource, id) {
    return this.request(`/${resource}/${id}`, {
      method: 'DELETE',
    });
  }

  // SPECIFIC ENDPOINTS FOR EACH RESOURCE
  async getDepartments() {
    return this.getAll('departments');
  }

  async getDepartment(id) {
    return this.getOne('departments', id);
  }

  async createDepartment(data) {
    return this.create('departments', data);
  }

  async updateDepartment(id, data) {
    return this.update('departments', id, data);
  }

  async deleteDepartment(id) {
    return this.delete('departments', id);
  }

  // Courses
  async getCourses() {
    return this.getAll('courses');
  }

  async getCourse(id) {
    return this.getOne('courses', id);
  }

  async createCourse(data) {
    return this.create('courses', data);
  }

  // Course Offerings
  async getCourseOfferings() {
    return this.getAll('course-offerings');
  }

  async getCourseOffering(id) {
    return this.getOne('course-offerings', id);
  }

  // Students
  async getStudents() {
    return this.getAll('students');
  }

  async getStudent(id) {
    return this.getOne('students', id);
  }

  // Teachers
  async getTeachers() {
    return this.getAll('teachers');
  }

  async getTeacher(id) {
    return this.getOne('teachers', id);
  }

  // Enrollments
  async getEnrollments() {
    return this.getAll('enrollments');
  }

  async createEnrollment(data) {
    return this.create('enrollments', data);
  }

  async deleteEnrollment(id) {
    return this.delete('enrollments', id);
  }

  // Results
  async getResults() {
    return this.getAll('results');
  }

  async getResult(id) {
    return this.getOne('results', id);
  }

  // Attendance Endpoints
  async recordAttendance(courseOfferingId, data) {
    return this.request(`/attendance/record/${courseOfferingId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getCourseAttendanceSheet(courseOfferingId, fromDate, toDate) {
    let url = `/attendance/attendance-sheet/${courseOfferingId}`;
    const params = new URLSearchParams();
    if (fromDate) params.append('from_date', fromDate);
    if (toDate) params.append('to_date', toDate);
    if (params.toString()) url += `?${params.toString()}`;
    return this.request(url);
  }

  async getStudentCourseAttendance(studentId, courseOfferingId) {
    return this.request(`/attendance/student/${studentId}/course/${courseOfferingId}`);
  }

  async getEnrollmentAttendance(enrollmentId) {
    return this.request(`/attendance/enrollment/${enrollmentId}`);
  }

  // Payment Endpoints
  async getStudentPayments(studentId, semesterId = null, status = null) {
    let url = `/payments/student/${studentId}`;
    const params = new URLSearchParams();
    if (semesterId) params.append('semester_id', semesterId);
    if (status) params.append('status', status);
    if (params.toString()) url += `?${params.toString()}`;
    return this.request(url);
  }

  async recordPayment(studentId, data) {
    return this.request(`/payments/record/${studentId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getPaymentStatistics(semesterId = null) {
    let url = '/payments/statistics';
    if (semesterId) url += `?semester_id=${semesterId}`;
    return this.request(url);
  }

  // Teacher-specific endpoints (for MyCourses, MarksEntry, Attendance pages)
  async getTeacherDashboard(teacherId) {
    return this.request('/teacher/dashboard', {
      params: { teacher_id: teacherId }
    });
  }

  // Get teacher's assigned courses (for MyCourses, MarksEntry, Attendance dropdowns)
  async getTeacherCourses(teacherId) {
    return this.request(`/teacher/courses?teacher_id=${teacherId}`);
  }

  // Get marks for a course (for MarksEntry page)
  async getCourseMarks(courseOfferingId) {
    return this.request(`/teacher/marks?course_offering_id=${courseOfferingId}`);
  }

  // Submit marks for students in a course
  async submitMarks(data) {
    return this.request('/teacher/marks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Get attendance for a course and date (for Attendance page)
  async getCourseAttendance(courseOfferingId, date) {
    return this.request(`/teacher/attendance?course_offering_id=${courseOfferingId}&date=${date}`);
  }

  // Submit attendance for students in a course
  async submitAttendance(data) {
    return this.request('/teacher/attendance', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Legacy endpoints (kept for backward compatibility)
  async getTeacherCourseOfferings(teacherId) {
    return this.request(`/teacher/${teacherId}/course-offerings`);
  }

  async getCourseStudents(courseOfferingId) {
    return this.request(`/course-offerings/${courseOfferingId}/students`);
  }

  // Settings endpoints
  async getSettings() {
    return this.request('/settings');
  }

  async updateSettings(data) {
    // For logo upload, use FormData to handle large data more efficiently
    const formData = new FormData();
    
    // Add text fields
    if (data.institution_name) {
      formData.append('institution_name', data.institution_name);
    }
    if (data.tagline) {
      formData.append('tagline', data.tagline);
    }
    
    // Handle logo separately - convert data URL to blob if present
    if (data.logo_url) {
      try {
        // If it's a data URL, convert to blob
        if (data.logo_url.startsWith('data:')) {
          const response = await fetch(data.logo_url);
          const blob = await response.blob();
          formData.append('logo', blob, 'logo.' + blob.type.split('/')[1]);
        } else {
          // If it's just the base64 or a URL, pass it as is
          formData.append('logo_url', data.logo_url);
        }
      } catch (err) {
        console.error('Error processing logo:', err);
        // Fallback: send as is if conversion fails
        formData.append('logo_url', data.logo_url);
      }
    }

    const url = `${this.baseURL}/settings`;
    const headers = {
      ...this.getAuthHeaders(),
    };
    // Don't set Content-Type for FormData - browser will set it with boundary
    delete headers['Content-Type'];

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers,
        body: formData,
      });

      const responseText = await response.text();
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        if (!response.ok) {
          throw new Error(`HTTP Error ${response.status}: ${responseText.substring(0, 100)}`);
        }
        throw new Error(`Server returned invalid JSON. Status: ${response.status}`);
      }

      if (!response.ok) {
        if (response.status === 401) {
          this.handleTokenExpired();
        }
        const error = new Error(result.message || `HTTP ${response.status}`);
        error.response = { data: result, status: response.status };
        throw error;
      }

      return result;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  getAuthHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  handleTokenExpired() {
    const event = new CustomEvent('tokenExpired', {
      detail: { message: 'Your session has expired. Please log in again.' }
    });
    window.dispatchEvent(event);
    this.removeToken();
    localStorage.removeItem('user');
    setTimeout(() => {
      window.location.href = '/login';
    }, 500);
  }

  // Health check
  async health() {
    return fetch(`${this.baseURL}/health`).then(r => r.json());
  }
}

export default new ApiService();
