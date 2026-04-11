import React, { useState, useEffect } from 'react';
import styles from './Results.module.css';
import apiService from '../../api/apiService';

/* ── SVG Icons ── */
const DownloadIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

const PrintIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 6 2 18 2 18 9"></polyline>
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
    <rect x="6" y="14" width="12" height="8"></rect>
  </svg>
);

const TrendUpIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
    <polyline points="17 6 23 6 23 12"></polyline>
  </svg>
);

const OfficialSeal = () => (
  <svg viewBox="0 0 100 100" fill="none" className={styles.sealArea}>
    <circle cx="50" cy="50" r="45" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 4" />
    <path d="M30 50 L50 30 L70 50 L50 70 Z" fill="#94a3b8" opacity="0.3" />
    <circle cx="50" cy="50" r="20" stroke="#94a3b8" strokeWidth="1" />
  </svg>
);

const GradeBadge = ({ grade }) => {
  const gradeKey = grade.replace('+', '_plus').replace('-', '_minus');
  const themeClass = styles[`grade_${gradeKey}`] || styles.grade_A;
  return (
    <div className={`${styles.gradeBadge} ${themeClass}`}>
      {grade}
    </div>
  );
};

export default function MyResults() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [studentData, setStudentData] = useState(null);
  const [results, setResults] = useState([]);
  const [resultsBySemester, setResultsBySemester] = useState({});
  const [semesterHistory, setSemesterHistory] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [semesters, setSemesters] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('[Results] Fetching student data and results...');
        setLoading(true);
        setError('');

        // Get current user info
        const meResponse = await apiService.getCurrentUser();
        const userData = meResponse.data;
        console.log('[Results] Current user:', userData);
        
        // Get user's student profile
        const studentResponse = await apiService.request('/student/profile');
        const studentInfo = studentResponse.data;
        console.log('[Results] Student info:', studentInfo);
        setStudentData(studentInfo);

        // Get all semesters
        const semesterResponse = await apiService.request('/semesters?per_page=9999');
        const semesterList = semesterResponse.data?.data || semesterResponse.data || [];
        console.log('[Results] Semesters:', semesterList.length);
        setSemesters(semesterList);

        // Get results for current student with pagination
        const resultsResponse = await apiService.request('/results?per_page=9999');
        const resultsList = resultsResponse.data?.data || resultsResponse.data || [];
        console.log('[Results] Results fetched:', resultsList.length);
        
        // Organize results by semester
        const orgResultsBySemester = {};
        resultsList.forEach(result => {
          if (!orgResultsBySemester[result.semester_id]) {
            orgResultsBySemester[result.semester_id] = [];
          }
          orgResultsBySemester[result.semester_id].push(result);
        });
        setResultsBySemester(orgResultsBySemester);

        // Calculate GPA for each semester
        const historyData = Object.entries(orgResultsBySemester).map(([semId, semResults]) => {
          const totalCredits = semResults.reduce((sum, r) => sum + (r.courseOffering?.course?.credits || 0), 0);
          const totalQualityPoints = semResults.reduce((sum, r) => sum + (r.grade_point || 0) * (r.courseOffering?.course?.credits || 0), 0);
          const gpa = totalCredits > 0 ? (totalQualityPoints / totalCredits).toFixed(3) : 0;
          
          const semester = semesterList.find(s => s.id == semId);
          return {
            semesterId: semId,
            semesterName: semester ? `${semester.academic_year} ${semester.semester}` : `Semester ${semId}`,
            gpa,
            totalCredits
          };
        }).sort((a, b) => parseInt(a.semesterId) - parseInt(b.semesterId));

        setSemesterHistory(historyData);

        // Set results for the latest semester
        const latestSemesterId = Math.max(...Object.keys(orgResultsBySemester).map(Number));
        if (latestSemesterId && orgResultsBySemester[latestSemesterId]) {
          setResults(orgResultsBySemester[latestSemesterId]);
          setSelectedSemester(latestSemesterId);
        }

        console.log('[Results] Data loaded successfully');
      } catch (err) {
        console.error('[Results] Error fetching data:', err);
        setError('Failed to load results. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSemesterChange = (semesterId) => {
    if (!semesterId) {
      // Show all results
      setResults(Object.values(resultsBySemester).flat());
      setSelectedSemester(null);
    } else {
      // Convert string value to number to match resultsBySemester keys
      const numSemesterId = parseInt(semesterId, 10);
      // Show results for selected semester
      const semResults = resultsBySemester[numSemesterId] || [];
      setResults(semResults);
      setSelectedSemester(numSemesterId);
    }
  };

  const calculateMetrics = () => {
    if (!results.length) return { totalCredits: 0, totalQualityPoints: 0, gpa: 0 };
    
    const totalCredits = results.reduce((sum, r) => sum + (r.courseOffering?.course?.credits || 0), 0);
    const totalQualityPoints = results.reduce((sum, r) => sum + ((r.grade_point || 0) * (r.courseOffering?.course?.credits || 0)), 0);
    const gpa = totalCredits > 0 ? (totalQualityPoints / totalCredits).toFixed(3) : 0;
    
    // Calculate CGPA (average of all semesters)
    const totalAllCredits = semesterHistory.reduce((sum, s) => sum + s.totalCredits, 0);
    const avgGpa = semesterHistory.length > 0 
      ? (semesterHistory.reduce((sum, s) => sum + parseFloat(s.gpa), 0) / semesterHistory.length).toFixed(3)
      : 0;

    return { totalCredits, totalQualityPoints, gpa, cgpa: avgGpa };
  };

  const metrics = calculateMetrics();

  if (loading) {
    return <div className={styles.resultsContainer}><div style={{padding: '40px', textAlign: 'center'}}>Loading results...</div></div>;
  }

  if (error) {
    return <div className={styles.resultsContainer}><div style={{padding: '40px', textAlign: 'center', color: '#dc2626'}}>{error}</div></div>;
  }

  return (
    <div className={styles.resultsContainer}>
      <div className={styles.headerRow}>
        <div className={styles.titleArea}>
          <h1>Semester Grade Sheet</h1>
          <div className={styles.subtitle}>Academic Year {new Date().getFullYear()} • Spring Semester</div>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.exportBtn} onClick={() => window.print()}>
            <DownloadIcon /> Export PDF
          </button>
          <button className={styles.printBtn} onClick={() => window.print()}>
            <PrintIcon /> Print Result
          </button>
        </div>
      </div>

      <div className={styles.infoGrid}>
        {/* STUDENT PROFILE CARD */}
        <div className={styles.profileCard}>
          <div className={styles.profileHeader}>
            <span className={styles.cardTitle}>Student Profile Details</span>
            <span className={styles.regularBadge}>{studentData?.is_regular ? 'REGULAR STUDENT' : 'IRREGULAR'}</span>
          </div>
          <div className={styles.detailsGrid}>
            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>FULL NAME</div>
              <div className={styles.infoValue}>
                {studentData?.user?.first_name && studentData?.user?.last_name
                  ? `${studentData.user.first_name} ${studentData.user.last_name}`
                  : 'N/A'}
              </div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>STUDENT ID</div>
              <div className={styles.infoValue}>{studentData?.student_id || 'N/A'}</div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>DEPARTMENT</div>
              <div className={styles.infoValue}>{studentData?.department?.name || 'N/A'}</div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>SESSION</div>
              <div className={styles.infoValue}>{studentData?.current_semester || 'N/A'}</div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>CREDIT COMPLETED</div>
              <div className={styles.infoValue}>{metrics.totalCredits || '0'} credits</div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>ADMISSION YEAR</div>
              <div className={styles.infoValue}>{studentData?.admission_year || 'N/A'}</div>
            </div>
          </div>
        </div>

        {/* GPA WIDGETS */}
        <div className={styles.gpaColumn}>
          <div className={`${styles.gpaCard} ${styles.semesterGpaCard}`}>
            <div className={styles.cardLabel}>SEMESTER GPA</div>
            <div className={styles.gpaValue}>{metrics.gpa}</div>
            <div className={styles.gpaTrend}>
              <TrendUpIcon /> Current Semester
            </div>
          </div>

          <div className={`${styles.gpaCard} ${styles.cumulativeCard}`}>
            <div className={styles.cardLabel}>CUMULATIVE GPA (CGPA)</div>
            <div className={styles.gpaValue}>{metrics.cgpa}</div>
            <div className={styles.progressBarBg}>
              <div className={styles.progressBarFill} style={{ width: (metrics.cgpa / 4 * 100) + '%' }}></div>
            </div>
            <div className={styles.deptInfo}>{semesterHistory.length} Semester(s) Completed</div>
          </div>
        </div>
      </div>

      {/* SEMESTER SELECTOR */}
      {semesters.length > 0 && (
        <div style={{marginBottom: '20px', padding: '15px', backgroundColor: '#f8fafc', borderRadius: '8px'}}>
          <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px', color: '#475569'}}>
            Select Semester:
          </label>
          <select 
            value={selectedSemester || ''} 
            onChange={(e) => handleSemesterChange(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              fontSize: '14px',
              fontFamily: 'inherit'
            }}
          >
            <option value="">All Semesters</option>
            {semesters.map((sem) => (
              <option key={sem.id} value={sem.id}>
                {sem.academic_year} {sem.semester}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* RESULTS TABLE */}
      {results.length > 0 ? (
        <div className={styles.resultsCard}>
          <div className={styles.resultsHeader}>
            <h2 className={styles.cardTitle}>Result of Semester Final Examinations</h2>
            <div className={styles.legend}>
              <div className={styles.legendItem}>
                <span className={styles.dot} style={{ backgroundColor: '#1e3a8a' }}></span> Regular
              </div>
              <div className={styles.legendItem}>
                <span className={styles.dot} style={{ backgroundColor: '#f59e0b' }}></span> Retake
              </div>
            </div>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.resultsTable}>
              <thead>
                <tr>
                  <th style={{ width: '140px' }}>COURSE CODE</th>
                  <th>COURSE TITLE</th>
                  <th style={{ textAlign: 'center' }}>CREDIT</th>
                  <th style={{ textAlign: 'center' }}>GRADE</th>
                  <th style={{ textAlign: 'center' }}>GRADE POINT</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, idx) => (
                  <tr key={idx}>
                    <td className={styles.courseCode}>{result.courseOffering?.course?.course_code || 'N/A'}</td>
                    <td className={styles.courseTitle}>{result.courseOffering?.course?.title || 'N/A'}</td>
                    <td style={{ textAlign: 'center' }}>{result.courseOffering?.course?.credits || '0'}</td>
                    <td style={{ textAlign: 'center' }}><GradeBadge grade={result.grade || 'N/A'} /></td>
                    <td style={{ textAlign: 'center', fontWeight: '800' }}>{result.grade_point || '0.00'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.tableFooter}>
            <div className={styles.footerItem}>
              <div className={styles.footerLabel}>TOTAL CREDITS TAKEN</div>
              <div className={styles.footerValue}>{metrics.totalCredits.toFixed(2)}</div>
            </div>
            <div className={styles.footerItem}>
              <div className={styles.footerLabel}>TOTAL QUALITY POINTS</div>
              <div className={styles.footerValue}>{metrics.totalQualityPoints.toFixed(2)}</div>
            </div>
            <div className={`${styles.footerItem} ${styles.calculatedGpa}`}>
              <div className={styles.footerLabel}>CALCULATED GPA</div>
              <div className={styles.footerValue}>{metrics.gpa}</div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{padding: '40px', textAlign: 'center', color: '#94a3b8'}}>
          No results found for the selected semester.
        </div>
      )}

      {/* TREND CHART */}
      {semesterHistory.length > 0 && (
        <div className={styles.trendCard}>
          <h2 className={styles.cardTitle}>GPA Trend over Semesters</h2>
          <div className={styles.chartContainer}>
            {semesterHistory.map((bar, idx) => (
              <div key={idx} className={styles.barWrapper}>
                <div 
                  className={`${styles.bar}`}
                  style={{ 
                    height: (parseFloat(bar.gpa) / 4 * 100) + '%',
                    backgroundColor: '#1e3a8a'
                  }}
                >
                  <div className={styles.barTooltip}>{bar.gpa}</div>
                </div>
                <span className={styles.barLabel}>{bar.semesterName}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PAGE FOOTER */}
      <div className={styles.pageFooter}>
        <div className={styles.footerContent}>
          <OfficialSeal />
          <div className={styles.disclaimer}>
            "This grade sheet is a computer-generated document from the Integrated University Management System (IUMS). For official verification, please contact the Office of the Controller of Examinations."
          </div>
        </div>
        <div className={styles.generationArea}>
          <div className={styles.genLabel}>GENERATION DATE</div>
          <div className={styles.genTime}>{new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</div>
        </div>
      </div>
    </div>
  );
}
