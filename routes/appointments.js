const express = require('express');
const router = express.Router();

module.exports = (db) => {
  // Get all appointments
  router.get('/', (req, res) => {
    db.query('SELECT * FROM Appointments', (err, results) => {
      if (err) return res.status(500).json({ error: 'Database error', details: err });
      res.json(results);
    });
  });

  // Add a new appointment
  router.post('/', (req, res) => {
    const { DonorID, Date, Status } = req.body;
    const validStatuses = ['Scheduled', 'Cancelled', 'Completed'];
    if (!DonorID || !Date || !Status || !validStatuses.includes(Status)) {
      return res.status(400).json({ error: 'Missing or invalid fields: DonorID, Date, Status (Scheduled|Cancelled|Completed)' });
    }

    const sql = 'INSERT INTO Appointments (DonorID, Date, Status) VALUES (?, ?, ?)';
    db.query(sql, [DonorID, Date, Status], (err, result) => {
      if (err) return res.status(500).json({ error: 'Failed to schedule appointment', details: err });
      res.json({ message: 'Appointment scheduled successfully', appointmentID: result.insertId });
    });
  });

  // Update appointment fields
  router.put('/:id', (req, res) => {
    const { DonorID, Date, Status } = req.body;
    const fields = [];
    const values = [];

    if (DonorID) {
      fields.push('DonorID = ?');
      values.push(DonorID);
    }

    if (Date) {
      fields.push('Date = ?');
      values.push(Date);
    }

    if (Status) {
      const validStatuses = ['Scheduled', 'Cancelled', 'Completed'];
      if (!validStatuses.includes(Status)) {
        return res.status(400).json({ error: 'Invalid status value' });
      }
      fields.push('Status = ?');
      values.push(Status);
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields provided to update' });
    }

    const sql = `UPDATE Appointments SET ${fields.join(', ')} WHERE AppointmentID = ?`;
    values.push(req.params.id);

    db.query(sql, values, (err, result) => {
      if (err) return res.status(500).json({ error: 'Failed to update appointment', details: err });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Appointment not found' });
      res.json({ message: 'Appointment updated successfully' });
    });
  });

  // Delete an appointment
  router.delete('/:id', (req, res) => {
    db.query('DELETE FROM Appointments WHERE AppointmentID = ?', [req.params.id], (err, result) => {
      if (err) return res.status(500).json({ error: 'Failed to delete appointment', details: err });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Appointment not found' });
      res.json({ message: 'Appointment deleted successfully' });
    });
  });

  return router;
};
