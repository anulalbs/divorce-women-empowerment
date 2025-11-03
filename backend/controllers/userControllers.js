import User from "../models/User.js";

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