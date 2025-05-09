-- Donors Table
CREATE TABLE IF NOT EXISTS Donors (
    DonorID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    BloodType VARCHAR(3) NOT NULL CHECK (BloodType IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    Contact VARCHAR(15) NOT NULL,
    DateOfBirth DATE NOT NULL,
    Address VARCHAR(200),
    LastDonationDate DATE
);

-- Hospitals Table
CREATE TABLE IF NOT EXISTS Hospitals (
    HospitalID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(150) NOT NULL,
    Location VARCHAR(200) NOT NULL,
    Contact VARCHAR(15) NOT NULL
);

-- BloodInventory Table
CREATE TABLE IF NOT EXISTS BloodInventory (
    InventoryID INT AUTO_INCREMENT PRIMARY KEY,
    HospitalID INT NOT NULL,
    BloodType VARCHAR(3) NOT NULL CHECK (BloodType IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    Quantity INT NOT NULL,
    ExpiryDate DATE NOT NULL,
    FOREIGN KEY (HospitalID) REFERENCES Hospitals(HospitalID) ON DELETE CASCADE
);

-- BloodRequests Table
CREATE TABLE IF NOT EXISTS BloodRequests (
    RequestID INT AUTO_INCREMENT PRIMARY KEY,
    HospitalID INT NOT NULL,
    BloodType VARCHAR(3) NOT NULL CHECK (BloodType IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    Urgency VARCHAR(20) NOT NULL CHECK (Urgency IN ('Urgent', 'Medium', 'Low')),
    Status VARCHAR(20) NOT NULL CHECK (Status IN ('Pending', 'Fulfilled', 'Cancelled')),
    RequestDate DATE NOT NULL,
    FOREIGN KEY (HospitalID) REFERENCES Hospitals(HospitalID) ON DELETE CASCADE
);

-- Donations Table
CREATE TABLE IF NOT EXISTS Donations (
    DonationID INT AUTO_INCREMENT PRIMARY KEY,
    DonorID INT NOT NULL,
    BloodType VARCHAR(3) NOT NULL CHECK (BloodType IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    Quantity INT NOT NULL,
    Date DATE NOT NULL,
    FOREIGN KEY (DonorID) REFERENCES Donors(DonorID) ON DELETE CASCADE
);

-- Transfusions Table
CREATE TABLE IF NOT EXISTS Transfusions (
    TransfusionID INT AUTO_INCREMENT PRIMARY KEY,
    HospitalID INT NOT NULL,
    PatientID INT NOT NULL,
    BloodType VARCHAR(3) NOT NULL CHECK (BloodType IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    Date DATE NOT NULL,
    FOREIGN KEY (HospitalID) REFERENCES Hospitals(HospitalID) ON DELETE CASCADE
);

-- Appointments Table
CREATE TABLE IF NOT EXISTS Appointments (
    AppointmentID INT AUTO_INCREMENT PRIMARY KEY,
    DonorID INT NOT NULL,
    Date DATE NOT NULL,
    Status VARCHAR(20) NOT NULL CHECK (Status IN ('Scheduled', 'Cancelled', 'Completed')),
    FOREIGN KEY (DonorID) REFERENCES Donors(DonorID) ON DELETE CASCADE
);

-- Reports Table
CREATE TABLE IF NOT EXISTS Reports (
    ReportID INT AUTO_INCREMENT PRIMARY KEY,
    HospitalID INT NOT NULL,
    BloodType VARCHAR(3) NOT NULL CHECK (BloodType IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    ShortageLevel VARCHAR(20) NOT NULL CHECK (ShortageLevel IN ('Low', 'Critical', 'Adequate')),
    Date DATE NOT NULL,
    FOREIGN KEY (HospitalID) REFERENCES Hospitals(HospitalID) ON DELETE CASCADE
);

-- Trigger: Update LastDonationDate in Donors after a donation is inserted
DELIMITER $$

CREATE TRIGGER update_last_donation_date
AFTER INSERT ON Donations
FOR EACH ROW
BEGIN
    UPDATE Donors
    SET LastDonationDate = NEW.Date
    WHERE DonorID = NEW.DonorID;
END $$

DELIMITER ;

-- Trigger: Check donor age between 18 and 65 before insert
DELIMITER $$

CREATE TRIGGER check_donor_age_before_insert
BEFORE INSERT ON Donors
FOR EACH ROW
BEGIN
    DECLARE age INT;
    SET age = YEAR(CURDATE()) - YEAR(NEW.DateOfBirth);
    IF age < 18 OR age > 65 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Donor must be between 18 and 65 years old';
    END IF;
END $$

DELIMITER ;

-- Reset AUTO_INCREMENT values (use only if all data is deleted)
ALTER TABLE Donors AUTO_INCREMENT = 1;
ALTER TABLE Hospitals AUTO_INCREMENT = 1;
ALTER TABLE BloodInventory AUTO_INCREMENT = 1;
ALTER TABLE BloodRequests AUTO_INCREMENT = 1;
ALTER TABLE Donations AUTO_INCREMENT = 1;
ALTER TABLE Transfusions AUTO_INCREMENT = 1;
ALTER TABLE Appointments AUTO_INCREMENT = 1;
ALTER TABLE Reports AUTO_INCREMENT = 1;
