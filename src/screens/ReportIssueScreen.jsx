import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ChevronLeft } from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import './ReportIssueScreen.css';

// Same constants from the RN app
const SUPABASE_URL = "https://lsywslcxfdsdsdskqukzvrvhoi.supabase.co";
const SUPABASE_SECRET_KEY = 'eyJhbGcsiOiJIUzI1NidsdsdIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5d3NsY3hmc2txdWt6dnJ2aG9pIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTAzNjA3MywiZXhwIjoyMDU0NjEyMDczfQ.Kw1H2Sq3cdHJqEP9Mnz49a-FJQIFs4J0hTVf2hbVCX0'; 
const BUCKET_NAME = "app_2222_downloading";

const ReportIssueScreen = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('');
  const [screenshot, setScreenshot] = useState(null); // File object
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setScreenshot(e.target.files[0]);
    }
  };

  const uploadImageToSupabase = async () => {
    if (!screenshot) return null;

    try {
      const fileExt = screenshot.name.split('.').pop() || 'jpg';
      const fileName = `uploads/${Date.now()}.${fileExt}`;

      // Using the standard Web FormData API
      const formData = new FormData();
      formData.append('file', screenshot);

      const response = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET_NAME}/${fileName}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SUPABASE_SECRET_KEY}`,
          // Don't set Content-Type, fetch will set it automatically with boundary for FormData
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${fileName}`;
    } catch (error) {
      console.error("Supabase Upload Error:", error);
      return null;
    }
  };

  const submitIssue = async () => {
    if (!description.trim() || rating === 0) {
      showModal("Please enter feedback and select a rating.");
      return;
    }
    
    setLoading(true);
    let imageUrl = await uploadImageToSupabase();

    try {
      const reportData = {
        description,
        rating,
        subject: subject || 'No Subject',
        timestamp: new Date().toISOString(),
        screenshot: imageUrl || null,
      };

      // Using firestore from web SDK
      await setDoc(doc(db, 'issues', reportData.subject), reportData);
      
      showModal("Your feedback has been submitted.");
      setDescription('');
      setSubject('');
      setScreenshot(null);
      setRating(0);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      showModal("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  const showModal = (message) => {
    setModalMessage(message);
    setModalVisible(true);
  };

  return (
    <div className="report-container">
      {/* Custom Header for Back Navigation */}
      <div className="report-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ChevronLeft size={32} color="var(--primary)" />
        </button>
        <span className="report-title font-semibold">Feedback & Support</span>
      </div>

      <div className="report-content">
        <span className="report-label font-medium">Rate Us:</span>
        <div className="star-container">
          {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} className="star-btn" onClick={() => setRating(star)}>
              <Star 
                size={32} 
                color="var(--orange)" 
                fill={star <= rating ? "var(--orange)" : "none"} 
              />
            </button>
          ))}
        </div>

        <input
          className="report-input font-medium"
          placeholder="Enter Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        <textarea
          className="report-input report-textarea font-medium"
          placeholder="Describe your issue or feedback..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Hidden File Input */}
        <input 
          type="file" 
          accept="image/*" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          onChange={handleImageChange} 
        />

        {screenshot && (
          <span className="image-name font-medium">
            Selected Image: {screenshot.name}
          </span>
        )}

        <button 
          className="report-btn bg-primary" 
          onClick={() => fileInputRef.current?.click()}
        >
          <span className="report-btn-text font-semibold">
            {screenshot ? 'Change Screenshot' : 'Upload Screenshot'}
          </span>
        </button>

        <button 
          className="report-btn bg-orange" 
          onClick={submitIssue} 
          disabled={loading}
        >
          {loading ? (
            <div className="report-spinner"></div>
          ) : (
            <span className="report-btn-text font-semibold">Submit Feedback</span>
          )}
        </button>
      </div>

      {/* Modal */}
      {modalVisible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <span className="modal-text font-medium">{modalMessage}</span>
            <button className="modal-btn bg-orange" onClick={() => setModalVisible(false)}>
              <span className="modal-btn-text font-semibold">OK</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportIssueScreen;
