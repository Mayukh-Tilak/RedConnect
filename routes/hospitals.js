const express = require('express');
const router = express.Router();

module.exports = (db) => {
  // Get all hospitals
  router.get('/', (req, res) => {
    db.query('SELECT * FROM Hospitals', (err, results) => {
      if (err) return res.status(500).json({ error: 'Database error', details: err });
      res.json(results);
    });
  });

  // Add new hospital
  router.post('/', (req, res) => {
    const { Name, Location, Contact } = req.body;
    if (!Name || !Location || !Contact) {
      return res.status(400).json({ error: 'Missing required fields: Name, Location, Contact' });
    }

    const sql = 'INSERT INTO Hospitals (Name, Location, Contact) VALUES (?, ?, ?)';
    db.query(sql, [Name, Location, Contact], (err, result) => {
      if (err) return res.status(500).json({ error: 'Failed to add hospital', details: err });
      res.json({ message: 'Hospital added successfully', hospitalID: result.insertId });
    });
  });

  // Update hospital
  router.put('/:id', (req, res) => {
    const { Name, Location, Contact } = req.body;
    if (!Name || !Location || !Contact) {
      return res.status(400).json({ error: 'Missing required fields: Name, Location, Contact' });
    }

    const sql = 'UPDATE Hospitals SET Name = ?, Location = ?, Contact = ? WHERE HospitalID = ?';
    db.query(sql, [Name, Location, Contact, req.params.id], (err, result) => {
      if (err) return res.status(500).json({ error: 'Failed to update hospital', details: err });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Hospital not found' });
      res.json({ message: 'Hospital updated successfully' });
    });
  });

  // Delete hospital
  router.delete('/:id', (req, res) => {
    db.query('DELETE FROM Hospitals WHERE HospitalID = ?', [req.params.id], (err, result) => {
      if (err) return res.status(500).json({ error: 'Failed to delete hospital', details: err });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Hospital not found' });
      res.json({ message: 'Hospital deleted successfully' });
    });
  });

  return router;
};
