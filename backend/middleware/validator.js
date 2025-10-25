const { body, validationResult } = require("express-validator");

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

exports.validateSignup = [
  body("name").notEmpty().withMessage("Name is required."),
  body("email").isEmail().withMessage("Please provide a valid email address."),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long."),
  body("contact").notEmpty().withMessage("Heartbeat contact is required."),
  body("frequency")
    .isInt({ min: 1 })
    .withMessage("Heartbeat frequency must be a positive number."),
  body("terms")
    .equals("true")
    .withMessage("You must accept the terms and conditions."),
  handleValidationErrors,
];

exports.validateLogin = [
  body("email").isEmail().withMessage("Please provide a valid email address."),
  body("password").notEmpty().withMessage("Password is required."),
  handleValidationErrors,
];

exports.validateCapsule = [
  body("title").notEmpty().withMessage("Title is required.").escape(),
  body("description")
    .notEmpty()
    .withMessage("Description is required.")
    .escape(),
  body("triggerType")
    .isIn(["date", "butterfly"])
    .withMessage("Invalid trigger type."),
  body("triggerDate")
    .if(body("triggerType").equals("date"))
    .isISO8601()
    .toDate()
    .withMessage("A valid trigger date is required for date-based capsules."),
  body("recipients").custom((value) => {
    const recipients = JSON.parse(value);
    if (!Array.isArray(recipients) || recipients.length === 0) {
      throw new Error("At least one recipient is required.");
    }
    return true;
  }),
  handleValidationErrors,
];

exports.validateProfileUpdate = [
  body("name").optional().notEmpty().withMessage("Name cannot be empty."),
  body("password")
    .optional()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long."),
  body("heartbeatIntervalDays")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Heartbeat interval must be a positive number."),
  body("preferredHeartbeatChannel")
    .optional()
    .isIn(["email", "whatsapp"])
    .withMessage("Invalid heartbeat channel."),
  body("heartbeatContact")
    .optional()
    .notEmpty()
    .withMessage("Heartbeat contact cannot be empty."),
  handleValidationErrors,
];
