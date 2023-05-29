const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserScheme = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    required: true,
    default: true,
  },
});

const User = (module.exports = mongoose.model('users', UserScheme));

// ! Protect password with Librari bcryptjs
module.exports.addUser = async (newUser, callback) => {
  try {
    // Генерація солі для хешування пароля
    const salt = await bcrypt.genSalt(10);
    // Хешування пароля з використанням солі
    const hash = await bcrypt.hash(newUser.password, salt);
    // Заміна відкритого тексту пароля хешем
    newUser.password = hash;
    // Збереження нового користувача в базі даних
    const savedUser = await newUser.save();
    // Виклик зворотнього виклику з результатом
    callback(null, savedUser);
  } catch (err) {
    // Виклик зворотнього виклику з помилкою
    callback(err);
  }
};

module.exports.comparePass = (passFromUser, userDBPass, callback) => {
  bcrypt.compare(passFromUser, userDBPass, (error, isMatch) => {
    if (error) throw error;
    callback(null, isMatch);
  });
};
