const Worker = require("../models/Worker");

exports.registerWorker = async (req, res) => {

  try {

    const { name, phone, profession, experience, lat, lng } = req.body;

    const worker = new Worker({
      name,
      phone,
      profession,
      experience,
      location: { lat, lng }
    });

    await worker.save();

    res.status(201).json({
      success: true,
      worker
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Worker registration failed"
    });

  }

};


exports.getWorkers = async (req, res) => {

  try {

    const workers = await Worker.find();

    res.json({
      success: true,
      workers
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Error fetching workers"
    });

  }

};


exports.getWorkersByProfession = async (req, res) => {

  try {

    const { profession } = req.params;

    const workers = await Worker.find({ profession });

    res.json({
      success: true,
      workers
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Error fetching workers"
    });

  }

};