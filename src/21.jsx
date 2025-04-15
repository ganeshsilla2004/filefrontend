// import React, { useState } from 'react';
// import axios from 'axios';

// function App() {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [uploadResult, setUploadResult] = useState(null);

//   const handleFileChange = (e) => {
//     setSelectedFile(e.target.files[0]);
//   };

//   const handleUpload = async () => {
//     if (!selectedFile) return alert("No file selected.");

//     const formData = new FormData();
//     formData.append("file", selectedFile);

//     try {
//       const res = await axios.post('http://localhost:5001/api/upload', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });

//       console.log('Upload success:', res.data);
//       setUploadResult(res.data.url);
//     } catch (err) {
//       console.error('Upload failed', err);
//       alert('Upload failed');
//     }
//   };

//   return (
//     <div style={{ padding: '2rem' }}>
//       <h1>File Sharing App</h1>
//       <input type="file" onChange={handleFileChange} />
//       <button onClick={handleUpload}>Upload</button>

//       {uploadResult && (
//         <div style={{ marginTop: '20px' }}>
//           <p>Uploaded File URL:</p>
//           <a href={uploadResult} target="_blank" rel="noreferrer">{uploadResult}</a>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;
// version 2

// import React, { useState } from 'react';
// import axios from 'axios';
// import { useAuth } from 'react-oidc-context';

// function App() {
//   const auth = useAuth();
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [uploadResult, setUploadResult] = useState(null);

//   const handleFileChange = (e) => {
//     setSelectedFile(e.target.files[0]);
//   };

//   const handleUpload = async () => {
//     if (!selectedFile) return alert("No file selected.");
//     if (!auth.isAuthenticated) return alert("Please sign in to upload files.");

//     const formData = new FormData();
//     formData.append("file", selectedFile);

//     try {
//       const res = await axios.post('http://localhost:5001/api/upload', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           Authorization: `Bearer ${auth.user?.access_token}`,
//         }
//       });

//       console.log('Upload success:', res.data);
//       setUploadResult(res.data.url);
//     } catch (err) {
//       console.error('Upload failed', err);
//       alert('Upload failed');
//     }
//   };

//   const signOutRedirect = () => {
//     const clientId = "2lokd7f8a5tetaeamk775g32ha";
//     const logoutUri = "http://localhost:5173";
//     const cognitoDomain = "https://your-cognito-domain.auth.us-east-1.amazoncognito.com"; // replace this
//     window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
//   };

//   if (auth.isLoading) return <div>Loading...</div>;
//   if (auth.error) return <div>Error: {auth.error.message}</div>;

//   return auth.isAuthenticated ? (
//     <div style={{ padding: '2rem' }}>
//       <h1>Welcome, {auth.user?.profile.email}</h1>

//       <input type="file" onChange={handleFileChange} />
//       <button onClick={handleUpload}>Upload</button>

//       {uploadResult && (
//         <div style={{ marginTop: '20px' }}>
//           <p>Uploaded File URL:</p>
//           <a href={uploadResult} target="_blank" rel="noreferrer">{uploadResult}</a>
//         </div>
//       )}

//       <div style={{ marginTop: '2rem' }}>
//         <button onClick={() => auth.removeUser()}>Sign out (local)</button>
//         <button onClick={signOutRedirect} style={{ marginLeft: '1rem' }}>Full Sign out</button>
//       </div>
//     </div>
//   ) : (
//     <div style={{ padding: '2rem' }}>
//       <h1>File Sharing App</h1>
//       <button onClick={() => auth.signinRedirect()}>Sign in</button>
//     </div>
//   );
// }

// export default App;
// version 5
// import React, { useState } from 'react';
// import axios from 'axios';
// import { useAuth } from 'react-oidc-context';

// function App() {
//   const auth = useAuth();
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [uploadResult, setUploadResult] = useState(null);
//   const [files, setFiles] = useState([]);

//   const handleFileChange = (e) => {
//     setSelectedFile(e.target.files[0]);
//   };

//   const handleUpload = async () => {
//     if (!selectedFile) return alert("No file selected.");
//     if (!auth.isAuthenticated) return alert("Please sign in to upload files.");

//     const formData = new FormData();
//     formData.append("file", selectedFile);

