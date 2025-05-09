const express = require('express');
const router = express.Router();

module.exports = (db) => {
  // Get all blood requests
  router.get('/', (req, res) => {
    db.query('SELECT * FROM BloodRequests', (err, results) => {
      if (err) return res.status(500).json({ error: 'Database error', details: err });
      res.json(results);
    });
  });

  // Get a specific blood request by ID
  router.get('/:id', (req, res) => {
    const requestId = req.params.id;
    db.query('SELECT * FROM BloodRequests WHERE RequestID = ?', [requestId], (err, results) => {
      if (err) return res.status(500).json({ error: 'Database error', details: err });
      if (results.length === 0) return res.status(404).json({ message: 'Blood request not found' });
      res.json(results[0]);  // Send the first (and only) result
    });
  });

  // Add a new blood request
  router.post('/', (req, res) => {
    const { HospitalID, BloodType, Urgency } = req.body;
    const validUrgencies = ['Urgent', 'Medium', 'Low'];
    if (!HospitalID || !BloodType || !Urgency || !validUrgencies.includes(Urgency)) {
      return res.status(400).json({ error: 'Missing or invalid fields: HospitalID, BloodType, Urgency (Urgent|Medium|Low)' });
    }

    const sql = `
      INSERT INTO BloodRequests (HospitalID, BloodType, Urgency, Status, RequestDate)
      VALUES (?, ?, ?, 'Pending', NOW())
    `;
    db.query(sql, [HospitalID, BloodType, Urgency], (err, result) => {
      if (err) return res.status(500).json({ error: 'Failed to add blood request', details: err });
      res.json({ message: 'Blood request added successfully', requestID: result.insertId });
    });
  });

  // Update request fields (status, urgency, blood type, etc.)
  router.put('/:id', (req, res) => {
    const { Status, BloodType, Urgency } = req.body;
    const fields = [];
    const values = [];

    if (Status) {
      if (!['Pending', 'Fulfilled', 'Cancelled'].includes(Status)) {
        return res.status(400).json({ error: 'Invalid status value' });
      }
      fields.push('Status = ?');
      values.push(Status);
    }

    if (BloodType) {
      fields.push('BloodType = ?');
      values.push(BloodType);
    }

    if (Urgency) {
      if (!['Urgent', 'Medium', 'Low'].includes(Urgency)) {
        return res.status(400).json({ error: 'Invalid urgency value' });
      }
      fields.push('Urgency = ?');
      values.push(Urgency);
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields provided to update' });
    }

    const sql = `UPDATE BloodRequests SET ${fields.join(', ')} WHERE RequestID = ?`;
    values.push(req.params.id);

    db.query(sql, values, (err, result) => {
      if (err) return res.status(500).json({ error: 'Failed to update blood request', details: err });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Request not found' });
      res.json({ message: 'Blood request updated successfully' });
    });
  });

  // Delete a blood request
  router.delete('/:id', (req, res) => {
    db.query('DELETE FROM BloodRequests WHERE RequestID = ?', [req.params.id], (err, result) => {
      if (err) return res.status(500).json({ error: 'Failed to delete request', details: err });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Request not found' });
      res.json({ message: 'Blood request deleted successfully' });
    });
  });

  return router;
};
