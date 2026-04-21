import User, { IUser } from "../models/User";
import { Response } from "express";
import { AuthRequest } from "../middlewares/auth";

// 👤 Obtener usuario actual
export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.id).select("-password") as IUser | null;

    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado"
      });
    }

    res.json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role
    });

  } catch (error) {
    res.status(500).json({
      message: "Error obteniendo usuario"
    });
  }
};

// ✏️ Actualizar usuario
export const updateMe = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const user = await User.findById(req.user?.id).select("+password") as IUser | null;

    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado"
      });
    }

    // 🔹 Validar email duplicado
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(400).json({
          message: "El email ya está en uso"
        });
      }

      user.email = email;
    }

    // 🔹 Actualizar nombre
    if (name) {
      user.name = name;
    }

    // 🔹 Actualizar password (el modelo lo hashea automáticamente)
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({
          message: "La contraseña debe tener al menos 6 caracteres"
        });
      }

      user.password = password;
    }

    await user.save();

    res.json({
      message: "Usuario actualizado correctamente",
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({
      message: "Error actualizando usuario"
    });
  }
};