
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from 'react-oidc-context';

function App() {
  const auth = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState({});
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setError(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("No file selected.");
      return;
    }
    
    if (!auth.isAuthenticated || !auth.user?.id_token) {
      setError("Please sign in to upload files.");
      return;
    }

    setLoading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      // Updated API endpoint for auth check
      await axios.get('https://ganeshsilla.software/api/auth-check', {
        headers: {
          Authorization: `Bearer ${auth.user?.id_token}`,
        }
      });

      // Updated API endpoint for upload
      const res = await axios.post('https://ganeshsilla.software/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${auth.user?.id_token}`,
        }
      });

      console.log('Upload success:', res.data);
      setUploadResult(res.data.url);
      setSelectedFile(null);
      fetchUserFiles();
    } catch (err) {
      console.error('Upload failed:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Unknown error';
      setError(`Upload failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserFiles = async () => {
    if (!auth.isAuthenticated || !auth.user?.id_token) return;
    
    setLoading(true);
    try {
      const res = await axios.get('https://ganeshsilla.software/api/my-files', {
        headers: {
          Authorization: `Bearer ${auth.user?.id_token}`,
        }
      });

      setFiles(res.data);
    } catch (err) {
      console.error('Failed to fetch files:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Unknown error';
      setError(`Failed to fetch files: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (fileId) => {
    if (!auth.isAuthenticated || !auth.user?.id_token) {
      setError("Please sign in to delete files.");
      return;
    }

    // Mark this specific file as loading
    setDeleteLoading(prev => ({ ...prev, [fileId]: true }));
    setError(null);

    try {
      await axios.delete(`https://ganeshsilla.software/api/files/${fileId}`, {
        headers: {
          Authorization: `Bearer ${auth.user?.id_token}`,
        }
      });

      console.log(`File ${fileId} deleted successfully`);
      
      // Remove the file from the list
      setFiles(prev => prev.filter(file => file.fileId !== fileId));
      
      // If the deleted file was the one that was just uploaded, clear the upload result
      if (uploadResult && files.find(f => f.fileId === fileId)?.fileUrl === uploadResult) {
        setUploadResult(null);
      }
    } catch (err) {
      console.error('Delete failed:', err);
      const errorMessage = err.response?.data?.error || 
                        err.response?.data?.details || 
                        err.message || 
                        'Unknown error';
      setError(`Delete failed: ${errorMessage}`);
    } finally {
      // Clear the loading state for this file
      setDeleteLoading(prev => ({ ...prev, [fileId]: false }));
    }
  };

  useEffect(() => {
    if (auth.isAuthenticated && auth.user?.id_token) {
      fetchUserFiles();
    }
  }, [auth.isAuthenticated, auth.user?.id_token]);

  const signOutRedirect = () => {
    const clientId = "2lokd7f8a5tetaeamk775g32ha";
    const logoutUri = "https://main.dlicpw3zl70pz.amplifyapp.com/";  // Added trailing slash
    const cognitoDomain = "https://us-east-1klktfctyz.auth.us-east-1.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(logoutUri)}`;
  };

  const clearError = () => setError(null);

  if (auth.isLoading) return <div>Loading authentication...</div>;
  if (auth.error) return <div>Authentication Error: {auth.error.message}</div>;

  return auth.isAuthenticated ? (
    <div style={{ 
      padding: '2rem', 
      fontFamily: 'system-ui, -apple-system, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto',
      background: 'linear-gradient(135deg, #f0f4f8 0%, #e2eaf2 100%)',
      minHeight: '100vh'
    }}>
      <h1 style={{ 
        fontSize: '2.8rem', 
        background: 'linear-gradient(135deg, #2c5282, #4299e1)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '2.5rem' 
      }}>Welcome, {auth.user?.profile.email}</h1>
      
      <div style={{ 
        marginBottom: '2rem', 
        padding: '2.5rem', 
        backgroundColor: 'rgba(255, 255, 255, 0.8)', 
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e2e8f0'
      }}>
        <h3 style={{ 
          fontSize: '1.8rem', 
          color: '#2d3748',
          marginBottom: '2rem',
          fontWeight: '600'
        }}>Upload New File</h3>
        <input 
          type="file" 
          onChange={handleFileChange}
          style={{ 
            marginBottom: '1.5rem',
            width: '100%',
            padding: '1rem',
            border: '2px dashed #cbd5e0',
            borderRadius: '8px',
            backgroundColor: '#f8fafc'
          }}
        />
        <button 
          onClick={handleUpload}
          disabled={loading || !selectedFile}
          style={{
            padding: '0.75rem 2rem',
            background: loading || !selectedFile 
              ? '#94a3b8'
              : 'linear-gradient(135deg, #4CAF50, #45a049)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: loading || !selectedFile ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            fontSize: '1.1rem',
            fontWeight: '600',
            boxShadow: '0 4px 12px rgba(76, 175, 80, 0.2)'
          }}
        >
          {loading ? 'Uploading...' : 'Upload'}
        </button>
        
        {error && (
          <div style={{ 
            color: 'white',
            backgroundColor: '#f44336',
            padding: '0.75rem',
            marginTop: '1rem',
            borderRadius: '4px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>{error}</span>
            <button 
              onClick={clearError}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                fontSize: '1.2rem',
                fontWeight: 'bold'
              }}
            >
              ✕
            </button>
          </div>
        )}

        {uploadResult && (
          <div style={{ marginTop: '1rem', padding: '0.5rem', backgroundColor: '#e0f7fa', borderRadius: '4px' }}>
            <p><strong>Upload Successful!</strong></p>
            <a href={uploadResult} target="_blank" rel="noreferrer">{uploadResult}</a>
          </div>
        )}
      </div>

      <div style={{ 
        marginTop: '2rem',
        display: 'flex',
        gap: '1.5rem'
      }}>
        <button 
          onClick={() => auth.removeUser()}
          style={{
            padding: '0.75rem 2rem',
            background: 'linear-gradient(135deg, #f56565, #e53e3e)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontSize: '1.1rem',
            fontWeight: '600',
            boxShadow: '0 4px 12px rgba(245, 101, 101, 0.2)'
          }}
        >
          Sign out (local)
        </button>
        <button 
          onClick={signOutRedirect} 
          style={{ 
            padding: '0.75rem 2rem',
            background: 'linear-gradient(135deg, #ed8936, #dd6b20)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontSize: '1.1rem',
            fontWeight: '600',
            boxShadow: '0 4px 12px rgba(237, 137, 54, 0.2)'
          }}
        >
          Full Sign out
        </button>
      </div>

      <h2 style={{ 
        fontSize: '2.2rem',
        background: 'linear-gradient(135deg, #2c5282, #4299e1)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginTop: '3.5rem',
        marginBottom: '2rem'
      }}>Your Files</h2>
      
      {loading ? (
        <p style={{ 
          fontSize: '1.2rem', 
          color: '#4a5568',
          textAlign: 'center',
          padding: '2rem'
        }}>Loading files...</p>
      ) : files.length > 0 ? (
        <ul style={{ 
          listStyleType: 'none', 
          padding: 0,
          display: 'grid',
          gap: '1.5rem'
        }}>
          {files.map((file) => (
            <li key={file.fileId} style={{ 
              padding: '1.5rem',
              borderRadius: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
              border: '1px solid rgba(226, 232, 240, 0.8)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              transition: 'all 0.3s ease',
              ':hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 24px rgba(0, 0, 0, 0.08)',
                backgroundColor: 'rgba(255, 255, 255, 0.9)'
              }
            }}>
              <div>
                <a 
                  href={file.fileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    color: '#4299e1',
                    textDecoration: 'none',
                    fontSize: '1.2rem',
                    fontWeight: '600'
                  }}
                >
                  {file.fileName} ({file.fileType})
                </a>
                <span style={{ 
                  marginLeft: '1.5rem', 
                  color: '#718096', 
                  fontSize: '1rem'
                }}>
                  {new Date(file.uploadTime).toLocaleString()}
                </span>
              </div>
              <button
                onClick={() => handleDelete(file.fileId)}
                disabled={deleteLoading[file.fileId]}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: deleteLoading[file.fileId] 
                    ? '#94a3b8'
                    : 'linear-gradient(135deg, #f56565, #e53e3e)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: deleteLoading[file.fileId] ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  fontSize: '1rem',
                  fontWeight: '600',
                  boxShadow: '0 4px 12px rgba(245, 101, 101, 0.2)'
                }}
              >
                {deleteLoading[file.fileId] ? 'Deleting...' : 'Delete'}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ 
          fontSize: '1.2rem', 
          color: '#4a5568',
          textAlign: 'center',
          padding: '3rem',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          border: '1px solid rgba(226, 232, 240, 0.8)'
        }}>No files found.</p>
      )}
    </div>
  ) : (
    <div style={{ 
      padding: '6rem 2rem',
      textAlign: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      maxWidth: '800px',
      margin: '0 auto',
      marginTop: '4rem',
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(240, 244, 248, 0.9))',
      backdropFilter: 'blur(10px)',
      borderRadius: '24px',
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
    }}>
      <h1 style={{ 
        fontSize: '3.5rem',
        background: 'linear-gradient(135deg, #2c5282, #4299e1)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '2rem'
      }}>File Sharing App</h1>
      <p style={{ 
        fontSize: '1.4rem',
        color: '#4a5568',
        marginBottom: '3rem',
        lineHeight: '1.6'
      }}>Please sign in to upload and manage your files.</p>
      <button 
        onClick={() => auth.signinRedirect()}
        style={{
          padding: '1.25rem 3rem',
          background: 'linear-gradient(135deg, #4299e1, #2c5282)',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          cursor: 'pointer',
          fontSize: '1.2rem',
          fontWeight: '600',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 20px rgba(66, 153, 225, 0.3)'
        }}
      >
        Sign in
      </button>
    </div>
  );
}

export default App;