//     try {
//       const res = await axios.post('http://localhost:5001/api/upload', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           Authorization: `Bearer ${auth.user?.access_token}`,
//         }
//       });

//       console.log('Upload success:', res.data);
//       setUploadResult(res.data.url);
//       fetchUserFiles();
//     } catch (err) {
//       console.error('Upload failed', err);
//       alert('Upload failed');
//     }
//   };

//   const fetchUserFiles = async () => {
//     try {
//       const res = await axios.get('http://localhost:5001/api/files', {
//         headers: {
//           Authorization: `Bearer ${auth.user?.access_token}`,
//         }
//       });

//       setFiles(res.data);
//     } catch (err) {
//       console.error('Failed to fetch files', err);
//       alert('Failed to fetch files');
//     }
//   };

//   const signOutRedirect = () => {
//     const clientId = "2lokd7f8a5tetaeamk775g32ha";
//     const logoutUri = "http://localhost:5173";
//     const cognitoDomain = "https://file-share-test.auth.us-east-1.amazoncognito.com"; // replace this
//     window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
//   };

//   if (auth.isLoading) return <div>Loading...</div>;
//   if (auth.error) return <div>Error: {auth.error.message}</div>;

//   return auth.isAuthenticated ? (
//     <div style={{ padding: '2rem' }}>
//       <h1>Welcome, {auth.user?.profile.email}</h1>

//       <input type="file" onChange={handleFileChange} />
//       <button onClick={handleUpload}>Upload</button>

//       {uploadResult && (
//         <div style={{ marginTop: '20px' }}>
//           <p>Uploaded File URL:</p>
//           <a href={uploadResult} target="_blank" rel="noreferrer">{uploadResult}</a>
//         </div>
//       )}

//       <div style={{ marginTop: '2rem' }}>
//         <button onClick={() => auth.removeUser()}>Sign out (local)</button>
//         <button onClick={signOutRedirect} style={{ marginLeft: '1rem' }}>Full Sign out</button>
//       </div>

//       <h2>Your Files</h2>
//       <ul>
//         {files.map((file) => (
//           <li key={file.fileId.S}>
//             <a href={file.fileUrl.S} target="_blank" rel="noopener noreferrer">
//               {file.fileName.S}
//             </a>
//           </li>
//         ))}
//       </ul>
//     </div>
//   ) : (
//     <div style={{ padding: '2rem' }}>
//       <h1>File Sharing App</h1>
//       <button onClick={() => auth.signinRedirect()}>Sign in</button>
//     </div>
//   );
// }

// export default App;

// version 6
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useAuth } from 'react-oidc-context';

// function App() {
//   const auth = useAuth();
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [uploadResult, setUploadResult] = useState(null);
//   const [files, setFiles] = useState([]);

//   const handleFileChange = (e) => {
//     setSelectedFile(e.target.files[0]);
//   };

//   const handleUpload = async () => {
//     if (!selectedFile) return alert("No file selected.");
//     if (!auth.isAuthenticated) return alert("Please sign in to upload files.");

//     const formData = new FormData();
//     formData.append("file", selectedFile);

//     try {
//       const res = await axios.post('http://localhost:5001/api/upload', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           Authorization: `Bearer ${auth.user?.access_token}`,
//         }
//       });

//       console.log('Upload success:', res.data);
//       setUploadResult(res.data.url);
//       fetchUserFiles();
//     } catch (err) {
//       console.error('Upload failed:', err);
//       alert(`Upload failed: ${err.response?.data?.error || 'Unknown error'}`);
//     }
//   };

//   const fetchUserFiles = async () => {
//     try {
//       const res = await axios.get('http://localhost:5001/api/my-files', {
//         headers: {
//           Authorization: `Bearer ${auth.user?.access_token}`,
//         }
//       });

//       setFiles(res.data);
//     } catch (err) {
//       console.error('Failed to fetch files:', err);
//       alert('Failed to fetch files');
//     }
//   };

//   useEffect(() => {
//     if (auth.isAuthenticated) {
//       fetchUserFiles();
//     }
//   }, [auth.isAuthenticated]);

//   const signOutRedirect = () => {
//     const clientId = "2lokd7f8a5tetaeamk775g32ha";
//     const logoutUri = "http://localhost:5173";
//     const cognitoDomain = "https://file-share-test.auth.us-east-1.amazoncognito.com";
//     window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
//   };

