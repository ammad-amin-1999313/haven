async function uploadImagesToCloudinary(files) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error("Missing Cloudinary env vars");
  }

  const uploadOne = async (file) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", uploadPreset);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: fd,
    });

    if (!res.ok) {
      // Cloudinary returns JSON error usually, but keep safe
      let msg = "Upload failed";
      try {
        const j = await res.json();
        msg = j?.error?.message || msg;
      } catch {}
      throw new Error(msg);
    }

    const data = await res.json();
    return data.secure_url; // ✅ final URL
  };

  // Upload in parallel
  return Promise.all(files.map(uploadOne));
}
export { uploadImagesToCloudinary };