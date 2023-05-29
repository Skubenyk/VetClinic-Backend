const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const jwt = require('jsonwebtoken');
const config = require('../../config/db');
const mongoose = require('mongoose');

// ! Registration
router.post('/registration', async (req, res) => {
  try {
    const { firstName, lastName, userName, email, password } = req.body;
    const userEmail = await User.findOne({ email: email.toLowerCase() });
    const userUserName = await User.findOne({
      userName: userName.toLowerCase(),
    });

    // * Перевірка чи користувач з таким емейлом існує
    if (userEmail) {
      return res.status(400).json({
        message: 'User with this email address exists',
      });
    }
    // * Перевірка чи користувач з таким іменем користувача існує
    if (userUserName) {
      return res.status(400).json({
        message: 'User with this name exists',
      });
    }
    // * Перевірка на довжину пароля
    if (password.length < 6) {
      return res.status(417).json({
        message: 'The password must be at least 6 characters long',
      });
    }
    // * Створення користувача
    user = new User({
      firstName: firstName,
      lastName: lastName,
      userName: userName.toLowerCase(),
      email: email.toLowerCase(),
      password: password,
      active: true,
    });
    User.addUser(user, (error, user) => {
      if (error) {
        res.status(422).json({
          message: 'Some problems have arisen',
        });
      } else {
        res.status(201).json({
          message: 'Success',
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: {
        ua: 'Виникли деякі проблеми',
        en: 'There are some problems',
      },
      error: error,
    });
  }
});

// ! Authorization
router.post('/authorization', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    // * Перевірка чи користувач існує за емейлом
    if (!user) {
      return res.status(400).json({
        message: 'User with this email does not exist',
      });
    }
    // * Перевірка чи користувач активний
    if (!user.active) {
      return res.status(403).json({
        message: 'User is blocked',
      });
    }

    User.comparePass(password, user.password, (err, isMatch) => {
      if (err) throw err;
      if (isMatch) {
        const token = jwt.sign(user.toJSON(), config.secret, {
          expiresIn: 3600 * 24 * 365,
        });
        res.status(200).json({
          token: token,
          user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            userName: user.userName,
            email: user.email,
          },
        });
      } else {
        return res.status(401).json({
          message: 'Wrong password',
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: {
        ua: 'Виникли деякі проблеми',
        en: 'There are some problems',
      },
      error: error,
    });
  }
});

// ! Getting data by id
// * Метод для входу в особистий кабінет по id
router.get('/:id', async (req, res) => {
  try {
    const { authorization } = req.headers;
    const { id } = req.params;
    // * Перевірка чи користувач автторизований
    if (!authorization) {
      return res.status(401).json({
        message: 'User is not authorization',
      });
    }

    // * Перевірка чи користувач існує
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        message: 'User is not found!',
      });
    }

    let user;
    // * Перевірка чи verifyUser існує
    const verifyUser = jwt.verify(authorization, config.secret);

    if (!verifyUser) {
      return res.status(401).json({
        message: 'User is unauthorized',
      });
    } else if (id === verifyUser._id) {
      // * Перевірка на role verifyUser.role <3 ---403(коли є то треба зробити)
      return res.status(403).json({
        message: 'No access rights',
      });
    }

    user = User.findById(id);
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }
    if (!user.active) {
      return res.status(403).json({
        message: 'User is blocked',
      });
    }
    return res.status(200).json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        userName: user.userName,
        email: user.email,
        // role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      id: _id,
      success: false,
      message: {
        ua: 'Виникли деякі проблеми',
        en: 'There are some problems',
      },
      error: error,
    });
  }
});

// * Оновлення даних
// ! await User.findByIdAndUpdate(id, { firstName, lastName, userName, email });
// * Пошук постів код дивитися відео про бекенд частина 2  -  2:28:02 і фото в папці з проектом
module.exports = router;
