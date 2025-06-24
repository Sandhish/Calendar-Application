import styles from "./CalendarDay.module.css"

const CalendarDay = ({ dayInfo, onClick }) => {
  const { date, isCurrentMonth, isToday, events } = dayInfo
  const dayNumber = date.getDate()

  const getEventColors = () => {
    const colors = ["#4ECDC4", "#45B7D1", "#DDA0DD", "#98D8C8", "#FFB347", "#96CEB4", "#FFEAA7"]
    return colors
  }

  const hasConflicts = () => {
    if (events.length <= 1) return false

    for (let i = 0; i < events.length; i++) {
      for (let j = i + 1; j < events.length; j++) {
        const event1 = events[i]
        const event2 = events[j]

        const start1 = new Date(`2000-01-01 ${event1.time}`)
        const end1 = new Date(start1.getTime() + event1.duration * 60000)
        const start2 = new Date(`2000-01-01 ${event2.time}`)
        const end2 = new Date(start2.getTime() + event2.duration * 60000)

        if (start1 < end2 && start2 < end1) {
          return true
        }
      }
    }
    return false
  }

  const colors = getEventColors()

  const formatTime = (time) => {
    const [hours, minutes] = time.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes.padStart(2, "0")} ${ampm}`
  }

  const calculateEndTime = (startTime, duration) => {
    const [hours, minutes] = startTime.split(":").map(Number)
    const startTotalMinutes = hours * 60 + minutes
    const endTotalMinutes = startTotalMinutes + duration

    const endHours = Math.floor(endTotalMinutes / 60) % 24
    const endMinutes = endTotalMinutes % 60

    const endTime = `${endHours.toString().padStart(2, "0")}:${endMinutes.toString().padStart(2, "0")}`
    return formatTime(endTime)
  }

  return (
    <div
      className={`${styles.day} ${!isCurrentMonth ? styles.otherMonth : ""} ${isToday ? styles.today : ""} ${events.length > 0 ? styles.hasEvents : ""
        }`}
      onClick={onClick}
    >
      <div className={styles.dayHeader}>
        <div className={styles.dayNumber}>
          {dayNumber}
          {hasConflicts() && <div className={styles.conflictIndicator} on title="conflict">!</div>}
        </div>
      </div>

      <div className={styles.events}>
        {events.slice(0, 3).map((event, index) => (
          <div key={event.id} className={styles.event}
            style={{ backgroundColor: colors[index % colors.length] }}
            title={`${event.title} - ${formatTime(event.time)} to ${calculateEndTime(event.time, event.duration)}`}
          >
            <span className={styles.eventTitle}>{event.title}</span>
            <span className={styles.eventTime}>{formatTime(event.time)}</span>
          </div>
        ))}
        {events.length > 3 && <div className={styles.moreEvents}>+{events.length - 3} more</div>}
      </div>
    </div>
  )
}

export default CalendarDay