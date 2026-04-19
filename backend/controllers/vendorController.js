const Vendor = require("../models/Vendor");
const User = require("../models/userModel");

// Register vendor
const registerVendor = async (req, res) => {
  try {
    const { name, phone, shopType, description, address, lat, lng, email, menu, features, paymentMethods, operatingHours } = req.body;
    
    const existingVendor = await Vendor.findOne({ userId: req.user.id });
    if (existingVendor) {
      return res.status(400).json({ success: false, message: 'Vendor profile already exists' });
    }
    
    await User.findByIdAndUpdate(req.user.id, { role: 'seller' });
    
    const vendor = new Vendor({
      userId: req.user.id,
      name,
      phone,
      email: email || req.user.email,
      shopType,
      description: description || "",
      address: address || "",
      location: { lat: lat || 0, lng: lng || 0 },
      paymentMethods: paymentMethods || ["Cash", "UPI"],
      features: features || [],
      menu: menu || [],
      operatingHours: operatingHours || [
        { day: "Monday", open: "09:00 AM", close: "09:00 PM", isClosed: false },
        { day: "Tuesday", open: "09:00 AM", close: "09:00 PM", isClosed: false },
        { day: "Wednesday", open: "09:00 AM", close: "09:00 PM", isClosed: false },
        { day: "Thursday", open: "09:00 AM", close: "09:00 PM", isClosed: false },
        { day: "Friday", open: "09:00 AM", close: "09:00 PM", isClosed: false },
        { day: "Saturday", open: "10:00 AM", close: "10:00 PM", isClosed: false },
        { day: "Sunday", open: "10:00 AM", close: "08:00 PM", isClosed: false }
      ]
    });
    
    await vendor.save();
    res.status(201).json({ success: true, data: vendor });
  } catch (error) {
    console.error("Register vendor error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get logged-in vendor's profile
const getMyVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user.id });
    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor profile not found" });
    }
    res.json({ success: true, data: vendor });
  } catch (error) {
    console.error("Get my vendor error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get vendor by ID
const getVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id)
      .populate("userId", "name email");
    
    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }
    
    res.json({ success: true, data: vendor });
  } catch (error) {
    console.error("Get vendor by ID error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get live vendors
const getLiveVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find({ isLive: true })
      .select("-menu -operatingHours -galleryImages")
      .sort({ createdAt: -1 });
    
    res.json({ success: true, data: vendors });
  } catch (error) {
    console.error("Get live vendors error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Go live / Stop live
const goLive = async (req, res) => {
  try {
    const { vendorId, lat, lng } = req.body;
    
    const vendor = await Vendor.findOne({ _id: vendorId, userId: req.user.id });
    
    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }
    
    vendor.isLive = !vendor.isLive;
    if (vendor.isLive && lat && lng) {
      vendor.location = { lat, lng };
      vendor.lastLiveAt = new Date();
    }
    
    await vendor.save();
    res.json({ success: true, data: vendor });
  } catch (error) {
    console.error("Go live error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update vendor - FIXED to properly handle menu and nested fields
const updateVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    
    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }
    
    if (vendor.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }
    
    // Create update object and remove any fields that shouldn't be directly updated
    const updateData = { ...req.body._doc || req.body };
    
    // Remove protected fields
    delete updateData._id;
    delete updateData.userId;
    delete updateData.createdAt;
    delete updateData.updatedAt;
    delete updateData.__v;
    
    // Handle menu items - ensure they're in the correct format
    if (updateData.menu && Array.isArray(updateData.menu)) {
      updateData.menu = updateData.menu.map(item => ({
        ...item,
        price: Number(item.price),
        isAvailable: item.isAvailable !== undefined ? item.isAvailable : true,
        isVegetarian: item.isVegetarian || false
      }));
    }
    
    // Handle location
    if (updateData.location) {
      updateData.location = {
        lat: Number(updateData.location.lat) || 0,
        lng: Number(updateData.location.lng) || 0
      };
    }
    
    // Handle numeric fields
    if (updateData.minimumOrderAmount) updateData.minimumOrderAmount = Number(updateData.minimumOrderAmount);
    if (updateData.deliveryFee) updateData.deliveryFee = Number(updateData.deliveryFee);
    
    const updatedVendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    res.json({ success: true, data: updatedVendor });
  } catch (error) {
    console.error("Update vendor error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add menu item
const addMenuItem = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    
    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }
    
    if (vendor.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }
    
    const newItem = {
      name: req.body.name,
      price: Number(req.body.price),
      description: req.body.description || "",
      category: req.body.category || "Other",
      isAvailable: req.body.isAvailable !== undefined ? req.body.isAvailable : true,
      isVegetarian: req.body.isVegetarian || false
    };
    
    vendor.menu.push(newItem);
    await vendor.save();
    
    // Return the newly added item with its ID
    const addedItem = vendor.menu[vendor.menu.length - 1];
    res.json({ success: true, data: addedItem });
  } catch (error) {
    console.error("Add menu item error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update menu item
const updateMenuItem = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    
    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }
    
    if (vendor.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }
    
    const menuItem = vendor.menu.id(req.params.menuId);
    if (!menuItem) {
      return res.status(404).json({ success: false, message: "Menu item not found" });
    }
    
    // Update fields
    if (req.body.name) menuItem.name = req.body.name;
    if (req.body.price) menuItem.price = Number(req.body.price);
    if (req.body.description !== undefined) menuItem.description = req.body.description;
    if (req.body.category) menuItem.category = req.body.category;
    if (req.body.isAvailable !== undefined) menuItem.isAvailable = req.body.isAvailable;
    if (req.body.isVegetarian !== undefined) menuItem.isVegetarian = req.body.isVegetarian;
    
    await vendor.save();
    
    res.json({ success: true, data: vendor.menu });
  } catch (error) {
    console.error("Update menu item error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete menu item
const deleteMenuItem = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    
    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }
    
    if (vendor.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }
    
    const menuItem = vendor.menu.id(req.params.menuId);
    if (!menuItem) {
      return res.status(404).json({ success: false, message: "Menu item not found" });
    }
    
    menuItem.deleteOne();
    await vendor.save();
    
    res.json({ success: true, message: "Menu item deleted", data: vendor.menu });
  } catch (error) {
    console.error("Delete menu item error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update operating hours
const updateOperatingHours = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    
    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }
    
    if (vendor.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }
    
    vendor.operatingHours = req.body.hours;
    await vendor.save();
    
    res.json({ success: true, data: vendor.operatingHours });
  } catch (error) {
    console.error("Update hours error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update features
const updateFeatures = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    
    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }
    
    if (vendor.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }
    
    vendor.features = req.body.features;
    await vendor.save();
    
    res.json({ success: true, data: vendor.features });
  } catch (error) {
    console.error("Update features error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update payment methods
const updatePaymentMethods = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    
    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }
    
    if (vendor.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }
    
    vendor.paymentMethods = req.body.paymentMethods;
    await vendor.save();
    
    res.json({ success: true, data: vendor.paymentMethods });
  } catch (error) {
    console.error("Update payment methods error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add gallery image
const addGalleryImage = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    
    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }
    
    if (vendor.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }
    
    vendor.galleryImages.push(req.body);
    await vendor.save();
    
    res.json({ success: true, data: vendor.galleryImages });
  } catch (error) {
    console.error("Add gallery image error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete gallery image
const deleteGalleryImage = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    
    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }
    
    if (vendor.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }
    
    vendor.galleryImages.id(req.params.imageId).deleteOne();
    await vendor.save();
    
    res.json({ success: true, message: "Image deleted" });
  } catch (error) {
    console.error("Delete gallery image error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerVendor,
  getVendorById,
  getMyVendor,
  getLiveVendors,
  goLive,
  updateVendor,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  updateOperatingHours,
  updateFeatures,
  updatePaymentMethods,
  addGalleryImage,
  deleteGalleryImage
};