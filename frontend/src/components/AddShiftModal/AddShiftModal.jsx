import { useState } from "react"
import "./AddShiftModal.css"

export default function AddShiftModal({ closeModal, refresh }) {

  const [form, setForm] = useState({
    employee_name: "",
    role: "waiter",
    date: "",
    start_time: "",
    end_time: "",
    break_minutes: 60
  })

  const handleChange = (e) => {

    const { name, value } = e.target

    setForm({
      ...form,
      [name]: value
    })
  }

  const handleSubmit = async (e) => {

    e.preventDefault()

    await fetch("http://127.0.0.1:8000/api/shifts/create/", {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify(form)

    })

    refresh()

    closeModal()
  }

  return (

    <div className="modal-overlay">

      <div className="modal-box">

        <div className="modal-header">

          <h2>Schedule New Shift</h2>

          <button onClick={closeModal}>✕</button>

        </div>

        <form onSubmit={handleSubmit}>

          <label>Employee Name</label>

          <input
            name="employee_name"
            placeholder="Enter employee name"
            onChange={handleChange}
            required
          />

          <label>Role</label>

          <select name="role" onChange={handleChange}>

            <option value="waiter">Waiter</option>

            <option value="chef">Chef</option>

            <option value="manager">Manager</option>

          </select>

          <label>Date</label>

          <input
            type="date"
            name="date"
            onChange={handleChange}
            required
          />

          <div className="time-row">

            <div>

              <label>Start Time</label>

              <input
                type="time"
                name="start_time"
                onChange={handleChange}
                required
              />

            </div>

            <div>

              <label>End Time</label>

              <input
                type="time"
                name="end_time"
                onChange={handleChange}
                required
              />

            </div>

          </div>

          <label>Break Duration (minutes)</label>

          <input
            type="number"
            name="break_minutes"
            value={form.break_minutes}
            onChange={handleChange}
            required
          />

          <button className="schedule-btn">
            Schedule Shift
          </button>

        </form>

      </div>

    </div>

  )
}