const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
    {
        profileId: {
            type: String,
            required: true,
            trim: true
        },
        name: {
            type: String,
            required: true,
            trim: true
        }
    },
    { _id: false }
);

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: true
        },
        subscription: {
            status: {
                type: String,
                enum: ["ACTIVE", "INACTIVE", "EXPIRED"],
                default: "INACTIVE"
            },
            expiresAt: {
                type: Date,
                default: null
            }
        },
        profiles: {
            type: [profileSchema],
            validate: {
                validator: (profiles) => profiles.length <= 4,
                message: "A user can have at most 4 profiles"
            }
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);