const express = require('express');
const router = express.Router();

module.exports = (db) => {
  // Get all donors
  router.get('/', (req, res) => {
    db.query('SELECT * FROM Donors', (err, results) => {
      if (err) return res.status(500).json({ error: 'Database error', details: err });
      res.json(results);
    });
  });

  // Add a new donor
  router.post('/', (req, res) => {
    const { Name, BloodType, Contact, DateOfBirth, Address, LastDonationDate } = req.body;
    if (!Name || !BloodType || !Contact || !DateOfBirth) {
      return res.status(400).json({ error: 'Missing required donor fields' });
    }

    const sql = `
      INSERT INTO Donors (Name, BloodType, Contact, DateOfBirth, Address, LastDonationDate)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(sql, [Name, BloodType, Contact, DateOfBirth, Address || '', LastDonationDate || null], (err, result) => {
      if (err) return res.status(500).json({ error: 'Failed to add donor', details: err });
      res.json({ message: 'Donor added successfully', donorID: result.insertId });
    });
  });

  // Update a donor
  router.put('/:id', (req, res) => {
    const { Name, BloodType, Contact, DateOfBirth, Address, LastDonationDate } = req.body;
    if (!Name || !BloodType || !Contact || !DateOfBirth) {
      return res.status(400).json({ error: 'Missing required donor fields' });
    }

    const sql = `
      UPDATE Donors
      SET Name = ?, BloodType = ?, Contact = ?, DateOfBirth = ?, Address = ?, LastDonationDate = ?
      WHERE DonorID = ?
    `;
    db.query(sql, [Name, BloodType, Contact, DateOfBirth, Address || '', LastDonationDate || null, req.params.id], (err, result) => {
      if (err) return res.status(500).json({ error: 'Failed to update donor', details: err });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Donor not found' });
      res.json({ message: 'Donor updated successfully' });
    });
  });

  // Delete a donor
  router.delete('/:id', (req, res) => {
    db.query('DELETE FROM Donors WHERE DonorID = ?', [req.params.id], (err, result) => {
      if (err) return res.status(500).json({ error: 'Failed to delete donor', details: err });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Donor not found' });
      res.json({ message: 'Donor deleted successfully' });
    });
  });

  return router;
};
