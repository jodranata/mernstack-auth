const expressJwt = require('express-jwt');
const { OAuth2Client } = require('google-auth-library');
const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer');

const User = require('../models/auth.models');

const config = require('../config/config');

const transporter = nodemailer.createTransport({
  host: config.MAIL_HOST,
  port: config.MAIL_PORT,
  auth: {
    user: config.MAIL_USER,
    pass: config.MAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const registerController = (req, res) => {
  const {
    body: { email, firstName, lastName, password },
  } = req;

  // validate req check if there's an error
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array().map(error => error.msg)[0];
    return res.status(422).json({ errors: firstError });
  }
  // search if email exist or not,  error if exist
  User.findOne({ email }).exec((err, user) => {
    if (err) return res.json(err);
    if (user)
      return res.status(400).json({
        errors: 'Email is Taken',
      });

    jwt.sign(
      {
        email,
        password,
        firstName,
        lastName,
      },
      config.JWT_ACTIVATION,
      { expiresIn: '7d' },
      (signErr, token) => {
        if (signErr)
          return res.status(400).json({ errors: 'Cannot send verification' });
        const emailData = {
          from: 'jackofall@trades.com',
          to: email,
          subject: 'Account activation link',
          html: `
                <h1>Please use the following to activate your account</h1>
                <a href="${config.CLIENT_URL}/users/activate/${token}">Activate your account</a>
                <hr />
                <p>This email may containe sensitive information</p>
                <p>${config.CLIENT_URL}</p>
    `,
        };
        transporter.sendMail(emailData, sendErr => {
          if (sendErr) console.log(sendErr);
        });
        res.json({ message: 'Verification is sent, Please check your email' });
      },
    );
  });

  //  Create Token

  // send activation to email
};

const verificationController = (req, res) => {
  const { token } = req.params;
  if (!token) return res.json({ errors: 'error happening, please try again' });
  jwt.verify(token, config.JWT_ACTIVATION, err => {
    if (err) {
      return res.status(401).json({ errors: 'Expired Link' });
    }
    const { email, firstName, lastName, password } = jwt.decode(token);
    const newUser = new User({ email, firstName, lastName, password });
    newUser
      .save()
      .then(() => res.json({ success: true, message: 'Sign up success' }))
      .catch(userErr => res.json({ errors: userErr }));
    // Create Token
  });
};

const signInController = (req, res) => {
  const {
    body: { email, password },
  } = req;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array().map(error => error.msg)[0];
    return res.status(422).json({ errors: firstError });
  }
  User.findOne({ email }).exec((err, user) => {
    if (err || !user)
      return res.status(400).json({
        errors: 'There is no account with that email. Please Sign Up',
      });
    user.authenticate(password, (authErr, authenticated) => {
      if (authErr)
        return res.status(400).json({ errors: 'Failed to authenticate' });
      if (!authenticated)
        return res.status(403).json({
          success: false,
          errors: 'Wrong password, please try again',
        });
      const token = jwt.sign({ _id: user._id }, config.JWT_SECRET, {
        expiresIn: '3d',
      });
      const { _id, firstName, lastName, email, role } = user;
      return res.json({
        token,
        user: {
          _id,
          firstName,
          lastName,
          email,
          role,
        },
      });
    });
  });
};

const requireSignin = expressJwt({
  secret: config.JWT_SECRET, // req.user._id
  algorithms: ['HS256'],
});

const adminMiddleware = (req, res, next) => {
  User.findById({
    _id: req.user._id,
  }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'User not found',
      });
    }

    if (user.role !== 'Admin') {
      return res.status(400).json({
        error: 'Admin resource. Access denied.',
      });
    }

    req.profile = user;
    next();
  });
};

const forgotPasswordController = (req, res) => {
  const {
    body: { email },
  } = req;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array().map(error => error.msg)[0];
    return res.status(422).json({ errors: firstError });
  }

  User.findOne({ email }).exec((err, user) => {
    if (err || !user)
      return res
        .status(400)
        .json({ errors: 'There is no account with that email' });

    jwt.sign(
      { email },
      config.JWT_FORGOT_SECRET,
      { expiresIn: '7d' },
      (signErr, token) => {
        if (signErr)
          return res.status(400).json({ errors: 'Cannot create token' });

        const emailData = {
          from: 'jackofall@trades.com',
          to: email,
          subject: 'Reset password link',
          html: `
                <h1>Reset password link</h1>
                <a href="${config.CLIENT_URL}/users/reset/${token}">Reset your password</a>
                <hr />
                <p>This email may containe sensitive information</p>
                <p>${config.CLIENT_URL}</p>
    `,
        };
        transporter.sendMail(emailData, sendErr => {
          if (sendErr)
            return res.status(400).json({ errors: 'Cannot send reset link' });
        });
        return res
          .status(200)
          .json({ message: `Reset link is sent to ${email}` });
      },
    );
  });
};

