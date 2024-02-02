const { User } = require("../models");
const joi = require("joi");
const { hashPassword, comparePassword } = require("../utils/bcriptUtils");
const { generateToken, verifyToken } = require("../utils/jwtUtils");
const { where } = require("sequelize");

exports.signup = async (req, res) => {
    try {
        const newData = req.body;

        const scheme = joi.object({
            firstName: joi.string().min(3).required(),
            lastName: joi.string().min(3).required(),
            email: joi.string().email({ tlds: { allow: false } }),
            password: joi.string().min(8).required(),
        })

        const { error } = scheme.validate(newData);
        if (error) {
        return res.status(400).json({ message: error.details[0].message, status: 400 });
        }

        const existUser = await User.findOne({where : {email: newData.email}})
        if (existUser) {
            return res.status(400).json({ message: `Email already exist`, status: 400 });
        }

        const hashedPassword = hashPassword(newData.password);
        newData.password = hashedPassword;
        newData.role = 2;

        const signupReponse = await User.create(newData);
        res.status(201).json({ message: "Signup Success", status: 201});
    } catch (error) {
        res.status(500).json({ message: "Internal server error", status: 500 });
    }
}


exports.signin = async (req, res) => {
    try {
        const newData = req.body;

        const scheme = joi.object({
            email: joi.string().email({ tlds: { allow: false } }),
            password: joi.string().min(8).required(),
        })

        const { error } = scheme.validate(newData);
        if (error) {
            return res.status(400).json({ message: error.details[0].message, status: 400 });
        }

        const user = await User.findOne({
            where: {
              email: newData?.email
            },
            attributes: {
              exclude: ['createdAt', 'updatedAt']
            }
        })
      
        if (!user) return res.status(404).json({ message: 'User not found', status: 404 });

        const checkPassword = comparePassword(newData?.password, user?.password)

        if(!checkPassword) return res.status(400).json({ message: 'Invalid password', status: 400 });

        const token = generateToken({
            id: user?.id,
            email: user?.email,
        })

        res.status(201).json({ message: "Sign in Success", status: 200, token: token});
    } catch (error) {
        res.status(500).json({ message: "Internal server error", status: 500 });
    }
}

exports.getProfile = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = verifyToken(token)
        
        const user = await User.findOne({
            where: {
              id: decoded?.id
            },
            attributes: {
              exclude: ['createdAt', 'updatedAt', 'password']
            }
        })

        if(!user) return res.status(404).json({ message: "Profile not found", status: 404 });

        res.status(200).json({ message: "Success get profile", status: 200, data: user });
    }catch (error){
        // console.log(['userController', 'list', 'ERROR'], { info: `${err}` });
        res.status(500).json({ message: "Internal server error", status: 500 });
    }
}

exports.changePassword = async (req, res) => {
    try {
        const newData = req?.body
        const token = req.headers.authorization.split(" ")[1];
        const decoded = verifyToken(token)

        const scheme = joi.object({
            newPassword: joi.string().min(8).required(),
            verifyPassword: joi.string().min(8).required(),
        })

        const { error } = scheme.validate(newData);
        if (error) {
            return res.status(400).json({ message: error.details[0].message, status: 400 });
        }
        
        const user = await User.findOne({
            where: {
              id: decoded?.id
            },
            attributes: {
              exclude: ['createdAt', 'updatedAt']
            }
        })

        if(!user) return res.status(404).json({ message: "User not found", status: 404 });

        if(newData?.newPassword !== newData?.verifyPassword) {
            return res.status(404).json({ message: "New password and verivy password is not equals", status: 404 });
        }
        const hashedPassword = hashPassword(newData?.newPassword);

        const changePasswordResponse = await User.update({
            firstName: user?.firstName,
            lastName: user?.lastName,
            email: user?.email,
            role: user?.role,
            password: hashedPassword
        },
        { where: { id: user?.id } });

        res.status(200).json({ message: "Password Changed" });
    }catch (error) {
        console.log(['userController', 'forgotPass', 'ERROR'], { info: `${error}` });
        res.status(500).json({ message: "Internal server error", status: 500 });
    }
}