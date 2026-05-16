function requireFields(fields) {
  return (req, res, next) => {
    const missing = fields.filter((field) => req.body[field] === undefined || req.body[field] === null);

    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        data: {},
        error: `Missing required field(s): ${missing.join(', ')}`
      });
    }

    next();
  };
}

function validateObjectIdField(field) {
  return (req, res, next) => {
    const value = req.body[field] || req.params[field];

    if (!value || (typeof value !== 'string' || value.trim() === '')) {
      return res.status(400).json({
        success: false,
        data: {},
        error: `${field} must be a valid ID string`
      });
    }

    // Accept both MongoDB ObjectIds and Prisma CUID strings
    const isMongoDObjectId = /^[a-f\d]{24}$/i.test(value);
    const isCUID = /^[a-z0-9]+$/i.test(value) && value.length >= 5;

    if (!isMongoDObjectId && !isCUID) {
      return res.status(400).json({
        success: false,
        data: {},
        error: `${field} must be a valid ID string`
      });
    }

    next();
  };
}

function validateHeistSubmit(req, res, next) {
  const { player_id, level_number, selected_object_ids, time_taken_seconds } = req.body;

  if (!player_id || !level_number || !Array.isArray(selected_object_ids) || time_taken_seconds === undefined) {
    return res.status(400).json({
      success: false,
      data: {},
      error: 'player_id, level_number, selected_object_ids, and time_taken_seconds are required'
    });
  }

  // Helper function to validate ID format (MongoDB ObjectId or CUID)
  const isValidId = (id) => {
    const isMongoDObjectId = /^[a-f\d]{24}$/i.test(id);
    const isCUID = /^[a-z0-9]+$/i.test(id) && id.length >= 5;
    return isMongoDObjectId || isCUID;
  };

  if (!isValidId(player_id)) {
    return res.status(400).json({
      success: false,
      data: {},
      error: 'player_id must be a valid ID string'
    });
  }

  const invalidObjectId = selected_object_ids.find((id) => !isValidId(id));
  if (invalidObjectId) {
    return res.status(400).json({
      success: false,
      data: {},
      error: 'selected_object_ids must contain valid ID strings'
    });
  }

  if (!Number.isInteger(Number(level_number)) || Number(level_number) < 1) {
    return res.status(400).json({
      success: false,
      data: {},
      error: 'level_number must be a positive integer'
    });
  }

  if (Number(time_taken_seconds) < 0) {
    return res.status(400).json({
      success: false,
      data: {},
      error: 'time_taken_seconds must be zero or greater'
    });
  }

  next();
}

module.exports = {
  requireFields,
  validateObjectIdField,
  validateHeistSubmit
};
