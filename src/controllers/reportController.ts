import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import Report from '../models/Report';

// 🔥 CREAR REPORTE
export const createReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, type, address } = req.body;

    // 🔥 PARSE SEGURO (FormData siempre manda string)
    let locationParsed: any;

    try {
      locationParsed =
        typeof req.body.location === "string"
          ? JSON.parse(req.body.location)
          : req.body.location;
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Error parseando ubicación",
        raw: req.body.location
      });
    }

    // 🔥 CONVERTIR A NUMBER (CLAVE)
    const lat = Number(locationParsed?.lat);
    const lng = Number(locationParsed?.lng);

    // 🔥 VALIDACIÓN REAL
    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({
        success: false,
        message: "Ubicación inválida",
        debug: {
          recibido: req.body.location,
          parseado: locationParsed
        }
      });
    }

    const report = await Report.create({
      title,
      description,
      type,
      location: { lat, lng }, // 🔥 YA CORRECTO
      address,
      image: req.file ? req.file.filename : undefined,
      author: req.user?.id,
    });

    res.status(201).json({
      success: true,
      data: report,
    });

  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error creando reporte",
      error: error.message,
    });
  }
};

// 🔥 OBTENER TODOS
export const getReports = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const reports = await Report.find()
      .populate('author', 'name email')
      .sort('-createdAt');

    res.json({
      success: true,
      count: reports.length,
      data: reports,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error obteniendo reportes',
      error: error.message,
    });
  }
};

// 🔥 OBTENER POR ID
export const getReportById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('author', 'name email');

    if (!report) {
      res.status(404).json({
        success: false,
        message: 'Reporte no encontrado',
      });
      return;
    }

    res.json({
      success: true,
      data: report,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error obteniendo reporte',
      error: error.message,
    });
  }
};

// 🔥 CAMBIAR ESTADO
export const updateReportStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.body;

    if (!['pendiente', 'proceso', 'resuelto'].includes(status)) {
      res.status(400).json({
        success: false,
        message: 'Estado inválido',
      });
      return;
    }

    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!report) {
      res.status(404).json({
        success: false,
        message: 'Reporte no encontrado',
      });
      return;
    }

    res.json({
      success: true,
      data: report,
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error actualizando estado',
      error: error.message,
    });
  }
};

// 🔥 VOTAR
export const voteReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      res.status(404).json({
        success: false,
        message: 'Reporte no encontrado',
      });
      return;
    }

    const userId = req.user?.id;

    if (report.votedBy.includes(userId as any)) {
      res.status(400).json({
        success: false,
        message: 'Ya votaste por este reporte',
      });
      return;
    }

    report.votes += 1;
    report.votedBy.push(userId as any);

    await report.save();

    res.json({
      success: true,
      data: report,
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error votando',
      error: error.message,
    });
  }
};

// 🔥 ELIMINAR
export const deleteReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      res.status(404).json({
        success: false,
        message: 'Reporte no encontrado',
      });
      return;
    }

    await report.deleteOne();

    res.json({
      success: true,
      message: 'Reporte eliminado',
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error eliminando reporte',
      error: error.message,
    });
  }
};