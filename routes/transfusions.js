const express = require('express');
const router = express.Router();

module.exports = (db) => {
  // Get all transfusions
  router.get('/', (req, res) => {
    db.query('SELECT * FROM Transfusions', (err, results) => {
      if (err) return res.status(500).json({ error: 'Database error', details: err });
      res.json(results);
    });
  });

  // Add a new transfusion
  router.post('/', (req, res) => {
    const { HospitalID, PatientID, BloodType, Date } = req.body;

    if (!HospitalID || !PatientID || !BloodType || !Date) {
      return res.status(400).json({ error: 'Missing required fields: HospitalID, PatientID, BloodType, Date' });
    }

    const sql = 'INSERT INTO Transfusions (HospitalID, PatientID, BloodType, Date) VALUES (?, ?, ?, ?)';
    db.query(sql, [HospitalID, PatientID, BloodType, Date], (err, result) => {
      if (err) return res.status(500).json({ error: 'Failed to add transfusion', details: err });
      res.json({ message: 'Transfusion added successfully', transfusionID: result.insertId });
    });
  });

  // Update a transfusion's details
  router.put('/:id', (req, res) => {
    const { HospitalID, PatientID, BloodType, Date } = req.body;
    const fields = [];
    const values = [];

    if (HospitalID) {
      fields.push('HospitalID = ?');
      values.push(HospitalID);
    }

    if (PatientID) {
      fields.push('PatientID = ?');
      values.push(PatientID);
    }

    if (BloodType) {
      fields.push('BloodType = ?');
      values.push(BloodType);
    }

    if (Date) {
      fields.push('Date = ?');
      values.push(Date);
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields provided to update' });
    }

    const sql = `UPDATE Transfusions SET ${fields.join(', ')} WHERE TransfusionID = ?`;
    values.push(req.params.id);

    db.query(sql, values, (err, result) => {
      if (err) return res.status(500).json({ error: 'Failed to update transfusion', details: err });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Transfusion not found' });
      res.json({ message: 'Transfusion updated successfully' });
    });
  });

  // Delete a transfusion
  router.delete('/:id', (req, res) => {
    db.query('DELETE FROM Transfusions WHERE TransfusionID = ?', [req.params.id], (err, result) => {
      if (err) return res.status(500).json({ error: 'Failed to delete transfusion', details: err });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Transfusion not found' });
      res.json({ message: 'Transfusion deleted successfully' });
    });
  });

  return router;
};
