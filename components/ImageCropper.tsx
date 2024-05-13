import React, { useRef, useState } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

// Define the props type
interface ImageCropperProps {
  onCrop: (croppedImageUrl: string) => void;
}

const ImageCropper: React.FC<ImageCropperProps> = ({ onCrop }) => {
  const [image, setImage] = useState<string>(""); // Using string type for image URL
  const [isVisible, setIsVisible] = useState<boolean>(false); // Using boolean type for visibility
  const cropperRef = useRef<Cropper>(null); // Use generic to specify the type of ref

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const files = e.target.files;
    if (files && files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string); // Type assertion as string
        setIsVisible(true);
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const getCropData = () => {
    if (cropperRef.current) {
      const cropper = cropperRef.current.cropper;
      if (cropper) {
        // Checking if cropper instance is available
        const croppedImageUrl = cropper.getCroppedCanvas().toDataURL();
        console.log("Cropping image");
        onCrop(croppedImageUrl);
        setIsVisible(false);
      }
    }
  };

  const handleCancel = () => {
    console.log("Cropping cancelled");
    setIsVisible(false);
  };

  return (
    <div>
      <input type="file" accept="image/*" className="mt-3" onChange={onFileChange} />
      {isVisible && (
        <div className="fixed top-0 left-0 z-50 w-full h-full flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-4">
            <Cropper
              src={image}
              style={{ height: 400, width: 400 }}
              aspectRatio={1}
              guides={false}
              ref={cropperRef}
              viewMode={1}
              responsive={true}
              autoCropArea={1}
            />
            <div className="flex justify-around mt-4">
              <button
                className="px-4 py-2 bg-green-500 text-white rounded"
                onClick={getCropData}
              >
                Crop Image
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageCropper;
