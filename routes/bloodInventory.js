const express = require('express');
const router = express.Router();

module.exports = (db) => {
  // Get all blood inventory
  router.get('/', (req, res) => {
    db.query('SELECT * FROM BloodInventory', (err, results) => {
      if (err) return res.status(500).json({ error: 'Database error', details: err });
      res.json(results);
    });
  });

  // Get a specific blood inventory by ID
  router.get('/:id', (req, res) => {
    const inventoryId = req.params.id;
    db.query('SELECT * FROM BloodInventory WHERE InventoryID = ?', [inventoryId], (err, results) => {
      if (err) return res.status(500).json({ error: 'Database error', details: err });
      if (results.length === 0) return res.status(404).json({ message: 'Inventory item not found' });
      res.json(results[0]);  // Send the first (and only) result
    });
  });

  // Add new inventory record
  router.post('/', (req, res) => {
    const { HospitalID, BloodType, Quantity, ExpiryDate } = req.body;
    if (!HospitalID || !BloodType || !Quantity || !ExpiryDate) {
      return res.status(400).json({ error: 'Missing required fields: HospitalID, BloodType, Quantity, ExpiryDate' });
    }

    const sql = `
      INSERT INTO BloodInventory (HospitalID, BloodType, Quantity, ExpiryDate)
      VALUES (?, ?, ?, ?)
    `;
    db.query(sql, [HospitalID, BloodType, Quantity, ExpiryDate], (err, result) => {
      if (err) return res.status(500).json({ error: 'Failed to add inventory', details: err });
      res.json({ message: 'Inventory added successfully', inventoryID: result.insertId });
    });
  });

  // Update existing inventory
  router.put('/:id', (req, res) => {
    const { HospitalID, BloodType, Quantity, ExpiryDate } = req.body;
    if (!HospitalID || !BloodType || !Quantity || !ExpiryDate) {
      return res.status(400).json({ error: 'Missing required fields: HospitalID, BloodType, Quantity, ExpiryDate' });
    }

    const sql = `
      UPDATE BloodInventory
      SET HospitalID = ?, BloodType = ?, Quantity = ?, ExpiryDate = ?
      WHERE InventoryID = ?
    `;
    db.query(sql, [HospitalID, BloodType, Quantity, ExpiryDate, req.params.id], (err, result) => {
      if (err) return res.status(500).json({ error: 'Failed to update inventory', details: err });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Inventory item not found' });
      res.json({ message: 'Inventory updated successfully' });
    });
  });

  // Delete inventory
  router.delete('/:id', (req, res) => {
    db.query('DELETE FROM BloodInventory WHERE InventoryID = ?', [req.params.id], (err, result) => {
      if (err) return res.status(500).json({ error: 'Failed to delete inventory', details: err });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Inventory item not found' });
      res.json({ message: 'Inventory deleted successfully' });
    });
  });

  return router;
};
