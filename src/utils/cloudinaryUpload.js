// utils/uploadToCloudinary.js

export const uploadToCloudinary = async (file, type = "image", folder = "") => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", preset);
  if (folder) formData.append("folder", folder); // optional folder path

  const endpoint =
    type === "audio"
      ? `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`
      : `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  const res = await fetch(endpoint, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("Cloudinary upload failed:", data);
    throw new Error(data.error?.message || "Cloudinary Upload Failed");
  }

  return data.secure_url;
};