//   if (auth.isLoading) return <div>Loading...</div>;
//   if (auth.error) return <div>Error: {auth.error.message}</div>;

//   return auth.isAuthenticated ? (
//     <div style={{ padding: '2rem' }}>
//       <h1>Welcome, {auth.user?.profile.email}</h1>

//       <input type="file" onChange={handleFileChange} />
//       <button onClick={handleUpload}>Upload</button>

//       {uploadResult && (
//         <div style={{ marginTop: '20px' }}>
//           <p>Uploaded File URL:</p>
//           <a href={uploadResult} target="_blank" rel="noreferrer">{uploadResult}</a>
//         </div>
//       )}

//       <div style={{ marginTop: '2rem' }}>
//         <button onClick={() => auth.removeUser()}>Sign out (local)</button>
//         <button onClick={signOutRedirect} style={{ marginLeft: '1rem' }}>Full Sign out</button>
//       </div>

//       <h2>Your Files</h2>
//       <ul>
//         {files.map((file) => (
//           <li key={file.fileId.S}>
//             <a href={file.fileUrl.S} target="_blank" rel="noopener noreferrer">
//               {file.fileName.S}
//             </a>
//           </li>
//         ))}
//       </ul>
//     </div>
//   ) : (
//     <div style={{ padding: '2rem' }}>
//       <h1>File Sharing App</h1>
//       <button onClick={() => auth.signinRedirect()}>Sign in</button>
//     </div>
//   );
// }

// export default App;
//new version

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useAuth } from 'react-oidc-context';

// function App() {
//   const auth = useAuth();
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [uploadResult, setUploadResult] = useState(null);
//   const [files, setFiles] = useState([]);



//   const handleFileChange = (e) => {
//     setSelectedFile(e.target.files[0]);
//   };

//   const handleUpload = async () => {
//     if (!selectedFile) return alert("No file selected.");
//     if (!auth.isAuthenticated) return alert("Please sign in to upload files.");

//     const formData = new FormData();
//     formData.append("file", selectedFile);

//     // Log FormData to verify if the file is set
//     console.log("FormData content:", formData);

//     try {
//       const res = await axios.post('http://localhost:5001/api/upload', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           Authorization: `Bearer ${auth.user?.access_token}`,
//         }
//       });

//       console.log('Upload success:', res.data);
//       setUploadResult(res.data.url);
//       fetchUserFiles();
//     } catch (err) {
//       console.error('Upload failed:', err);
//       alert(`Upload failed: ${err.response?.data?.error || 'Unknown error'}`);
//     }
//   };

//   const fetchUserFiles = async () => {
//     try {
//       const res = await axios.get('http://localhost:5001/api/my-files', {
//         headers: {
//           Authorization: `Bearer ${auth.user?.access_token}`,
//         }
//       });

//       setFiles(res.data);
//     } catch (err) {
//       console.error('Failed to fetch files:', err);
//       alert('Failed to fetch files');
//     }
//   };

//   useEffect(() => {
//     if (auth.isAuthenticated) {
//       fetchUserFiles();
//     }
//   }, [auth.isAuthenticated]);

//   const signOutRedirect = () => {
//     const clientId = "2lokd7f8a5tetaeamk775g32ha";
//     const logoutUri = "http://localhost:5173";
//     const cognitoDomain = "https://file-share-test.auth.us-east-1.amazoncognito.com";
//     window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
//   };

//   if (auth.isLoading) return <div>Loading...</div>;
//   if (auth.error) return <div>Error: {auth.error.message}</div>;

//   return auth.isAuthenticated ? (
//     <div style={{ padding: '2rem' }}>
//       <h1>Welcome, {auth.user?.profile.email}</h1>

//       <input type="file" onChange={handleFileChange} />
//       <button onClick={handleUpload}>Upload</button>

//       {uploadResult && (
//         <div style={{ marginTop: '20px' }}>
//           <p>Uploaded File URL:</p>
//           <a href={uploadResult} target="_blank" rel="noreferrer">{uploadResult}</a>
//         </div>
//       )}

