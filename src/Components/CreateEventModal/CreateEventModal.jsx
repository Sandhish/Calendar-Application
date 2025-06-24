import { useState } from "react"
import styles from "./CreateEventModal.module.css"

const CreateEventModal = ({ date, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    startTime: "09:00",
    endTime: "10:00",
    color: "#4ECDC4",
    description: "",
    location: "",
  })

  const [errors, setErrors] = useState({})

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
      date: date.toISOString().split("T")[0],
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

  const formatDate = (date) => {
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
          <h3 className={styles.title}>Create Event</h3>
          <button className={styles.closeButton} onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.dateInfo}>
            <strong>{formatDate(date)}</strong>
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
                <button key={color.value} type="button" className={`${styles.colorOption} ${formData.color === color.value ? styles.colorSelected : ""}`}
                  style={{ backgroundColor: color.value }}  onClick={() => setFormData((prev) => ({ ...prev, color: color.value }))}
                  title={color.name}
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
            <input type="text" id="location" name="location" value={formData.location} onChange={handleInputChange}
              className={styles.input} placeholder="Enter event location (optional)"
            />
          </div>

          <div className={styles.buttonGroup}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              Cancel
            </button>
            <button type="submit" className={styles.saveButton}>
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateEventModal
