import { useState, useEffect } from "react"
import CalendarGrid from "../CalendarGrid/CalendarGrid"
import CalendarHeader from "../CalendarHeader/CalendarHeader"
import EventModal from "../EventModal/EventModal"
import styles from "./Calendar.module.css"
import { eventsData } from "../../Data/events"

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [events, setEvents] = useState([])
  const [showEventModal, setShowEventModal] = useState(false)

  const today = new Date()

  useEffect(() => {
    setEvents(eventsData)
  }, [])

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate)
    newDate.setMonth(currentDate.getMonth() + direction)
    setCurrentDate(newDate)
  }

  const handleDateClick = (date) => {
    const dayEvents = getEventsForDate(date)
    if (dayEvents.length > 0) {
      setSelectedDate(date)
      setShowEventModal(true)
    }
  }

  const getEventsForDate = (date) => {
    const dateString = date.toISOString().split("T")[0]
    return events.filter((event) => event.date === dateString)
  }

  const closeModal = () => {
    setShowEventModal(false)
    setSelectedDate(null)
  }

  return (
    <div className={styles.calendarContainer}>
      <div className={styles.calendar}>
        <CalendarHeader currentDate={currentDate} onNavigate={navigateMonth} />
        <CalendarGrid currentDate={currentDate} today={today} events={events}
          onDateClick={handleDateClick} getEventsForDate={getEventsForDate}
        />
      </div>

      {showEventModal && selectedDate && (
        <EventModal date={selectedDate} events={getEventsForDate(selectedDate)} onClose={closeModal} />
      )}
    </div>
  )
}

export default Calendar