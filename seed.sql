-- Seed data for Donors
INSERT INTO Donors (Name, BloodType, Contact, DateOfBirth, Address)
VALUES 
('John Doe', 'A+', '1234567890', '1990-05-15', '123 Main St'),
('Jane Smith', 'B-', '0987654321', '1985-03-22', '456 Elm St'),
('Alice Johnson', 'O+', '5551234567', '1992-07-10', '789 Oak Ave');

-- Seed data for Hospitals
INSERT INTO Hospitals (Name, Location, Contact)
VALUES
('City Hospital', 'Downtown', '1112223333'),
('Green Valley Medical Center', 'Uptown', '4445556666');

-- Seed data for BloodInventory
INSERT INTO BloodInventory (HospitalID, BloodType, Quantity, ExpiryDate)
VALUES
(1, 'A+', 5, '2025-08-01'),
(1, 'B-', 3, '2025-07-20'),
(2, 'O+', 7, '2025-06-15');

-- Seed data for BloodRequests
INSERT INTO BloodRequests (HospitalID, BloodType, Urgency, Status, RequestDate)
VALUES
(1, 'A+', 'Urgent', 'Pending', '2025-05-01'),
(2, 'O+', 'Medium', 'Fulfilled', '2025-04-20');

-- Seed data for Donations
INSERT INTO Donations (DonorID, BloodType, Quantity, Date)
VALUES
(1, 'A+', 1, '2025-04-01'),
(2, 'B-', 1, '2025-04-15'),
(3, 'O+', 1, '2025-04-30');

-- Seed data for Transfusions
INSERT INTO Transfusions (HospitalID, PatientID, BloodType, Date)
VALUES
(1, 101, 'A+', '2025-04-05'),
(2, 102, 'O+', '2025-04-25');

-- Seed data for Appointments
INSERT INTO Appointments (DonorID, Date, Status)
VALUES
(1, '2025-05-10', 'Scheduled'),
(2, '2025-05-12', 'Completed'),
(3, '2025-05-15', 'Cancelled');

-- Seed data for Reports
INSERT INTO Reports (HospitalID, BloodType, ShortageLevel, Date)
VALUES
(1, 'A+', 'Critical', '2025-05-01'),
(2, 'O+', 'Low', '2025-05-02');
