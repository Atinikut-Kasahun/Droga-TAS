import React, { useState, useMemo, useRef, useEffect } from 'react';


const PriorityIcon = ({ level }) => {
  const p = (level || '').toLowerCase();
  if (p === 'urgent') {
    return (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" style={{ color: '#FF5630' }}>
        <rect x="1" y="11" width="2" height="4" rx="0.5" />
        <rect x="5" y="8" width="2" height="7" rx="0.5" />
        <rect x="9" y="4" width="2" height="11" rx="0.5" />
        <rect x="13" y="1" width="2" height="14" rx="0.5" />
      </svg>
    );
  }
  if (p === 'high') {
    return (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" style={{ color: '#FFAB00' }}>
        <rect x="1" y="11" width="2" height="4" rx="0.5" />
        <rect x="5" y="8" width="2" height="7" rx="0.5" />
        <rect x="9" y="4" width="2" height="11" rx="0.5" />
        <rect x="13" y="1" width="2" height="14" rx="0.5" opacity="0.2" />
      </svg>
    );
  }
  if (p === 'medium') {
    return (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" style={{ color: '#0052CC' }}>
        <rect x="1" y="11" width="2" height="4" rx="0.5" />
        <rect x="5" y="8" width="2" height="7" rx="0.5" />
        <rect x="9" y="4" width="2" height="11" rx="0.5" opacity="0.2" />
        <rect x="13" y="1" width="2" height="14" rx="0.5" opacity="0.2" />
      </svg>
    );
  }
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" style={{ color: '#6B778C' }}>
      <rect x="1" y="11" width="2" height="4" rx="0.5" />
      <rect x="5" y="8" width="2" height="7" rx="0.5" opacity="0.2" />
      <rect x="9" y="4" width="2" height="11" rx="0.5" opacity="0.2" />
      <rect x="13" y="1" width="2" height="14" rx="0.5" opacity="0.2" />
    </svg>
  );
};

