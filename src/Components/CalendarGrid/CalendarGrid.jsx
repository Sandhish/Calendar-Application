import styles from "./CalendarGrid.module.css"
import CalendarDay from "../CalendarDay/CalendarDay"

const CalendarGrid = ({ currentDate, today, events, onDateClick, getEventsForDate }) => {
  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    for (let i = 0; i < startingDayOfWeek; i++) {
      const prevMonthDate = new Date(year, month, -startingDayOfWeek + i + 1)
      days.push({
        date: prevMonthDate,
        isCurrentMonth: false,
        isToday: false,
        events: getEventsForDate(prevMonthDate),
      })
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const isToday = date.toDateString() === today.toDateString()
      days.push({
        date,
        isCurrentMonth: true,
        isToday,
        events: getEventsForDate(date),
      })
    }

    const remainingCells = 42 - days.length
    for (let day = 1; day <= remainingCells; day++) {
      const nextMonthDate = new Date(year, month + 1, day)
      days.push({
        date: nextMonthDate,
        isCurrentMonth: false,
        isToday: false,
        events: getEventsForDate(nextMonthDate),
      })
    }

    return days
  }

  const days = getDaysInMonth(currentDate)

  return (
    <div className={styles.grid}>
      {days.map((dayInfo, index) => (
        <CalendarDay key={index} dayInfo={dayInfo} onClick={() => onDateClick(dayInfo.date)} />
      ))}
    </div>
  )
}

export default CalendarGrid