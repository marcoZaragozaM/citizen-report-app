import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import crypto from "crypto";

// Generar JWT
const generateToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'default_secret', {
    expiresIn: '30d',
  });
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ success: false, message: 'El usuario ya existe' });
      return;
    }

    const user = await User.create({
  name,
  email,
  password,
  role: 'usuario', // 🔒 FORZADO
});

    res.status(201).json({
      success: true,
      token: generateToken(user.id, user.role),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error en el servidor', error: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.status(401).json({ success: false, message: 'Credenciales inválidas' });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Credenciales inválidas' });
      return;
    }

    res.json({
      success: true,
      token: generateToken(user.id, user.role),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error en el servidor', error: error.message });
  }
};

export const getMe = async (req: any, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      return;
    }
    res.json({ success: true, data: user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error en el servidor', error: error.message });
  }
};

import crypto from "crypto";

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "Usuario no encontrado"
      });
      return;
    }

    const token = crypto.randomBytes(32).toString("hex");

    // ⚠️ Guardar token en el usuario
    user.resetToken = token;
    user.resetTokenExpire = new Date(Date.now() + 3600000); // 1 hora

    await user.save();

    res.json({
      success: true,
      message: "Token generado",
      token
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error en recuperación",
      error: error.message
    });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, password } = req.body;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: new Date() }
    });

    if (!user) {
      res.status(400).json({
        success: false,
        message: "Token inválido o expirado"
      });
      return;
    }

    // 🔐 nueva contraseña
    user.password = password;

    // limpiar token
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;

    await user.save();

    res.json({
      success: true,
      message: "Contraseña actualizada correctamente"
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error al resetear contraseña",
      error: error.message
    });
  }
};