export default function TalentAcquisitionDashboard({
  currentUser,
  handleLogout,
  applicants,
  setApplicants,
  interviews,
  setInterviews,
  companies,
  users,
  onSwitchStyle,
  jobs,
  setJobs
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('jobs'); // 'jobs', 'pipeline', 'inbox', 'my-tasks'
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals state
  const [isNewJobOpen, setIsNewJobOpen] = useState(false);
  const [isNewCandidateOpen, setIsNewCandidateOpen] = useState(false);
  const [activeJobMenu, setActiveJobMenu] = useState(null); // job action menu open job id
  const [editingJobId, setEditingJobId] = useState(null);
  
  // Forms state
  const [newJob, setNewJob] = useState({
    title: '',
    dept: 'Engineering',
    location: 'Bole',
    type: 'Full Time',
    health: 'on-track',
    priority: 'medium',
    lead: currentUser?.name || 'Mena',
    targetDate: 'Jun 15th',
    fillRate: 0
  });

  const [newCandidate, setNewCandidate] = useState({
    name: '',
    appliedPosition: '',
    stage: 'Initial Review',
    recruiter: currentUser?.name || 'Mena',
    proLevel: 8,
    date: 'Just now'
  });

  // Active Dropdowns/Popovers State
  const [activePopover, setActivePopover] = useState(null); 
  const popoverRef = useRef(null);

  
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setActivePopover(null);
        setActiveJobMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.dept.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [jobs, searchQuery]);

  const filteredCandidates = useMemo(() => {
    return interviews.filter(c => 
      c.candidate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.appliedPosition.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [interviews, searchQuery]);

  
  const recruitersList = ['Mena', 'Kudeva', 'Hns Hns', 'zeatgo'];

  
  const updateJobProperty = (jobId, property, value) => {
    const updated = jobs.map(j => {
      if (j.id === jobId) {
        return { ...j, [property]: value };
      }
      return j;
    });
    setJobs(updated);
    setActivePopover(null);
  };

  
  const updateCandidateProperty = (candidateId, property, value) => {
    const updated = interviews.map(c => {
      if (c.id === candidateId) {
        return { ...c, [property]: value };
      }
      return c;
    });
    setInterviews(updated);
    setActivePopover(null);
  };

  
  const handleCreateJob = (e) => {
    e.preventDefault();
    if (!newJob.title) return;

    if (editingJobId) {
      const updated = jobs.map(j => j.id === editingJobId ? { ...j, ...newJob, id: editingJobId } : j);
      setJobs(updated);
      setEditingJobId(null);
    } else {
      const added = {
        ...newJob,
        id: Date.now(),
        candidatesCount: 0
      };
      setJobs([added, ...jobs]);
    }

    setIsNewJobOpen(false);
    setNewJob({
      title: '',
      dept: 'Engineering',
      location: 'Bole',
      type: 'Full Time',
      health: 'on-track',
      priority: 'medium',
      lead: currentUser?.name || 'Mena',
      targetDate: 'Jun 15th',
      fillRate: 0
    });
  };

  const openEditJob = (job) => {
    setEditingJobId(job.id);
    setNewJob({
      title: job.title,
      dept: job.dept,
      location: job.location,
      type: job.type,
      health: job.health,
      priority: job.priority,
      lead: job.lead,
      targetDate: job.targetDate,
      fillRate: job.fillRate || 0
    });
    setIsNewJobOpen(true);
    setActiveJobMenu(null);
  };

  const deleteJob = (jobId) => {
    setJobs(jobs.filter(j => j.id !== jobId));
    setActiveJobMenu(null);
  };

  const repostJob = (job) => {
    const reposted = {
      ...job,
      id: Date.now(),
      candidatesCount: 0,
      fillRate: 0
    };
    setJobs([reposted, ...jobs]);
    setActiveJobMenu(null);
  };

  
  const handleCreateCandidate = (e) => {
    e.preventDefault();
    if (!newCandidate.name || !newCandidate.appliedPosition) return;
    const added = {
      id: Date.now(),
      candidate: newCandidate.name,
      appliedPosition: newCandidate.appliedPosition,
      stage: newCandidate.stage,
      type: 'Technical Exam',
      date: 'Just now',
      status: 'pending',
      proLevel: parseInt(newCandidate.proLevel) || 8,
      recruiter: newCandidate.recruiter
    };
    setInterviews([added, ...interviews]);
    setIsNewCandidateOpen(false);
    setNewCandidate({
      name: '',
      appliedPosition: '',
      stage: 'Initial Review',
      recruiter: currentUser?.name || 'Mena',
      proLevel: 8,
      date: 'Just now'
    });
  };

  
  const hiredCount = interviews.filter(c => c.stage === 'Hired').length;
  const cycleTarget = 10;
  const cyclePercent = Math.min(100, Math.round((hiredCount / cycleTarget) * 100));

  return (
    <div className="linear-dashboard">
      
      {}
      <div className={`linear-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        
        {/* Sidebar Header */}
        <div className="linear-sidebar-header">
          <div className="linear-workspace-trigger" onClick={() => setActiveTab('jobs')}>
            <img src="/logo.svg" alt="Droga Group" width="22" height="22" style={{ display: 'block', borderRadius: '4px' }} />
            {!sidebarCollapsed && <span style={{ letterSpacing: '-0.3px' }}>Droga Group TA</span>}
          </div>
          <button 
            className="linear-sidebar-action-btn"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {sidebarCollapsed ? <path d="M9 18l6-6-6-6" /> : <path d="M15 19l-7-7 7-7" />}
            </svg>
          </button>
        </div>

        {/* Sidebar Actions */}
        {!sidebarCollapsed && (
          <div style={{ padding: '8px 12px 0 12px', display: 'flex', gap: '8px' }}>
            <button 
              className="linear-btn linear-btn-primary" 
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '6px 10px', fontSize: '12px', background: '#FFF200', color: '#172B4D', borderColor: '#DDD900' }}
              onClick={() => setIsNewCandidateOpen(true)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              New Candidate
            </button>
            <button 
              className="linear-btn linear-btn-secondary" 
              style={{ padding: '6px 8px' }} 
              title="Add Job Post"
              onClick={() => setIsNewJobOpen(true)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            </button>
          </div>
        )}

        {/* Sidebar Navigation */}
        <div className="linear-sidebar-nav">
          <div className="linear-nav-group">
            <div className={`linear-nav-item ${activeTab === 'inbox' ? 'active' : ''}`} onClick={() => setActiveTab('inbox')}>
              <div className="linear-nav-item-left">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                {!sidebarCollapsed && <span>Inbox</span>}
              </div>
              {!sidebarCollapsed && <span className="linear-kanban-card-count" style={{ backgroundColor: '#FF5630', color: '#fff' }}>2</span>}
            </div>
            
            <div className={`linear-nav-item ${activeTab === 'my-tasks' ? 'active' : ''}`} onClick={() => setActiveTab('my-tasks')}>
              <div className="linear-nav-item-left">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
                {!sidebarCollapsed && <span>My Tasks</span>}
              </div>
              {!sidebarCollapsed && <span className="linear-kanban-card-count">4</span>}
            </div>
          </div>

          <div className="linear-nav-group">
            {!sidebarCollapsed && <div className="linear-nav-group-title">Workspace</div>}
            
            <div className={`linear-nav-item ${activeTab === 'jobs' ? 'active' : ''}`} onClick={() => setActiveTab('jobs')}>
              <div className="linear-nav-item-left">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
                {!sidebarCollapsed && <span>Active Postings</span>}
              </div>
              {!sidebarCollapsed && <span className="linear-kanban-card-count">{jobs.length}</span>}
            </div>

            <div className={`linear-nav-item ${activeTab === 'pipeline' ? 'active' : ''}`} onClick={() => setActiveTab('pipeline')}>
              <div className="linear-nav-item-left">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="9" />
                  <rect x="14" y="3" width="7" height="5" />
                  <rect x="14" y="12" width="7" height="9" />
                  <rect x="3" y="16" width="7" height="5" />
                </svg>
                {!sidebarCollapsed && <span>Candidates</span>}
              </div>
              {!sidebarCollapsed && <span className="linear-kanban-card-count">{interviews.length}</span>}
            </div>
          </div>

          <div className="linear-nav-group">
            {!sidebarCollapsed && <div className="linear-nav-group-title">Your Teams</div>}
            
            <div className="linear-nav-item" onClick={() => setActiveTab('pipeline')}>
              <div className="linear-nav-item-left">
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#36B37E' }} />
                {!sidebarCollapsed && <span>Pharma HR</span>}
              </div>
            </div>

            <div className="linear-nav-item" onClick={() => setActiveTab('pipeline')}>
              <div className="linear-nav-item-left">
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0052CC' }} />
                {!sidebarCollapsed && <span>Diagnostics HR</span>}
              </div>
            </div>

            <div className="linear-nav-item" onClick={() => setActiveTab('pipeline')}>
              <div className="linear-nav-item-left">
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#FFAB00' }} />
                {!sidebarCollapsed && <span>Corporate TA</span>}
              </div>
            </div>
          </div>

          <div className="linear-nav-group">
            {!sidebarCollapsed && <div className="linear-nav-group-title">Cycles</div>}
            <div className="linear-nav-item" onClick={() => setActiveTab('pipeline')}>
              <div className="linear-nav-item-left" style={{ gap: '6px' }}>
                <svg width="14" height="14" viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)', marginRight: '2px' }}>
                  <circle cx="18" cy="18" r="16" fill="none" stroke="#EBECF0" strokeWidth="4" />
                  <circle cx="18" cy="18" r="16" fill="none" stroke="#0052CC" strokeWidth="4" 
                    strokeDasharray="100" strokeDashoffset={100 - cyclePercent} />
                </svg>
                {!sidebarCollapsed && <span>Q2 Cycle (Sprint 20)</span>}
              </div>
              {!sidebarCollapsed && <span style={{ fontSize: '11px', color: '#6B778C', fontWeight: 600 }}>{cyclePercent}%</span>}
            </div>
          </div>
        </div>

        {/* Sidebar Footer Profile */}
        <div className="linear-sidebar-footer">
          <div className="linear-footer-profile">
            <div className="linear-footer-avatar">
              {currentUser?.name ? currentUser.name.substring(0, 2).toUpperCase() : 'TA'}
            </div>
            {!sidebarCollapsed && (
              <div className="linear-footer-info">
                <span className="linear-footer-name">{currentUser?.name || 'Recruiter User'}</span>
                <span className="linear-footer-role">{currentUser?.role === 'hr' ? 'TA Recruiter' : 'Admin'}</span>
              </div>
            )}
          </div>
          
          {!sidebarCollapsed && (
            <button className="linear-sidebar-action-btn" title="Log Out" onClick={handleLogout}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* CONTENT WRAPPER */}
      <div className="linear-content-wrapper">
        
        {/* TOPBAR */}
        <div className="linear-topbar">
          <div className="linear-topbar-left">
            <span className="linear-topbar-title">
              {activeTab === 'jobs' && 'Active Positions'}
              {activeTab === 'pipeline' && 'Talent Pipeline Board'}
              {activeTab === 'inbox' && 'Recruitment Alerts'}
              {activeTab === 'my-tasks' && 'My Tasks checklist'}
            </span>

            {activeTab === 'jobs' && (
              <div className="linear-topbar-tabs">
                <span className="linear-topbar-tab active">All Openings</span>
                <span className="linear-topbar-tab">Drafts</span>
                <span className="linear-topbar-tab">Archived</span>
              </div>
            )}
            {activeTab === 'pipeline' && (
              <div className="linear-topbar-tabs">
                <span className="linear-topbar-tab active">Kanban Pipeline</span>
                <span className="linear-topbar-tab">List Grid</span>
              </div>
            )}
          </div>

          <div className="linear-topbar-right">
            {/* Search Box */}
            <div className="linear-search-box">
              <svg className="linear-search-icon" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input 
                type="text" 
                placeholder={activeTab === 'jobs' ? "Search positions..." : "Search candidates..."}
                className="linear-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Switch to Admin Dashboard Toggle */}
            <button className="linear-switch-style-btn" onClick={onSwitchStyle} title="Switch to Atlassian admin dashboard">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              Jira Admin View
            </button>
          </div>
        </div>

        {/* MAIN VIEW */}
        <div className="linear-main-view">
          
          {/* VIEW: ACTIVE POSTINGS (PROJECTS) */}
          {activeTab === 'jobs' && (
            <div>
              <table className="linear-table">
                <thead>
                  <tr>
                    <th style={{ width: '35%' }}>Position Name</th>
                    <th>Health</th>
                    <th>Priority</th>
                    <th>Recruiter Lead</th>
                    <th>Target Date</th>
                    <th>Candidates</th>
                    <th>Fill Rate</th>
                    <th style={{ width: '60px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredJobs.map((job) => {
                    const matchCount = interviews.filter(c => c.appliedPosition.toLowerCase() === job.title.toLowerCase()).length;
                    const candidatesCount = matchCount || job.candidatesCount || 0;
                    
                    return (
                      <tr className="linear-table-row" key={job.id}>
                        {/* Position Name */}
                        <td className="linear-project-name-cell">
                          <div className="linear-project-icon-wrapper">
                            <span>{job.title.substring(0, 2).toUpperCase()}</span>
                          </div>
                          <div>
                            <div style={{ fontWeight: 600 }}>{job.title}</div>
                            <div style={{ fontSize: '11px', color: '#6B778C' }}>{job.dept} · {job.location}</div>
                          </div>
                        </td>

                        {/* Health Selector */}
                        <td>
                          <div className="linear-popover-anchor">
                            <button 
                              className={`linear-badge-health ${(job.health || 'on-track').toLowerCase().replace(' ', '-')}`}
                              onClick={(e) => { e.stopPropagation(); setActivePopover({ type: 'health', id: job.id }); }}
                            >
                              <div className={`linear-health-dot ${(job.health || 'on-track').toLowerCase().replace(' ', '-')}`} />
                              {job.health === 'on-track' && 'On Track'}
                              {job.health === 'at-risk' && 'At Risk'}
                              {job.health === 'off-track' && 'Off Track'}
                              {job.health === 'no-updates' && 'No Updates'}
                            </button>

                            {activePopover && activePopover.type === 'health' && activePopover.id === job.id && (
                              <div className="linear-popover-menu" ref={popoverRef}>
                                <div className="linear-popover-item active" onClick={() => updateJobProperty(job.id, 'health', 'on-track')}>On Track</div>
                                <div className="linear-popover-item" onClick={() => updateJobProperty(job.id, 'health', 'at-risk')}>At Risk</div>
                                <div className="linear-popover-item" onClick={() => updateJobProperty(job.id, 'health', 'off-track')}>Off Track</div>
                                <div className="linear-popover-item" onClick={() => updateJobProperty(job.id, 'health', 'no-updates')}>No Updates</div>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Priority Selector */}
                        <td>
                          <div className="linear-popover-anchor">
                            <button 
                              className="linear-popover-trigger" 
                              onClick={(e) => { e.stopPropagation(); setActivePopover({ type: 'priority', id: job.id }); }}
                              title="Change priority"
                            >
                              <PriorityIcon level={job.priority} />
                              <span style={{ fontSize: '12px', textTransform: 'capitalize' }}>{job.priority || 'medium'}</span>
                            </button>
                            {activePopover && activePopover.type === 'priority' && activePopover.id === job.id && (
                              <div className="linear-popover-menu" ref={popoverRef}>
                                <div className="linear-popover-item" onClick={() => updateJobProperty(job.id, 'priority', 'urgent')}>Urgent</div>
                                <div className="linear-popover-item" onClick={() => updateJobProperty(job.id, 'priority', 'high')}>High</div>
                                <div className="linear-popover-item" onClick={() => updateJobProperty(job.id, 'priority', 'medium')}>Medium</div>
                                <div className="linear-popover-item" onClick={() => updateJobProperty(job.id, 'priority', 'low')}>Low</div>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Recruiter Lead Selector */}
                        <td>
                          <div className="linear-popover-anchor">
                            <button 
                              className="linear-popover-trigger"
                              onClick={(e) => { e.stopPropagation(); setActivePopover({ type: 'lead', id: job.id }); }}
                            >
                              <div className="linear-footer-avatar" style={{ width: '20px', height: '20px', fontSize: '9px' }}>
                                {job.lead ? job.lead.substring(0, 2).toUpperCase() : 'LE'}
                              </div>
                              <span style={{ fontSize: '13px' }}>{job.lead || 'Assign'}</span>
                            </button>
                            {activePopover && activePopover.type === 'lead' && activePopover.id === job.id && (
                              <div className="linear-popover-menu" ref={popoverRef}>
                                {recruitersList.map(rec => (
                                  <div className="linear-popover-item" key={rec} onClick={() => updateJobProperty(job.id, 'lead', rec)}>
                                    {rec}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Target Date Selector */}
                        <td>
                          <div className="linear-popover-anchor">
                            <button 
                              className={`linear-badge-date ${job.health === 'off-track' ? 'overdue' : ''}`}
                              onClick={(e) => { e.stopPropagation(); setActivePopover({ type: 'date', id: job.id }); }}
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
                                <line x1="3" y1="10" x2="21" y2="10" />
                              </svg>
                              {job.targetDate || 'No date'}
                            </button>
                            {activePopover && activePopover.type === 'date' && activePopover.id === job.id && (
                              <div className="linear-popover-menu" ref={popoverRef} style={{ width: '200px', padding: '8px' }}>
                                <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '6px', padding: '0 4px' }}>Quick Dates</div>
                                <div className="linear-popover-item" onClick={() => updateJobProperty(job.id, 'targetDate', 'May 28th')}>Next Week</div>
                                <div className="linear-popover-item" onClick={() => updateJobProperty(job.id, 'targetDate', 'Jun 15th')}>Mid-June</div>
                                <div className="linear-popover-item" onClick={() => updateJobProperty(job.id, 'targetDate', 'Jul 1st')}>July 1st</div>
                                <div className="linear-popover-item" onClick={() => updateJobProperty(job.id, 'targetDate', 'Aug 31st')}>End of Aug</div>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Candidates count */}
                        <td style={{ fontWeight: 600, paddingLeft: '24px' }}>
                          <span 
                            style={{ cursor: 'pointer', textDecoration: 'underline', color: '#0052CC' }}
                            onClick={() => {
                              setSearchQuery(job.title);
                              setActiveTab('pipeline');
                            }}
                          >
                            {candidatesCount}
                          </span>
                        </td>

                        {/* Fill Rate Progress Ring */}
                        <td>
                          <div className="linear-progress-cell">
                            <svg width="24" height="24" viewBox="0 0 36 36" className="linear-progress-ring-svg">
                              <circle cx="18" cy="18" r="16" fill="none" stroke="#EBECF0" strokeWidth="4" />
                              <circle cx="18" cy="18" r="16" fill="none" stroke="#36B37E" strokeWidth="4" 
                                strokeDasharray="100" strokeDashoffset={100 - (job.fillRate || 0)} />
                            </svg>
                            <div className="linear-popover-anchor">
                              <button 
                                className="linear-popover-trigger"
                                onClick={(e) => { e.stopPropagation(); setActivePopover({ type: 'fillRate', id: job.id }); }}
                              >
                                <span style={{ fontWeight: 600, fontSize: '12px' }}>{job.fillRate || 0}%</span>
                              </button>
                              {activePopover && activePopover.type === 'fillRate' && activePopover.id === job.id && (
                                <div className="linear-popover-menu" ref={popoverRef}>
                                  <div className="linear-popover-item" onClick={() => updateJobProperty(job.id, 'fillRate', 0)}>0% (Not started)</div>
                                  <div className="linear-popover-item" onClick={() => updateJobProperty(job.id, 'fillRate', 25)}>25% (Sourcing)</div>
                                  <div className="linear-popover-item" onClick={() => updateJobProperty(job.id, 'fillRate', 50)}>50% (Interviews)</div>
                                  <div className="linear-popover-item" onClick={() => updateJobProperty(job.id, 'fillRate', 75)}>75% (Offer stage)</div>
                                  <div className="linear-popover-item" onClick={() => updateJobProperty(job.id, 'fillRate', 100)}>100% (Filled)</div>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td style={{ textAlign: 'right', position: 'relative' }}>
                          <button
                            type="button"
                            className="linear-icon-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveJobMenu(activeJobMenu === job.id ? null : job.id);
                            }}
                            title="More actions"
                            style={{ background: 'transparent', border: 'none', color: '#6B778C', cursor: 'pointer', padding: '8px', fontSize: '18px' }}
                          >
                            ⋮
                          </button>
                          {activeJobMenu === job.id && (
                            <div className="linear-popover-menu" ref={popoverRef} style={{ right: 0, left: 'auto' }}>
                              <div className="linear-popover-item" onClick={() => openEditJob(job)}>Edit job</div>
                              <div className="linear-popover-item" onClick={() => deleteJob(job.id)}>Delete job</div>
                              <div className="linear-popover-item" onClick={() => repostJob(job)}>Repost job</div>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* VIEW: PIPELINE BOARD */}
          {activeTab === 'pipeline' && (
            <div className="linear-kanban-board">
              
              {/* Columns */}
              {['Initial Review', 'Testing Phase', 'Final Round', 'Hired', 'Rejected'].map(stage => {
                const stageCandidates = filteredCandidates.filter(c => c.stage === stage);
                
                return (
                  <div className="linear-kanban-column" key={stage}>
                    <div className="linear-kanban-column-header">
                      <div className="linear-kanban-column-title">
                        <div style={{ 
                          width: '8px', 
                          height: '8px', 
                          borderRadius: '50%', 
                          backgroundColor: 
                            stage === 'Hired' ? '#36B37E' : 
                            stage === 'Rejected' ? '#FF5630' : 
                            stage === 'Final Round' ? '#0052CC' : 
                            stage === 'Testing Phase' ? '#FFAB00' : '#8993A4'
                        }} />
                        <span>{stage}</span>
                      </div>
                      <span className="linear-kanban-card-count">{stageCandidates.length}</span>
                    </div>

                    <div className="linear-kanban-cards-wrapper">
                      {stageCandidates.map(cand => (
                        <div className="linear-kanban-card" key={cand.id}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <span className="linear-kanban-card-title">{cand.candidate}</span>
                            
                            {/* Candidate Stage Selector */}
                            <div className="linear-popover-anchor">
                              <button 
                                className="linear-popover-trigger"
                                style={{ padding: '2px', border: '1px solid #DFE1E6', borderRadius: '3px' }}
                                onClick={(e) => { e.stopPropagation(); setActivePopover({ type: 'candStage', id: cand.id }); }}
                              >
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                  <path d="M12 5v14M5 12h14" />
                                </svg>
                              </button>
                              {activePopover && activePopover.type === 'candStage' && activePopover.id === cand.id && (
                                <div className="linear-popover-menu" ref={popoverRef} style={{ right: 0, left: 'auto' }}>
                                  <div className="linear-popover-item" onClick={() => updateCandidateProperty(cand.id, 'stage', 'Initial Review')}>Initial Review</div>
                                  <div className="linear-popover-item" onClick={() => updateCandidateProperty(cand.id, 'stage', 'Testing Phase')}>Testing Phase</div>
                                  <div className="linear-popover-item" onClick={() => updateCandidateProperty(cand.id, 'stage', 'Final Round')}>Final Round</div>
                                  <div className="linear-popover-item" onClick={() => updateCandidateProperty(cand.id, 'stage', 'Hired')}>Hired</div>
                                  <div className="linear-popover-item" onClick={() => updateCandidateProperty(cand.id, 'stage', 'Rejected')}>Rejected</div>
                                </div>
                              )}
                            </div>
                          </div>

                          <div style={{ fontSize: '12px', color: '#42526E', fontWeight: 500 }}>
                            {cand.appliedPosition}
                          </div>

                          <div className="linear-kanban-card-tags">
                            <span className="linear-kanban-card-tag">Level {cand.proLevel || 8}</span>
                            <span className="linear-kanban-card-tag" style={{ backgroundColor: 'rgba(255, 242, 0, 0.1)', color: '#998a00' }}>
                              {cand.type || 'Exam'}
                            </span>
                          </div>

                          <div className="linear-kanban-card-meta">
                            <div className="linear-footer-profile" style={{ gap: '4px' }}>
                              <div className="linear-footer-avatar" style={{ width: '16px', height: '16px', fontSize: '8px' }}>
                                {cand.recruiter ? cand.recruiter.substring(0,2).toUpperCase() : 'ME'}
                              </div>
                              <span style={{ fontSize: '10px' }}>{cand.recruiter || 'Mena'}</span>
                            </div>
                            <span style={{ fontSize: '10px', color: '#8993A4' }}>{cand.date}</span>
                          </div>
                        </div>
                      ))}
                      {stageCandidates.length === 0 && (
                        <div style={{ padding: '24px 8px', textAlign: 'center', fontSize: '12px', color: '#6B778C', border: '1.5px dashed #EBECF0', borderRadius: '4px' }}>
                          No candidates
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* VIEW: INBOX */}
          {activeTab === 'inbox' && (
            <div className="linear-inbox-view">
              <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>Inbox Notifications</div>
              
              <div className="linear-inbox-card unread">
                <div className="linear-inbox-avatar">JS</div>
                <div className="linear-inbox-content">
                  <div className="linear-inbox-title">John Smith submitted Technical Exam</div>
                  <div className="linear-inbox-text">Candidate John Smith completed their Written assessment for the Senior Developer opening and scored 92%. Review is pending.</div>
                  <div className="linear-inbox-meta">5 hours ago · HR Assessment System</div>
                </div>
              </div>

              <div className="linear-inbox-card unread">
                <div className="linear-inbox-avatar" style={{ backgroundColor: '#0052CC', color: '#fff' }}>MC</div>
                <div className="linear-inbox-content">
                  <div className="linear-inbox-title">Interview Scheduled: Mike Chen</div>
                  <div className="linear-inbox-text">Final Round Interview scheduled for Mike Chen (UX Designer) on May 24th, 2:30 PM with Lead Designer Zeatgo.</div>
                  <div className="linear-inbox-meta">Yesterday · Calendar Sync</div>
                </div>
              </div>

              <div className="linear-inbox-card">
                <div className="linear-inbox-avatar" style={{ backgroundColor: '#FCEE23', color: '#172B4D' }}>DW</div>
                <div className="linear-inbox-content">
                  <div className="linear-inbox-title">New Application: David Wilson</div>
                  <div className="linear-inbox-text">David Wilson applied for the DevOps Engineer role from the Droga Group Career portal. Sourced from Bole area.</div>
                  <div className="linear-inbox-meta">2 days ago · Career Site</div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: MY TASKS */}
          {activeTab === 'my-tasks' && (
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
              <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>My Recruitment Tasks Checklist</div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { id: 1, done: false, task: 'Evaluate John Smith\'s Senior Developer Written Exam', desc: 'Verify solution structure and code efficiency.', date: 'Due today' },
                  { id: 2, done: false, task: 'Prepare offer package for Sarah Johnson', desc: 'Associate PM candidate, target salary in the $120,000 range.', date: 'Due tomorrow' },
                  { id: 3, done: true, task: 'Conduct initial screening call for Lisa Anderson', desc: 'Data Analyst candidate from Kebena. Profile looks strong.', date: 'Completed yesterday' },
                  { id: 4, done: false, task: 'Sync with Hiring Managers on UX Designer pipeline updates', desc: 'Identify target hire date adjustments.', date: 'Due May 25th' }
                ].map(t => (
                  <div 
                    key={t.id} 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      gap: '12px', 
                      padding: '12px 16px', 
                      backgroundColor: '#FAFBFC', 
                      border: '1px solid #DFE1E6', 
                      borderRadius: '6px',
                      opacity: t.done ? 0.6 : 1
                    }}
                  >
                    <input 
                      type="checkbox" 
                      defaultChecked={t.done} 
                      style={{ marginTop: '3px', cursor: 'pointer', width: '16px', height: '16px', accentColor: '#0052CC' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, textDecoration: t.done ? 'line-through' : 'none' }}>{t.task}</div>
                      <div style={{ fontSize: '12px', color: '#6B778C', marginTop: '2px' }}>{t.desc}</div>
                      <span style={{ fontSize: '10px', fontWeight: 600, color: t.done ? '#36B37E' : '#FF5630', display: 'inline-block', marginTop: '6px' }}>
                        {t.date}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* MODAL: CREATE JOB POSITION */}
      {isNewJobOpen && (
        <div className="linear-modal-overlay">
          <div className="linear-modal">
            <div className="linear-modal-header">
              <span>{editingJobId ? 'Edit Active Job Posting' : 'Create Active Job Posting'}</span>
              <button
                className="linear-modal-close"
                onClick={() => {
                  setIsNewJobOpen(false);
                  setEditingJobId(null);
                  setNewJob({
                    title: '',
                    dept: 'Engineering',
                    location: 'Bole',
                    type: 'Full Time',
                    health: 'on-track',
                    priority: 'medium',
                    lead: currentUser?.name || 'Mena',
                    targetDate: 'Jun 15th',
                    fillRate: 0
                  });
                }}
              >×</button>
            </div>
            <form onSubmit={handleCreateJob}>
              <div className="linear-modal-body">
                <div className="linear-form-group">
                  <label className="linear-form-label">Position Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Senior Software Engineer"
                    className="linear-form-input"
                    value={newJob.title}
                    onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="linear-form-group">
                    <label className="linear-form-label">Department</label>
                    <select 
                      className="linear-form-select"
                      value={newJob.dept}
                      onChange={(e) => setNewJob({ ...newJob, dept: e.target.value })}
                    >
                      <option value="Engineering">Engineering</option>
                      <option value="Product">Product</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Sales">Sales</option>
                      <option value="Design">Design</option>
                    </select>
                  </div>
                  
                  <div className="linear-form-group">
                    <label className="linear-form-label">Location</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Bole"
                      className="linear-form-input"
                      value={newJob.location}
                      onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="linear-form-group">
                    <label className="linear-form-label">Job Type</label>
                    <select 
                      className="linear-form-select"
                      value={newJob.type}
                      onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
                    >
                      <option value="Full Time">Full Time</option>
                      <option value="Part Time">Part Time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>
                  
                  <div className="linear-form-group">
                    <label className="linear-form-label">Recruiter Lead</label>
                    <select 
                      className="linear-form-select"
                      value={newJob.lead}
                      onChange={(e) => setNewJob({ ...newJob, lead: e.target.value })}
                    >
                      {recruitersList.map(rec => (
                        <option key={rec} value={rec}>{rec}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="linear-form-group">
                    <label className="linear-form-label">Target Fill Date</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Jun 15th"
                      className="linear-form-input"
                      value={newJob.targetDate}
                      onChange={(e) => setNewJob({ ...newJob, targetDate: e.target.value })}
                    />
                  </div>
                  
                  <div className="linear-form-group">
                    <label className="linear-form-label">Priority</label>
                    <select 
                      className="linear-form-select"
                      value={newJob.priority}
                      onChange={(e) => setNewJob({ ...newJob, priority: e.target.value })}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="linear-modal-footer">
                <button type="button" className="linear-btn linear-btn-secondary" onClick={() => {
                  setIsNewJobOpen(false);
                  setEditingJobId(null);
                  setNewJob({
                    title: '',
                    dept: 'Engineering',
                    location: 'Bole',
                    type: 'Full Time',
                    health: 'on-track',
                    priority: 'medium',
                    lead: currentUser?.name || 'Mena',
                    targetDate: 'Jun 15th',
                    fillRate: 0
                  });
                }}>Cancel</button>
                <button type="submit" className="linear-btn linear-btn-primary">
                  {editingJobId ? 'Save changes' : 'Post Role'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD CANDIDATE */}
      {isNewCandidateOpen && (
        <div className="linear-modal-overlay">
          <div className="linear-modal">
            <div className="linear-modal-header">
              <span>Add New Candidate Profile</span>
              <button className="linear-modal-close" onClick={() => setIsNewCandidateOpen(false)}>×</button>
            </div>
            <form onSubmit={handleCreateCandidate}>
              <div className="linear-modal-body">
                <div className="linear-form-group">
                  <label className="linear-form-label">Candidate Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Abebe Balcha"
                    className="linear-form-input"
                    value={newCandidate.name}
                    onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
                    required
                  />
                </div>

                <div className="linear-form-group">
                  <label className="linear-form-label">Apply for Position</label>
                  <select 
                    className="linear-form-select"
                    value={newCandidate.appliedPosition}
                    onChange={(e) => setNewCandidate({ ...newCandidate, appliedPosition: e.target.value })}
                    required
                  >
                    <option value="">-- Select active posting --</option>
                    {jobs.map(j => (
                      <option key={j.id} value={j.title}>{j.title}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="linear-form-group">
                    <label className="linear-form-label">Initial Stage</label>
                    <select 
                      className="linear-form-select"
                      value={newCandidate.stage}
                      onChange={(e) => setNewCandidate({ ...newCandidate, stage: e.target.value })}
                    >
                      <option value="Initial Review">Initial Review</option>
                      <option value="Testing Phase">Testing Phase</option>
                      <option value="Final Round">Final Round</option>
                      <option value="Hired">Hired</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>

                  <div className="linear-form-group">
                    <label className="linear-form-label">Professional Level (1-10)</label>
                    <input 
                      type="number" 
                      min="1"
                      max="10"
                      className="linear-form-input"
                      value={newCandidate.proLevel}
                      onChange={(e) => setNewCandidate({ ...newCandidate, proLevel: e.target.value })}
                    />
                  </div>
                </div>

                <div className="linear-form-group">
                  <label className="linear-form-label">Assign Recruiter</label>
                  <select 
                    className="linear-form-select"
                    value={newCandidate.recruiter}
                    onChange={(e) => setNewCandidate({ ...newCandidate, recruiter: e.target.value })}
                  >
                    {recruitersList.map(rec => (
                      <option key={rec} value={rec}>{rec}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="linear-modal-footer">
                <button type="button" className="linear-btn linear-btn-secondary" onClick={() => setIsNewCandidateOpen(false)}>Cancel</button>
                <button type="submit" className="linear-btn linear-btn-primary">Add Candidate</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
