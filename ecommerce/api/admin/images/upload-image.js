import formidable from 'formidable';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const DB_IMAGE_DIR = path.join(process.cwd(), 'public', 'product_image');

// Auth middleware for Vercel
const authenticateAdmin = (req) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return false;
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');
    return decoded.role === 'admin';
  } catch (error) {
    return false;
  }
};

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', ['POST']);
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // Check Cloudinary env vars
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return res.status(500).json({ error: 'Cloudinary environment variables are not set' });
    }

    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: 'Form parse error', details: err.message });
      }
      const file = files.image;
      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      try {
        // Try Cloudinary upload
        const result = await cloudinary.uploader.upload(file.filepath, {
          folder: 'products',
          resource_type: 'image',
        });
        return res.status(200).json({ url: result.secure_url, source: 'cloudinary' });
      } catch (cloudErr) {
        // Fallback: store in /public/product_image
        try {
          if (!fs.existsSync(DB_IMAGE_DIR)) fs.mkdirSync(DB_IMAGE_DIR, { recursive: true });
          const ext = path.extname(file.originalFilename || file.newFilename || '.jpg');
          const dbFileName = `${Date.now()}_${Math.random().toString(36).slice(2)}${ext}`;
          const dbFilePath = path.join(DB_IMAGE_DIR, dbFileName);
          fs.copyFileSync(file.filepath, dbFilePath);
          const url = `/product_image/${dbFileName}`;
          return res.status(200).json({ url, source: 'database' });
        } catch (dbErr) {
          return res.status(500).json({ error: 'Upload failed (Cloudinary and DB)', details: dbErr.message });
        }
      }
    });
  } catch (e) {
    console.error('Image upload error:', e);
    return res.status(500).json({ error: 'Server error', details: e.message });
  }
}
