import React, { useState, useEffect } from 'react';
import styles from './PaymentHistory.module.css';
import apiService from '../../api/apiService';

/* ── SVG Icons ── */
const CalendarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const MoreIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="1"></circle>
    <circle cx="12" cy="5" r="1"></circle>
    <circle cx="12" cy="19" r="1"></circle>
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const CardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
    <line x1="1" y1="10" x2="23" y2="10"></line>
  </svg>
);

const StatusBadge = ({ status }) => {
  const statusLower = status.toLowerCase();
  const badgeClass = styles[statusLower] || styles.completed;
  return (
    <div className={`${styles.statusBadge} ${badgeClass}`}>
      <span className={styles.dot}></span>
      {status}
    </div>
  );
};

const SemesterCard = ({ semester, transactions, footerNote, totalVerified }) => {
  return (
    <div className={styles.semesterCard}>
      <div className={styles.cardHeader}>
        <div className={styles.semesterName}>
          <div className={styles.calendarIcon}>
            <CalendarIcon />
          </div>
          <span className={styles.semesterTitle}>{semester}</span>
        </div>
        <div className={styles.activeBadge}>
          <div className={styles.menuIcon}><MoreIcon /></div>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.paymentTable}>
          <thead>
            <tr>
              <th className={styles.snCol}>S/N</th>
              <th className={styles.dateCol}>DUE DATE</th>
              <th className={styles.dateCol}>PAYMENT DATE</th>
              <th>FEE GROUP</th>
              <th style={{ textAlign: 'right' }}>AMOUNT</th>
              <th>METHOD</th>
              <th>TRANS. ID</th>
              <th>STATUS</th>
              <th style={{ textAlign: 'center' }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((t, idx) => (
                <tr key={idx}>
                  <td className={styles.snCol}>{t.sn}</td>
                  <td className={styles.dateCol}>{t.dueDate}</td>
                  <td className={styles.dateCol}>{t.payDate}</td>
                  <td className={styles.feeCol}>{t.feeGroup}</td>
                  <td className={styles.amountCol} style={{ textAlign: 'right' }}>৳ {t.amount}</td>
                  <td className={styles.methodCol}>{t.method}</td>
                  <td className={styles.transIdCol}>{t.transId}</td>
                  <td><StatusBadge status={t.status} /></td>
                  <td style={{ textAlign: 'center' }}>
                    <div className={styles.eyeIcon}><EyeIcon /></div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="9" style={{textAlign: 'center', padding: '20px', color: '#94a3b8'}}>No transactions</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.cardFooter}>
        <div className={styles.footerNote}>{footerNote}</div>
        <div className={styles.totalLabel}>
          Total Verified Payments: <span className={styles.totalValue}>৳ {totalVerified}</span>
        </div>
      </div>
    </div>
  );
};

export default function PaymentHistory() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [payments, setPayments] = useState([]);
  const [summary, setSummary] = useState(null);
  const [showExpired, setShowExpired] = useState(false);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        console.log('[PaymentHistory] Fetching payments...');
        setLoading(true);
        setError('');

        // Fetch current student's payments using JWT
        const paymentResponse = await apiService.request('/payments/my-payments');
        const paymentData = paymentResponse.data;
        
        if (paymentData?.payments) {
          setPayments(paymentData.payments);
          setSummary(paymentData.summary);
          console.log('[PaymentHistory] Payments fetched:', paymentData.payments.length);
        } else {
          console.log('[PaymentHistory] No payments data returned');
        }
      } catch (err) {
        console.error('[PaymentHistory] Error fetching payments:', err);
        setError('Failed to load payment history.');
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  // Group payments by semester
  const paymentsBySemester = {};
  payments.forEach(payment => {
    const semKey = payment.semester ? `${payment.semester.academic_year} ${payment.semester.semester}` : 'Unknown';
    if (!paymentsBySemester[semKey]) {
      paymentsBySemester[semKey] = [];
    }
    paymentsBySemester[semKey].push(payment);
  });

  // Filter based on showExpired
  const displayedSemesters = Object.entries(paymentsBySemester).filter(([_, payments]) => {
    if (showExpired) return true;
    return payments.some(p => p.payment_status !== 'expired' && p.payment_status !== 'cancelled');
  });

  if (loading) {
    return (
      <div className={styles.paymentContainer}>
        <div style={{padding: '40px', textAlign: 'center'}}>Loading payment history...</div>
      </div>
    );
  }

  return (
    <div className={styles.paymentContainer}>
      <div className={styles.headerSection}>
        <div className={styles.titleArea}>
          <h1>Payment History</h1>
          <div className={styles.subtitle}>Review and track all your academic financial transactions.</div>
        </div>
        <button className={styles.showExpiredBtn} onClick={() => setShowExpired(!showExpired)}>
          <CalendarIcon /> {showExpired ? 'Hide Expired' : 'Show Expired'}
        </button>
      </div>

      {error && <div style={{color: '#dc2626', marginBottom: '20px'}}>{error}</div>}

      {/* Summary Cards */}
      {summary && (
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '30px'}}>
          <div style={{padding: '15px', backgroundColor: '#eff6ff', borderRadius: '8px', borderLeft: '4px solid #3b82f6'}}>
            <div style={{fontSize: '12px', color: '#64748b', marginBottom: '5px'}}>Total Due</div>
            <div style={{fontSize: '20px', fontWeight: '600', color: '#1e3a8a'}}>৳ {summary.total_due?.toLocaleString()}</div>
          </div>
          <div style={{padding: '15px', backgroundColor: '#f0fdf4', borderRadius: '8px', borderLeft: '4px solid #10b981'}}>
            <div style={{fontSize: '12px', color: '#64748b', marginBottom: '5px'}}>Total Paid</div>
            <div style={{fontSize: '20px', fontWeight: '600', color: '#047857'}}>৳ {summary.total_paid?.toLocaleString()}</div>
          </div>
          <div style={{padding: '15px', backgroundColor: '#fef3c7', borderRadius: '8px', borderLeft: '4px solid #f59e0b'}}>
            <div style={{fontSize: '12px', color: '#64748b', marginBottom: '5px'}}>Outstanding</div>
            <div style={{fontSize: '20px', fontWeight: '600', color: '#d97706'}}>৳ {summary.total_outstanding?.toLocaleString()}</div>
          </div>
        </div>
      )}

      {/* Payment Semesters */}
      {displayedSemesters.length > 0 ? (
        displayedSemesters.map(([semester, semesterPayments]) => (
          <SemesterCard
            key={semester}
            semester={semester}
            transactions={semesterPayments.map((p, idx) => ({
              sn: String(idx + 1).padStart(2, '0'),
              dueDate: p.due_date ? new Date(p.due_date).toLocaleDateString() : 'N/A',
              payDate: p.paid_date ? new Date(p.paid_date).toLocaleDateString() : 'N/A',
              feeGroup: p.fee_group || 'Fees',
              amount: Number(p.amount || p.amount_due)?.toLocaleString(),
              method: p.payment_method ? p.payment_method.charAt(0).toUpperCase() + p.payment_method.slice(1) : (p.transaction_id ? 'Online' : 'Pending'),
              transId: p.transaction_id || 'N/A',
              status: p.payment_status?.charAt(0).toUpperCase() + p.payment_status?.slice(1) || 'Pending',
            }))}
            totalVerified={semesterPayments.filter(p => p.payment_status === 'paid').reduce((sum, p) => sum + (Number(p.amount) || 0), 0).toLocaleString()}
            footerNote="Transactions are verified by University Accounts Office"
          />
        ))
      ) : (
        <div style={{padding: '40px', textAlign: 'center', color: '#94a3b8'}}>
          No payment records found.
        </div>
      )}
    </div>
  );
}
