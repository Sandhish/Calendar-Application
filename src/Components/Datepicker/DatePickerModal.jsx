import { useState } from "react"
import styles from "./DatePickerModal.module.css"

const DatePickerModal = ({ currentDate, onDateChange, onClose }) => {
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth())

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i)

  const handleApply = () => {
    const newDate = new Date(selectedYear, selectedMonth, 1)
    const currentMonth = currentDate.getMonth()
    const currentYear = currentDate.getFullYear()

    const monthDiff = (selectedYear - currentYear) * 12 + (selectedMonth - currentMonth)
    onDateChange(monthDiff)
    onClose()
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3 className={styles.title}>Select Month & Year</h3>
          <button className={styles.closeButton} onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Month</h4>
            <div className={styles.monthGrid}>
              {monthNames.map((month, index) => (
                <button
                  key={month}
                  className={`${styles.monthButton} ${selectedMonth === index ? styles.selected : ""}`}
                  onClick={() => setSelectedMonth(index)}
                >
                  {month.substring(0, 3)}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Year</h4>
            <div className={styles.yearGrid}>
              {years.map((year) => (
                <button
                  key={year}
                  className={`${styles.yearButton} ${selectedYear === year ? styles.selected : ""}`}
                  onClick={() => setSelectedYear(year)}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.applyButton} onClick={handleApply}>
            Apply
          </button>
        </div>
      </div>
    </div>
  )
}

export default DatePickerModal
