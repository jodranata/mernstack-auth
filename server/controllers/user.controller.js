const User = require('../models/auth.models');

const updateController = (req, res) => {
  const {
    body: { firstName, lastName, password },
  } = req;

  User.findById(req.user._id, (err, user) => {
    if (err || !user) return res.status(400).json({ errors: 'User not found' });

    if (firstName && firstName.trim()) {
      user.firstName = firstName;
    }
    if (lastName && lastName.trim()) {
      user.lastName = lastName;
    }
    if (password && password.trim()) {
      user.password = password;
    }

    user.save((err, updatedUser) => {
      if (err) {
        console.log({ err, errors: 'updated user failed' });
        return res.status(400).json({ errors: 'User update failed' });
      }
      return res.json({
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        role: updatedUser.role,
        _id: updatedUser._id,
      });
    });
  });
};

module.exports = { updateController };
