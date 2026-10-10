const mongoose = require("mongoose");

const watchStateSchema = new mongoose.Schema({ contentId: { type: String, required: true }, timestampSeconds: { type: Number, required: true, min: 0 }, updatedAt: { type: Date, default: Date.now } }, { _id: false });

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
        ,avatar: { type: String, default: "" }
        ,isKids: { type: Boolean, default: false }
        ,watchHistory: { type: [watchStateSchema], default: [] }
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
            },
            planId: { type: String, default: null },
            planName: { type: String, default: null },
            price: { type: Number, default: null },
            activatedAt: { type: Date, default: null },
            transactionId: { type: String, default: null },
            paymentMethod: { type: String, default: null }
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
