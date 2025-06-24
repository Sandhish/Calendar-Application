import styles from "./CalendarDay.module.css"

const CalendarDay = ({ dayInfo, onClick, onCreateEvent }) => {
  const { date, isCurrentMonth, isToday, events } = dayInfo
  const dayNumber = date.getDate()

  const handleCreateClick = (e) => {
    e.stopPropagation()
    onCreateEvent()
  }

  const getEventColors = () => {
    const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8"]
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

  return (
    <div className={`${styles.day} ${!isCurrentMonth ? styles.otherMonth : ""} ${isToday ? styles.today : ""}`}
      onClick={onClick}
    >
      <div className={styles.dayHeader}>
        <div className={styles.dayNumber}>
          {dayNumber}
          {hasConflicts() && <div className={styles.conflictIndicator}>!</div>}
        </div>
        {isCurrentMonth && (
          <button className={styles.addButton} onClick={handleCreateClick} title="Add event">
            +
          </button>
        )}
      </div>

      <div className={styles.events}>
        {events.slice(0, 3).map((event, index) => (
          <div key={index} className={styles.event}
            style={{ backgroundColor: event.color || colors[index % colors.length] }}
            title={`${event.title} - ${event.startTime} to ${event.endTime}`}
          >
            <span className={styles.eventTitle}>{event.title}</span>
            <span className={styles.eventTime}>{event.startTime}</span>
          </div>
        ))}
        {events.length > 3 && <div className={styles.moreEvents}>+{events.length - 3} more</div>}
      </div>
    </div>
  )
}

export default CalendarDay
