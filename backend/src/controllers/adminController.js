// controllers/adminController.js
import User from "../models/userModel.js";

// GET /api/admin/users
export const getAllUsers = async (req, res) => {
    try {
      const users = await User.find().select("-password");
      res.json({ success: true, users });
    } catch (err) {
      console.error("getAllUsers error:", err.message);
      res.status(500).json({ success: false, message: err.message });
    }
  };
  

// DELETE /api/admin/users/:id
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    await user.deleteOne();
    res.json({ success: true, message: "User deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete user" });
  }
};
