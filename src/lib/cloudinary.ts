import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const deleteCloudinaryFile = async (url: string) => {
  if (!url) return;
  
  try {
    // Cloudinary URL format: https://res.cloudinary.com/<cloud_name>/<resource_type>/upload/v<version>/<public_id>.<ext>
    // Example: https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg
    
    // We need to extract everything after /upload/ (ignoring the version if present) and without the extension
    const parts = url.split('/upload/');
    if (parts.length < 2) return;
    
    let publicIdWithExt = parts[1];
    
    // Remove version prefix if exists (e.g. v123456/)
    if (publicIdWithExt.match(/^v\d+\//)) {
      publicIdWithExt = publicIdWithExt.replace(/^v\d+\//, '');
    }
    
    // Remove file extension
    const lastDotIndex = publicIdWithExt.lastIndexOf('.');
    const publicId = lastDotIndex !== -1 ? publicIdWithExt.substring(0, lastDotIndex) : publicIdWithExt;
    
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
      console.log(`Deleted cloudinary asset: ${publicId}`);
    }
  } catch (error) {
    console.error("Failed to delete from Cloudinary:", error);
  }
};