const getResetToken = (req, res) => {
  const {
    params: { token },
  } = req;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array().map(error => error.msg)[0];
    return res.status(422).json({ errors: firstError });
  }
  jwt.verify(token, config.JWT_FORGOT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ errors: 'expired link' });
    return res.json(decoded);
  });
};

const resetPasswordController = (req, res) => {
  const {
    body: { email, newPassword },
  } = req;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array().map(error => error.msg)[0];
    return res.status(422).json({ errors: firstError });
  }

  User.findOne({ email }).exec((err, user) => {
    if (err || !user) return res.status(400).json({ errors: 'User not found' });

    if (newPassword && newPassword.trim()) {
      user.password = newPassword;
    }
    user.save(err => {
      if (err) {
        console.log(err, { errors: 'Updated user failed' });
        return res.status(400).json({ errors: 'Failed to update user' });
      }
      return res.json({ message: 'Successfully reset password' });
    });
  });
};

const oAuthClient = new OAuth2Client(config.GOOGLE_CLIENT);

const googleLogin = (req, res) => {
  const {
    body: { idToken },
  } = req;

  oAuthClient
    .verifyIdToken({ idToken, audience: config.GOOGLE_CLIENT })
    .then(authRes => {
      const {
        payload: {
          email_verified,
          email: gMail,
          given_name: googleFirstName,
          family_name: googleLastName,
        },
      } = authRes;
      if (!email_verified)
        return res
          .status(401)
          .json({ errors: 'Google Login failed, please try again' });

      User.findOne({ email: gMail }).exec((err, user) => {
        if (user) {
          const token = jwt.sign({ _id: user._id }, config.JWT_SECRET, {
            expiresIn: '3d',
          });
          const { _id, firstName, lastName, email, role } = user;
          return res.json({
            token,
            user: {
              _id,
              firstName,
              lastName,
              email,
              role,
            },
          });
        }
        const password = gMail + config.JWT_SECRET;
        const gData = {
          email: gMail,
          firstName: googleFirstName,
          lastName: googleLastName,
          password,
        };
        const newUser = new User(gData);
        newUser.save((newErr, userData) => {
          if (newErr)
            return res
              .status(400)
              .json({ errors: 'Failed to sign up with google account' });

          const token = jwt.sign({ _id: userData._id }, config.JWT_SECRET, {
            expiresIn: '3d',
          });
          const { _id, firstName, lastName, email, role } = userData;

          return res.json({
            token,
            user: {
              _id,
              firstName,
              lastName,
              email,
              role,
            },
          });
        });
      });
    })
    .catch(err => {
      return res
        .status(400)
        .json({ errors: 'Failed to authorize with this google account', err });
    });
};

const facebookLogin = (req, res) => {
  const {
    body: { userID, accessToken },
  } = req;
  const graphURL = `https://graph.facebook.com/${userID}?fields=first_name,last_name,email&access_token=${accessToken}`;

  fetch(graphURL, { method: 'GET' })
    .then(fetchRes => fetchRes.json())
    .then(fbUser => {
      const { email, first_name: firstName, last_name: lastName } = fbUser;

      User.findOne({ email }).exec((findErr, user) => {
        if (user) {
          const token = jwt.sign({ _id: user._id }, config.JWT_SECRET, {
            expiresIn: '3d',
          });
          const { _id, firstName, lastName, email, role } = user;
          return res.json({
            token,
            user: {
              _id,
              firstName,
              lastName,
              email,
              role,
            },
          });
        }
        const password = email + config.JWT_SECRET;
        const fbData = { firstName, lastName, email, password };
        const newUser = new User(fbData);
        newUser.save((saveErr, userData) => {
          if (saveErr)
            return res
              .status(400)
              .json({ errors: 'Failed to sign up with facebook account' });
          const token = jwt.sign({ _id: userData._id }, config.JWT_SECRET, {
            expiresIn: '3d',
          });

          const { _id, firstName, lastName, email, role } = userData;
          return res.json({
            token,
            user: {
              _id,
              firstName,
              lastName,
              email,
              role,
            },
          });
        });
      });
    })
    .catch(err =>
      res.status(400).json({
        errors: 'Failed to authorize login with this facebook account',
        err,
      }),
    );
};

module.exports = {
  registerController,
  verificationController,
  signInController,
  requireSignin,
  adminMiddleware,
  forgotPasswordController,
  getResetToken,
  resetPasswordController,
  googleLogin,
  facebookLogin,
};
