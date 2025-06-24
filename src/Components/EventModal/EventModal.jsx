import { useEffect } from "react"
import styles from "./EventModal.module.css"

const EventModal = ({ date, events, onClose, onEditEvent }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [onClose])

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (time) => {
    const [hours, minutes] = time.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
    }
    return `${mins}m`
  }

  const getEventColors = () => {
    const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8"]
    return colors
  }

  const colors = getEventColors()

  const handleEditClick = (event, e) => {
    e.stopPropagation()
    onEditEvent(event)
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3 className={styles.title}>Events for {formatDate(date)}</h3>
          <button className={styles.closeButton} onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className={styles.eventsList}>
          {events.length === 0 ? (
            <p className={styles.noEvents}>No events scheduled for this day.</p>
          ) : (
            events.map((event, index) => (
              <div
                key={event.id || index}
                className={styles.eventItem}
                style={{ borderLeftColor: event.color || colors[index % colors.length] }}
                onClick={(e) => handleEditClick(event, e)}
              >
                <div className={styles.eventHeader}>
                  <h4 className={styles.eventTitle}>{event.title}</h4>
                  <div className={styles.eventTime}>
                    {event.startTime
                      ? `${formatTime(event.startTime)} - ${formatTime(event.endTime)}`
                      : `${formatTime(event.time)} • ${formatDuration(event.duration)}`}
                  </div>
                </div>
                {event.description && <p className={styles.eventDescription}>{event.description}</p>}
                {event.location && (
                  <div className={styles.eventLocation}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    {event.location}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default EventModal
