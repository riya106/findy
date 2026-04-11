const Vendor = require("../models/Vendor");

exports.registerVendor = async (req, res) => {

  try {

    const { name, phone, shopType } = req.body;

    const vendor = new Vendor({
      name,
      phone,
      shopType
    });

    await vendor.save();

    res.status(201).json({
      success: true,
      vendor
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Vendor registration failed"
    });

  }

};


exports.goLive = async (req, res) => {

  try {

    const { vendorId, lat, lng } = req.body;

    const vendor = await Vendor.findByIdAndUpdate(
      vendorId,
      {
        location: { lat, lng },
        isLive: true
      },
      { new: true }
    );

    res.json({
      success: true,
      vendor
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Unable to go live"
    });

  }

};


exports.getLiveVendors = async (req, res) => {

  try {

    const vendors = await Vendor.find({ isLive: true });

    res.json({
      success: true,
      vendors
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Error fetching vendors"
    });

  }

};