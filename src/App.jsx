/*This project serves as a simple Project Management Tool that helps users organize and track
 their projects. It provides a way to manage various aspects of each project, such as 
 updating project names, descriptions, and status. This app uses localStorage to save the 
 project data, meaning that even if the user refreshes the page, their data remains intact.*/

 import React, { useState, useEffect } from 'react';
 import { HashRouter as Router, Route, Routes, Link, useNavigate, useParams } from 'react-router-dom';
 import './App.css';
 
 // Retrieve projects from localStorage
 const getStoredProjects = () => {
   const storedProjects = localStorage.getItem('projects');
   return storedProjects ? JSON.parse(storedProjects) : [];
 };
 
 // Project Dashboard Component
 const Dashboard = () => {
   const [projects, setProjects] = useState(getStoredProjects);
   const navigate = useNavigate();
 
   useEffect(() => {
     localStorage.setItem('projects', JSON.stringify(projects));
   }, [projects]);
 
   const addProject = () => {
     const newProject = {
       id: projects.length + 1,
       name: `Project ${projects.length + 1}`,
       description: 'A newly created project',
       status: 'Not Started'
     };
     setProjects([...projects, newProject]);
   };
 
   const updateProject = (id, key, value) => {
     setProjects(projects.map(project => (project.id === id ? { ...project, [key]: value } : project)));
   };
 
   const deleteProject = (id) => {
     setProjects(projects.filter(project => project.id !== id));
   };
 
   return (
     <div className="dashboard">
       <h1>Project Dashboard</h1>
       <button onClick={addProject} className="add-btn">Add New Project</button>
       <div className="project-list">
         {projects.map(project => (
           <div key={project.id} className="project-card">
             <input
               type="text"
               value={project.name}
               onChange={(e) => updateProject(project.id, 'name', e.target.value)}
               className="project-input"
             />
             <textarea
               value={project.description}
               onChange={(e) => updateProject(project.id, 'description', e.target.value)}
               className="project-textarea"
             />
             <p><strong>Status:</strong> {project.status}</p>
             <select
               value={project.status}
               onChange={(e) => updateProject(project.id, 'status', e.target.value)}
               className="status-select"
             >
               <option value="Not Started">Not Started</option>
               <option value="In Progress">In Progress</option>
               <option value="Completed">Completed</option>
             </select>
             <button onClick={() => navigate(`/project/${project.id}`)} className="details-btn">View Details</button>
             <button onClick={() => deleteProject(project.id)} className="delete-btn">Delete</button>
           </div>
         ))}
       </div>
     </div>
   );
 };
 
 // Project Details Component
 const ProjectDetails = ({ id }) => {
   const project = getStoredProjects().find(proj => proj.id === Number(id));
 
   if (!project) {
     return <p>Project not found</p>;
   }
 
   return (
     <div className="project-details">
       <h1>{project.name}</h1>
       <p><strong>Description:</strong> {project.description}</p>
       <p><strong>Status:</strong> {project.status}</p>
       <Link to="/">Back to Dashboard</Link>
     </div>
   );
 };
 
 
 // Main App Component
 const App = () => {
   return (
     <Router>
       <div className="App">
         <Routes>
           <Route path="/" element={<Dashboard />} />
           <Route path="/project/:id" element={<ProjectWrapper />} />
         </Routes>
       </div>
     </Router>
   );
 };
 
 // Wrapper for accessing route params
 const ProjectWrapper = () => {
   const { id } = useParams();
   return <ProjectDetails id={id} />;
 };
 
 export default App;
 
