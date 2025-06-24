import { useState } from "react"
import CalendarGrid from "../CalendarGrid/CalendarGrid"
import CalendarHeader from "../CalendarHeader/CalendarHeader"
import EventModal from "../EventModal/EventModal"
import CreateEventModal from "../CreateEventModal/CreateEventModal"
import EditEventModal from "../EditEventModal/EditEventModal"
import styles from "./Calendar.module.css"

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [events, setEvents] = useState([])
  const [showEventModal, setShowEventModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)

  const today = new Date()

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate)
    newDate.setMonth(currentDate.getMonth() + direction)
    setCurrentDate(newDate)
  }

  const handleDateClick = (date) => {
    setSelectedDate(date)
    const dayEvents = getEventsForDate(date)
    if (dayEvents.length > 0) {
      setShowEventModal(true)
    } else {
      openCreateModal(date)
    }
  }

  const getEventsForDate = (date) => {
    const dateString = date.toISOString().split("T")[0]
    return events.filter((event) => event.date === dateString)
  }

  const closeAllModals = () => {
    setShowEventModal(false)
    setShowCreateModal(false)
    setShowEditModal(false)
    setSelectedDate(null)
    setEditingEvent(null)
  }

  const handleCreateEvent = (eventData) => {
    const newEvent = {
      id: Date.now(),
      ...eventData,
      date: eventData.date,
    }
    setEvents([...events, newEvent])
    setShowCreateModal(false)
  }

  const handleEditEvent = (eventData) => {
    setEvents(events.map((event) => (event.id === editingEvent.id ? { ...eventData, id: editingEvent.id } : event)))
    setShowEditModal(false)
    setEditingEvent(null)
  }

  const handleDeleteEvent = (eventId) => {
    setEvents(events.filter((event) => event.id !== eventId))
    setShowEditModal(false)
    setEditingEvent(null)
  }

  const openCreateModal = (date) => {
    setSelectedDate(date)
    setShowCreateModal(true)
  }

  const openEditModal = (event) => {
    setEditingEvent(event)
    setShowEditModal(true)
  }

  return (
    <div className={styles.calendarContainer}>
      <div className={styles.calendar}>
        <CalendarHeader currentDate={currentDate} onNavigate={navigateMonth} />
        <CalendarGrid currentDate={currentDate} today={today} events={events}
          onDateClick={handleDateClick} onCreateEvent={openCreateModal} getEventsForDate={getEventsForDate}
        />
      </div>

      {showEventModal && selectedDate && (
        <EventModal date={selectedDate} events={getEventsForDate(selectedDate)}
          onClose={closeAllModals} onEditEvent={openEditModal}
        />
      )}

      {showCreateModal && selectedDate && (
        <CreateEventModal date={selectedDate} onSave={handleCreateEvent} onClose={closeAllModals}
          existingEvents={events}
        />
      )}

      {showEditModal && editingEvent && (
        <EditEventModal event={editingEvent} onSave={handleEditEvent} onDelete={handleDeleteEvent}
          onClose={closeAllModals}
          existingEvents={events}
        />
      )}
    </div>
  )
}

export default Calendar