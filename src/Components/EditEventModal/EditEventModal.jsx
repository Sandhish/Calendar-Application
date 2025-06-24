import { useState } from "react"
import styles from "./EditEventModal.module.css"

const EditEventModal = ({ event, onSave, onDelete, onClose }) => {
  const [formData, setFormData] = useState({
    title: event.title || "",
    startTime: event.startTime || event.time || "09:00",
    endTime: event.endTime || calculateEndTime(event.time, event.duration) || "10:00",
    color: event.color || "#4ECDC4",
    description: event.description || "",
    location: event.location || "",
  })

  const [errors, setErrors] = useState({})
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  function calculateEndTime(startTime, duration) {
    if (!startTime || !duration) return "10:00"

    const [hours, minutes] = startTime.split(":").map(Number)
    const startTotalMinutes = hours * 60 + minutes
    const endTotalMinutes = startTotalMinutes + duration

    const endHours = Math.floor(endTotalMinutes / 60) % 24
    const endMinutes = endTotalMinutes % 60

    return `${endHours.toString().padStart(2, "0")}:${endMinutes.toString().padStart(2, "0")}`
  }

  const eventColors = [
    { name: "Teal", value: "#4ECDC4" },
    { name: "Blue", value: "#45B7D1" },
    { name: "Red", value: "#FF6B6B" },
    { name: "Green", value: "#96CEB4" },
    { name: "Yellow", value: "#FFEAA7" },
    { name: "Purple", value: "#DDA0DD" },
    { name: "Mint", value: "#98D8C8" },
    { name: "Orange", value: "#FFB347" },
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }

    if (formData.startTime >= formData.endTime) {
      newErrors.time = "End time must be after start time"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const eventData = {
      ...formData,
      date: event.date,
      duration: calculateDuration(formData.startTime, formData.endTime),
    }

    onSave(eventData)
  }

  const calculateDuration = (startTime, endTime) => {
    const [startHours, startMinutes] = startTime.split(":").map(Number)
    const [endHours, endMinutes] = endTime.split(":").map(Number)

    const startTotalMinutes = startHours * 60 + startMinutes
    const endTotalMinutes = endHours * 60 + endMinutes

    return endTotalMinutes - startTotalMinutes
  }

  const handleDelete = () => {
    onDelete(event.id)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3 className={styles.title}>Edit Event</h3>
          <button className={styles.closeButton} onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.dateInfo}>
            <strong>{formatDate(event.date)}</strong>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="title" className={styles.label}>
              Event Title *
            </label>
            <input type="text" id="title" name="title" value={formData.title} onChange={handleInputChange}
              className={`${styles.input} ${errors.title ? styles.inputError : ""}`}
              placeholder="Enter event title"
            />
            {errors.title && <span className={styles.error}>{errors.title}</span>}
          </div>

          <div className={styles.timeGroup}>
            <div className={styles.formGroup}>
              <label htmlFor="startTime" className={styles.label}>
                Start Time *
              </label>
              <input type="time" id="startTime" name="startTime" value={formData.startTime}
                onChange={handleInputChange} className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="endTime" className={styles.label}>
                End Time *
              </label>
              <input type="time" id="endTime" name="endTime" value={formData.endTime}
                onChange={handleInputChange} className={styles.input}
              />
            </div>
          </div>
          {errors.time && <span className={styles.error}>{errors.time}</span>}

          <div className={styles.formGroup}>
            <label className={styles.label}>Event Color</label>
            <div className={styles.colorPicker}>
              {eventColors.map((color) => (
                <button key={color.value} type="button"
                  className={`${styles.colorOption} ${formData.color === color.value ? styles.colorSelected : ""}`}
                  style={{ backgroundColor: color.value }}
                  onClick={() => setFormData((prev) => ({ ...prev, color: color.value }))} title={color.name}
                />
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description" className={styles.label}>
              Description
            </label>
            <textarea id="description" name="description" value={formData.description} onChange={handleInputChange}
              className={styles.textarea} placeholder="Enter event description (optional)" rows="3"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="location" className={styles.label}>
              Location
            </label>
            <input type="text" id="location" name="location" value={formData.location}
              onChange={handleInputChange} className={styles.input} placeholder="Enter event location (optional)"
            />
          </div>

          <div className={styles.buttonGroup}>
            <button type="button" onClick={() => setShowDeleteConfirm(true)} className={styles.deleteButton}>
              Delete Event
            </button>
            <div className={styles.rightButtons}>
              <button type="button" onClick={onClose} className={styles.cancelButton}>
                Cancel
              </button>
              <button type="submit" className={styles.saveButton}>
                Save Changes
              </button>
            </div>
          </div>
        </form>

        {showDeleteConfirm && (
          <div className={styles.deleteConfirm}>
            <div className={styles.deleteConfirmContent}>
              <h4>Delete Event?</h4>
              <p>Are you sure you want to delete "{event.title}"? This action cannot be undone.</p>
              <div className={styles.deleteConfirmButtons}>
                <button onClick={() => setShowDeleteConfirm(false)} className={styles.cancelButton}>
                  Cancel
                </button>
                <button onClick={handleDelete} className={styles.confirmDeleteButton}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default EditEventModal
