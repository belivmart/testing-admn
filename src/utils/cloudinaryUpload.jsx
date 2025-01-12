import axios from 'axios';
import imageCompression from 'browser-image-compression';

const uploadToCloudinary = async (file, setUploadProgress, maxSizeKB = 800) => {
  try {
    // Convert max size from KB to MB
    const maxSizeMB = maxSizeKB / 1024;

    // Options for image compression
    const options = {
      maxSizeMB: maxSizeMB,
      useWebWorker: true,
    };

    // Compress the image
    const compressedFile = await imageCompression(file, options);

    // Check if the compressed file size is within the desired range
    if (compressedFile.size / 1024 > maxSizeKB) {
      throw new Error(`Unable to compress image to desired size. Current size: ${(compressedFile.size / 1024).toFixed(2)} KB`);
    }

    // Prepare form data for upload
    const data = new FormData();
    data.append("file", compressedFile);
    // data.append("upload_preset", process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || "whxam1fl");
    data.append("upload_preset", "belivmart");
    data.append("folder", "belivmart");

    // Upload the compressed image to Cloudinary
    const response = await axios.post(
      // `https://api.cloudinary.com/v1_1/dunzldpvc/image/upload`,  // Ensure this is your Cloudinary cloud name
      `https://api.cloudinary.com/v1_1/dvjw9pm1d/image/upload`,  // Ensure this is your Cloudinary cloud name
      data,
      {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          if (setUploadProgress) {
            setUploadProgress(percentCompleted);
          }
        }
      }
    );

    if (response.status === 200) {
      return response.data.url;  // Return the URL of the uploaded image
    } else {
      throw new Error('Failed to upload image');
    }
  } catch (error) {
    console.error("Image upload error:", error);
    throw error;
  }
};

export default uploadToCloudinary;