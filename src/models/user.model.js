import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
        },
        mobile: {
            type: String,
            required: [true, "Mobile number is required"],
        },
        password: {
            type: String,
            minLength: [
                6,
                "Password length should be greater than or equal to 6",
            ],
            select: false,
            required: [true, "Password is required"],
        },
        followers: {
            type: [String],
            default: [],
        },
        following: {
            type: [String],
            default: [],
        },
    },
    { timestamps: true }
);

UserSchema.pre("save", function (next) {
    const user = this;

    if (!user.isModified("password")) return next();

    bcrypt.hash(user.password, 10, (err, hash) => {
        if (err) return next(err);
        user.password = hash;
        next();
    });
});

UserSchema.methods.generateAccessToken = function () {
    let payload = {
        id: this._id,
    };

    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};

let User = model("User", UserSchema);

export default User;