//       <div style={{ marginTop: '2rem' }}>
//         <button onClick={() => auth.removeUser()}>Sign out (local)</button>
//         <button onClick={signOutRedirect} style={{ marginLeft: '1rem' }}>Full Sign out</button>
//       </div>

//       <h2>Your Files</h2>
//       <ul>
//         {files.map((file) => (
//           <li key={file.fileId.S}>
//             <a href={file.fileUrl.S} target="_blank" rel="noopener noreferrer">
//               {file.fileName.S}
//             </a>
//           </li>
//         ))}
//       </ul>
//     </div>
//   ) : (
//     <div style={{ padding: '2rem' }}>
//       <h1>File Sharing App</h1>
//       <button onClick={() => auth.signinRedirect()}>Sign in</button>
//     </div>
//   );
// }

// export default App;



// final version

import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useAuth } from 'react-oidc-context';

// function App() {
//   const auth = useAuth();
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [uploadResult, setUploadResult] = useState(null);
//   const [files, setFiles] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [deleteLoading, setDeleteLoading] = useState({});
//   const [error, setError] = useState(null);

//   const handleFileChange = (e) => {
//     setSelectedFile(e.target.files[0]);
//     setError(null);
//   };

//   const handleUpload = async () => {
//     if (!selectedFile) {
//       setError("No file selected.");
//       return;
//     }
    
//     if (!auth.isAuthenticated || !auth.user?.id_token) {
//       setError("Please sign in to upload files.");
//       return;
//     }

//     setLoading(true);
//     setError(null);
    
//     const formData = new FormData();
//     formData.append("file", selectedFile);

//     try {
//       // First, check if authentication is working
//       await axios.get('http://localhost:5001/api/auth-check', {
//         headers: {
//           Authorization: `Bearer ${auth.user?.id_token}`,
//         }
//       });

//       // Then proceed with upload
//       const res = await axios.post('http://localhost:5001/api/upload', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           Authorization: `Bearer ${auth.user?.id_token}`,
//         }
//       });

//       console.log('Upload success:', res.data);
//       setUploadResult(res.data.url);
//       setSelectedFile(null);
//       fetchUserFiles();
//     } catch (err) {
//       console.error('Upload failed:', err);
//       const errorMessage = err.response?.data?.error || 'Unknown error';
//       setError(`Upload failed: ${errorMessage}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchUserFiles = async () => {
//     if (!auth.isAuthenticated || !auth.user?.id_token) return;
    
//     setLoading(true);
//     try {
//       const res = await axios.get('http://localhost:5001/api/my-files', {
//         headers: {
//           Authorization: `Bearer ${auth.user?.id_token}`,
//         }
//       });

//       setFiles(res.data);
//     } catch (err) {
//       console.error('Failed to fetch files:', err);
//       setError('Failed to fetch files');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (fileId) => {
//     if (!auth.isAuthenticated || !auth.user?.id_token) {
//       setError("Please sign in to delete files.");
//       return;
//     }

//     setDeleteLoading(prev => ({ ...prev, [fileId]: true }));
//     setError(null);

//     try {
//       await axios.delete(`http://localhost:5001/api/files/${fileId}`, {
//         headers: {
//           Authorization: `Bearer ${auth.user?.id_token}`,
//         }
//       });

//       // Remove the file from the list
//       setFiles(prev => prev.filter(file => file.fileId !== fileId));
//       setUploadResult(null); // Clear upload result if it was this file
//     } catch (err) {
//       console.error('Delete failed:', err);
//       const errorMessage = err.response?.data?.error || 'Unknown error';
//       setError(`Delete failed: ${errorMessage}`);
//     } finally {
//       setDeleteLoading(prev => ({ ...prev, [fileId]: false }));
//     }
//   };

//   useEffect(() => {
//     if (auth.isAuthenticated && auth.user?.id_token) {
//       fetchUserFiles();
//     }
//   }, [auth.isAuthenticated, auth.user?.id_token]);

//   const signOutRedirect = () => {
//     const clientId = "2lokd7f8a5tetaeamk775g32ha";
//     const logoutUri = "http://localhost:5173";
//     const cognitoDomain = "https://file-share-test.auth.us-east-1.amazoncognito.com";
//     window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
//   };

//   if (auth.isLoading) return <div>Loading authentication...</div>;
//   if (auth.error) return <div>Authentication Error: {auth.error.message}</div>;

