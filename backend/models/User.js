const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * @typedef {Object} IUser
 * @property {string} name - Full name of the user
 * @property {string} email - Unique email address (lowercase)
 * @property {string} password - Bcrypt hashed password
 * @property {string|null} resetPasswordToken - Temporary token for password reset
 * @property {Date|null} resetPasswordExpires - Expiration date for the reset token
 * @property {Date} createdAt - Auto-generated creation timestamp
 * @property {Date} updatedAt - Auto-generated update timestamp
 */

/**
 * Schema representing a registered user in the `users` collection.
 */
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true,
        maxlength: [100, 'El nombre no puede tener más de 100 caracteres']
    },
    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Por favor ingresa un email válido']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
        minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
        select: false
    },
    resetPasswordToken: {
        type: String,
        default: null
    },
    resetPasswordExpires: {
        type: Date,
        default: null
    }
}, {
    timestamps: true,
    versionKey: false
});

/**
 * Pre-save hook to hash the password before persisting.
 * Only runs if the password field has been modified.
 */
UserSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

/**
 * Instance method to compare a candidate password against the stored hash.
 * @param {string} candidatePassword - Plain text password to compare
 * @returns {Promise<boolean>} True if passwords match
 */
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

/**
 * The 'User' model bound to the 'users' collection.
 */
const User = mongoose.model('User', UserSchema, 'users');

module.exports = User;
