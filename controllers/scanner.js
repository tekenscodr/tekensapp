const Scanner = require('../models/scanner')


// ADD SCANNER
const addScanner = async (req, res, next) => {
    try {
      const { eventId, scanners } = req.body;
      const event = await Event.findById(eventId);
  
      if (!event) {
        console.log("Event not found");
        res.status(404).json({ message: "Event not found" });
      } else {
        console.log('Found!!!');
  
        // Check if a scanner document already exists for the event
        const existingScanner = await Scanners.findOne({ eventId });
  
        if (existingScanner) {
          // Check for duplicate scanners
          const duplicateScanners = existingScanner.scanners.filter((scanner) =>
            scanners.some((newScanner) => scanner.mobile === newScanner.phoneNumber)
          );
  
          if (duplicateScanners.length > 0) {
            // Update the existing scanners
            existingScanner.scanners = existingScanner.scanners.map((scanner) => {
              const newScanner = scanners.find((s) => scanner.mobile === s.phoneNumber);
              return newScanner ? { mobile: newScanner.phoneNumber, otp: newScanner.otp } : scanner;
            });
            const updatedScanner = await existingScanner.save();
            res.status(200).json({ message: 'Scanner updated successfully', updatedScanner });
          } else {
            // Add the new scanners
            existingScanner.scanners.push(...scanners.map((scanner) => ({
              mobile: scanner.phoneNumber,
              otp: scanner.otp,
            })));
            // Validate the scanners array
            existingScanner.scanners = existingScanner.scanners.filter((scanner) => scanner.mobile && scanner.otp);
            const updatedScanner = await existingScanner.save();
            res.status(200).json({ message: 'Scanner updated successfully', updatedScanner });
          }
        } else {
          // If no document exists, create a new one with the scanner data
          const newScanner = await Scanners.create({
            scanners: scanners.map((scanner) => ({
              mobile: scanner.phoneNumber,
              otp: scanner.otp,
            })),
            eventId,
          });
          res.status(201).json({ message: 'Scanner added successfully', newScanner });
        }
      }
    } catch (error) {
      res.status(500).json({ message: 'Error adding scanner', error: error.message });
      next(error);
    }
  };


// GET A SCANNER 
const getScanner = async(req, res, next) => {
    try {
      const eventId = await req.params.eventId;
      const scanner = await Scanner.find({ eventId });
      if(scanner.length <= 0) return res.status(404).json({message:"Scanners are not found"})
        return res.status(200).json({message: "Scanners found", data: scanner})
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}
// GET SCANNERS
const eventScanners = async(req, res, next) => {
    try {
        const eventId = await req.params.eventId;
        const scanner = await Scanner.find({ eventId });
        const scannerNumber = await req.body;
        const scannerMatch = await scanner.scanners.find(scanner => scanner.mobile === scannerNumber);

        if (scannerMatch) {
            res.status(200).json({ message: 'Mobile contact found in scanners array!' });
          } else {
            res.status(400).json({ message: 'Mobile contact not found in scanners array!' });
          }
        
    } catch (error) {
        return res.status(500).json('Error: ' + err.message)
    }
}



module.exports = {
    addScanner,
    getScanner,
    eventScanners,
}