//   return auth.isAuthenticated ? (
//     <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
//       <h1>Welcome, {auth.user?.profile.email}</h1>
      
//       <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
//         <h3>Upload New File</h3>
//         <input 
//           type="file" 
//           onChange={handleFileChange}
//           style={{ marginBottom: '1rem' }}
//         />
//         <button 
//           onClick={handleUpload}
//           disabled={loading || !selectedFile}
//           style={{
//             padding: '0.5rem 1rem',
//             backgroundColor: '#4CAF50',
//             color: 'white',
//             border: 'none',
//             borderRadius: '4px',
//             cursor: loading || !selectedFile ? 'not-allowed' : 'pointer'
//           }}
//         >
//           {loading ? 'Uploading...' : 'Upload'}
//         </button>
        
//         {error && (
//           <div style={{ color: 'red', marginTop: '1rem' }}>
//             {error}
//           </div>
//         )}

//         {uploadResult && (
//           <div style={{ marginTop: '1rem', padding: '0.5rem', backgroundColor: '#e0f7fa', borderRadius: '4px' }}>
//             <p><strong>Upload Successful!</strong></p>
//             <a href={uploadResult} target="_blank" rel="noreferrer">{uploadResult}</a>
//           </div>
//         )}
//       </div>

//       <div style={{ marginTop: '2rem' }}>
//         <button 
//           onClick={() => auth.removeUser()}
//           style={{
//             padding: '0.5rem 1rem',
//             backgroundColor: '#f44336',
//             color: 'white',
//             border: 'none',
//             borderRadius: '4px',
//             cursor: 'pointer'
//           }}
//         >
//           Sign out (local)
//         </button>
//         <button 
//           onClick={signOutRedirect} 
//           style={{ 
//             marginLeft: '1rem',
//             padding: '0.5rem 1rem',
//             backgroundColor: '#f44336',
//             color: 'white',
//             border: 'none',
//             borderRadius: '4px',
//             cursor: 'pointer'
//           }}
//         >
//           Full Sign out
//         </button>
//       </div>

//       <h2>Your Files</h2>
//       {loading ? (
//         <p>Loading files...</p>
//       ) : files.length > 0 ? (
//         <ul style={{ listStyleType: 'none', padding: 0 }}>
//           {files.map((file) => (
//             <li key={file.fileId} style={{ 
//               marginBottom: '0.5rem', 
//               padding: '0.5rem', 
//               borderBottom: '1px solid #eee',
//               display: 'flex',
//               justifyContent: 'space-between',
//               alignItems: 'center'
//             }}>
//               <div>
//                 <a 
//                   href={file.fileUrl} 
//                   target="_blank" 
//                   rel="noopener noreferrer"
//                   style={{ color: '#2196F3', textDecoration: 'none' }}
//                 >
//                   {file.fileName} ({file.fileType})
//                 </a>
//                 <span style={{ marginLeft: '1rem', color: '#757575', fontSize: '0.9rem' }}>
//                   {new Date(file.uploadTime).toLocaleString()}
//                 </span>
//               </div>
//               <button
//                 onClick={() => handleDelete(file.fileId)}
//                 disabled={deleteLoading[file.fileId]}
//                 style={{
//                   padding: '0.25rem 0.5rem',
//                   backgroundColor: '#f44336',
//                   color: 'white',
//                   border: 'none',
//                   borderRadius: '4px',
//                   cursor: deleteLoading[file.fileId] ? 'not-allowed' : 'pointer'
//                 }}
//               >
//                 {deleteLoading[file.fileId] ? 'Deleting...' : 'Delete'}
//               </button>
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>No files found.</p>
//       )}
//     </div>
//   ) : (
//     <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
//       <h1>File Sharing App</h1>
//       <p>Please sign in to upload and manage your files.</p>
//       <button 
//         onClick={() => auth.signinRedirect()}
//         style={{
//           padding: '0.75rem 1.5rem',
//           backgroundColor: '#2196F3',
//           color: 'white',
//           border: 'none',
//           borderRadius: '4px',
//           cursor: 'pointer',
//           fontSize: '1rem'
//         }}
//       >
//         Sign in
//       </button>
//     </div>
//   );
// }

// export default App;