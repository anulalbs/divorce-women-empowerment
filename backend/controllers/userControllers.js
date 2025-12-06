import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const getUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;  // default 1
        const limit = parseInt(req.query.limit) || 10; // default 10
        const skip = (page - 1) * limit;

        const filter = { role: "user" };
        const [users, total] = await Promise.all([
            User.find(filter).skip(skip).limit(limit),
            User.countDocuments(filter),
        ]);

        res.json({
            total,
            page,
            totalPages: Math.ceil(total / limit),
            users,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getExperts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;  // default 1
        const limit = parseInt(req.query.limit) || 10; // default 10
        const skip = (page - 1) * limit;

        const filter = { role: "expert" };
        const [users, total] = await Promise.all([
            User.find(filter).skip(skip).limit(limit),
            User.countDocuments(filter),
        ]);

        res.json({
            total,
            page,
            totalPages: Math.ceil(total / limit),
            users,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json({ user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateMe = async (req, res) => {
    try {
        const updates = {};
        const { fullname, phone, location, email } = req.body;
        if (fullname) updates.fullname = fullname;
        if (location) updates.location = location;

        // Do not allow changing email or phone via this endpoint.
        // If a client attempts to change them, reject the request.
        if (email && String(email).toLowerCase() !== String(req.user.email).toLowerCase()) {
            return res.status(400).json({ message: "Email cannot be changed" });
        }
        if (phone && String(phone) !== String(req.user.phone)) {
            return res.status(400).json({ message: "Phone cannot be changed" });
        }

        const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select("-password");
        res.json({ user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) return res.status(400).json({ message: "Both current and new passwords are required" });

        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const match = await bcrypt.compare(currentPassword, user.password);
        if (!match) return res.status(400).json({ message: "Current password is incorrect" });

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.json({ message: "Password changed successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};