const mongoose = require('mongoose');
const Expert = require('../models/Expert');
const AppError = require('../utils/AppError');

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getExperts = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
    const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
    const category = typeof req.query.category === 'string' ? req.query.category.trim() : '';

    const filter = {};
    if (search) filter.name = { $regex: escapeRegex(search), $options: 'i' };
    if (category) filter.category = { $regex: `^${escapeRegex(category)}$`, $options: 'i' };

    const totalExperts = await Expert.countDocuments(filter);
    const experts = await Expert.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean();

    res.status(200).json({
      success: true,
      count: experts.length,
      pagination: { page, limit, total: totalExperts, totalPages: Math.ceil(totalExperts / limit) || 1 },
      data: experts
    });
  } catch (error) {
    next(error);
  }
};

const getExpertById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) throw new AppError('Invalid expert ID', 400);

    const expert = await Expert.findById(id).lean();
    if (!expert) throw new AppError('Expert not found', 404);

    res.status(200).json({ success: true, data: expert });
  } catch (error) {
    next(error);
  }
};

module.exports = { getExperts, getExpertById };
