const express = require('express');
const router = express.Router();

module.exports = (db) => {
  // Get all reports
  router.get('/', (req, res) => {
    db.query('SELECT * FROM Reports', (err, results) => {
      if (err) return res.status(500).json({ error: 'Database error', details: err });
      res.json(results);
    });
  });

  // Add a new report
  router.post('/', (req, res) => {
    const { HospitalID, BloodType, ShortageLevel, Date } = req.body;

    if (!HospitalID || !BloodType || !ShortageLevel || !Date) {
      return res.status(400).json({ error: 'Missing required fields: HospitalID, BloodType, ShortageLevel, Date' });
    }

    const validShortageLevels = ['Low', 'Critical', 'Adequate'];
    if (!validShortageLevels.includes(ShortageLevel)) {
      return res.status(400).json({ error: 'Invalid ShortageLevel, valid values are Low, Critical, Adequate' });
    }

    const sql = 'INSERT INTO Reports (HospitalID, BloodType, ShortageLevel, Date) VALUES (?, ?, ?, ?)';
    db.query(sql, [HospitalID, BloodType, ShortageLevel, Date], (err, result) => {
      if (err) return res.status(500).json({ error: 'Failed to add report', details: err });
      res.json({ message: 'Report added successfully', reportID: result.insertId });
    });
  });

  // Update a report
  router.put('/:id', (req, res) => {
    const { HospitalID, BloodType, ShortageLevel, Date } = req.body;
    const fields = [];
    const values = [];

    if (HospitalID) {
      fields.push('HospitalID = ?');
      values.push(HospitalID);
    }

    if (BloodType) {
      fields.push('BloodType = ?');
      values.push(BloodType);
    }

    if (ShortageLevel) {
      const validShortageLevels = ['Low', 'Critical', 'Adequate'];
      if (!validShortageLevels.includes(ShortageLevel)) {
        return res.status(400).json({ error: 'Invalid ShortageLevel, valid values are Low, Critical, Adequate' });
      }
      fields.push('ShortageLevel = ?');
      values.push(ShortageLevel);
    }

    if (Date) {
      fields.push('Date = ?');
      values.push(Date);
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields provided to update' });
    }

    const sql = `UPDATE Reports SET ${fields.join(', ')} WHERE ReportID = ?`;
    values.push(req.params.id);

    db.query(sql, values, (err, result) => {
      if (err) return res.status(500).json({ error: 'Failed to update report', details: err });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Report not found' });
      res.json({ message: 'Report updated successfully' });
    });
  });

  // Delete a report
  router.delete('/:id', (req, res) => {
    db.query('DELETE FROM Reports WHERE ReportID = ?', [req.params.id], (err, result) => {
      if (err) return res.status(500).json({ error: 'Failed to delete report', details: err });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Report not found' });
      res.json({ message: 'Report deleted successfully' });
    });
  });

  return router;
};
