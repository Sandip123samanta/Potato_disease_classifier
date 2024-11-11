import React, { useState, useRef } from 'react';
import { LuUploadCloud } from 'react-icons/lu';
import { FaFileImage } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import axios from 'axios';
import PredictionCard from './PredictionCard';
import SkeletonLoder from './SkeletonLoder';
import './style.css';

function Uploader() {
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [diseaseclass, setDiseaseClass] = useState(null);
  const [confidance, setConfidance] = useState(null);
  const [cancelTokenSource, setCancelTokenSource] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFilePreview(URL.createObjectURL(selectedFile));
    clearPrediction();
    console.log('File selected:', selectedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      setFilePreview(URL.createObjectURL(droppedFile));
      clearPrediction();
      e.dataTransfer.clearData();
      console.log('File dropped:', droppedFile);
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleDelete = () => {
    setFile(null);
    setFilePreview(null);
    clearPrediction();
    console.log('File deleted');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    const VITE_API_URL =
      'https://potato-disease-classifier-backend-latest.onrender.com';
    const formData = new FormData();
    formData.append('file', file);
    clearPrediction();
    const source = axios.CancelToken.source();
    setCancelTokenSource(source);

    setLoading(true);
    try {
      const apiUrl = VITE_API_URL.endsWith('/predict')
        ? VITE_API_URL
        : `${VITE_API_URL}/predict`;

      const response = await axios.post(apiUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        cancelToken: source.token,
      });

      const data = response.data;
      setDiseaseClass(data.class);
      setConfidance(data.confidence);
      setLoading(false);
      console.log('Upload completed');
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Request canceled:', error.message);
      } else {
        console.log('Upload error:', error);
        alert('There was an error with your request.');
      }
      setLoading(false);
    }
  };

  const clearPrediction = () => {
    setConfidance(null);
    setDiseaseClass(null);
  };

  const handleCancel = () => {
    if (cancelTokenSource) {
      cancelTokenSource.cancel('User canceled the request');
      setLoading(false);
    }
  };

  return (
    <div className="upload-container text-white flex flex-col items-center justify-center md:mt-5 mt-0 overflow-x-hidden">
      <div className="w-[30em] text-center">
        <h1 className="text-xl md:text-2xl font-bold mb-3 text-green-200">
          Potato Disease Classfier
        </h1>
        <h1 className="upload-text text-[1.7em] md:text-[2em] leading-7 font-bold">
          Upload Potato Leaf for Fast,
          <br />
          Accurate Results
        </h1>
        <div className="w-full text-center">
          <p className="text-[#d8ecf8be] mt-4 leading-5 mb-5 text-[.7em] md:text-[1em]">
            Our AI will analyze it and provide a prediction upon it,
            <br /> if it's Early Blight, Late Blight or Healthy.
          </p>
        </div>
      </div>

      <div
        className={`w-[20em] h-[15em] md:w-[30em] md:h-[20em] border-[2px] border-dashed rounded-sm cursor-pointer flex items-center justify-center hover:border-blue-500 hover:bg-gray-900 ${
          dragging ? 'border-blue-500 bg-gray-900' : 'border-[#d8ecf8be]'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        {filePreview ? (
          <img
            src={filePreview}
            alt="Preview"
            className="max-w-full max-h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center">
            <LuUploadCloud size={40} />
            <p className="text-gray-400">drag & drop or click to upload</p>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
          style={{ display: 'none' }}
        />
      </div>

      {file && (
        <div className="w-[20em] md:w-[30em] flex justify-between items-center p-3 mt-4 text-left border border-white rounded-md hover:bg-gray-900">
          <div className="flex h-full w-auto items-center gap-4">
            <FaFileImage size={30} />
            <div className="">
              <p className="text-gray-400 line-clamp-1 font-bold">
                {file.name}
              </p>
              <p className="text-gray-400 font-bold">
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
          </div>
          <button onClick={handleDelete}>
            <RiDeleteBin6Line size={20} />
          </button>
        </div>
      )}

      {loading && (
        <div className="mt-5">
          <div className="loader mt-2">
            <SkeletonLoder />
          </div>
          <div className="mt-5 text-center mb-5">
            <button
              className="font-bold border border-white px-4 py-2 rounded-full hover:bg-red-500 transition duration-300"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {confidance && (
        <div className="mt-5 flex flex-col items-center">
          <PredictionCard
            confidance={confidance}
            diseaseClass={diseaseclass}
            subImage={filePreview}
          />
        </div>
      )}

      {file && !loading && (
        <button
          type="submit"
          onClick={handleSubmit}
          className="mt-5 mb-5 font-bold border border-white px-4 py-2 rounded-full hover:bg-blue-500 transition duration-300"
          disabled={loading}
        >
          Get Prediction
        </button>
      )}
    </div>
  );
}

export default Uploader;
