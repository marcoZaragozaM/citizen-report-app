import mongoose from 'mongoose';

export default async function connectDB() {
  try {
    if (!process.env.MONGODB_URI) {
      console.warn('⚠️ MONGODB_URI no está definido en las variables de entorno.');
      console.warn('⚠️ La base de datos no se conectará. Las rutas de la API fallarán.');
      return;
    }
    
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
    // No salimos del proceso para permitir que el frontend siga funcionando y muestre instrucciones
  }
}
