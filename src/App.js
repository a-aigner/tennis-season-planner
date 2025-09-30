import React, { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Download, Plus, Trash2, MapPin, Home, RotateCcw, Settings, Users, GripVertical, Sun, Moon, ChevronDown, ChevronUp } from 'lucide-react';
import { ThemeProvider, useTheme } from './ThemeContext';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './App.css';

// Sortable Player Row Component
const SortablePlayerRow = ({ player, updatePlayer, deletePlayer, calculateParticipation }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: player.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <tr 
      ref={setNodeRef} 
      style={style}
      className={`player-row ${isDragging ? 'dragging' : ''}`}
    >
      <td className="drag-handle-cell">
        <button
          className="drag-handle"
          {...attributes}
          {...listeners}
          title="Drag to reorder"
        >
          <GripVertical size={14} />
        </button>
      </td>
      <td className="name-cell">
        <div className="name-inputs">
          <input
            type="text"
            value={player.firstName}
            onChange={(e) => updatePlayer(player.id, 'firstName', e.target.value)}
            className="name-input first-name"
            placeholder="First Name"
          />
          <input
            type="text"
            value={player.lastName}
            onChange={(e) => updatePlayer(player.id, 'lastName', e.target.value)}
            className="name-input last-name"
            placeholder="Last Name"
          />
        </div>
      </td>
      <td className="participation-cell">
        <div className="participation-info">
          <span className="participation-count">{calculateParticipation(player.id)}</span>
          <span className="participation-label">games</span>
        </div>
      </td>
      <td className="actions-cell">
        <button
          onClick={() => deletePlayer(player.id)}
          className="btn-delete-minimal"
          title="Delete player"
        >
          <Trash2 size={14} />
        </button>
      </td>
    </tr>
  );
};

const PlayerGameDayTracker = () => {
  const theme = useTheme();
  // Load data from localStorage or use defaults
  const loadData = () => {
    try {
      const savedPlayers = localStorage.getItem('player-tracker-players');
      const savedConfig = localStorage.getItem('player-tracker-config');
      const savedTeams = localStorage.getItem('player-tracker-teams');
      
      const defaultConfig = {
        numberOfTeams: 2,
        gameDaysPerTeam: [5, 5]
      };
      
      const config = savedConfig ? JSON.parse(savedConfig) : defaultConfig;
      const teams = savedTeams ? JSON.parse(savedTeams) : {};
      
      // Generate teams data if not exists
      const teamsData = {};
      for (let i = 1; i <= config.numberOfTeams; i++) {
        const teamKey = `team${i}`;
        if (!teams[teamKey]) {
          teamsData[teamKey] = Array(config.gameDaysPerTeam[i-1] || 5).fill(null).map((_, j) => ({
            gameDay: j + 1,
            date: '',
            location: 'Home',
            opponent: '',
            players: []
          }));
        } else {
          teamsData[teamKey] = teams[teamKey];
        }
      }
      
      return {
        players: savedPlayers ? JSON.parse(savedPlayers) : [{ id: 1, firstName: '', lastName: '' }],
        config,
        teams: teamsData
      };
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      return {
        players: [{ id: 1, firstName: '', lastName: '' }],
        config: { numberOfTeams: 2, gameDaysPerTeam: [5, 5] },
        teams: {
          team1: Array(5).fill(null).map((_, i) => ({
            gameDay: i + 1,
            date: '',
            location: 'Home',
            opponent: '',
            players: []
          })),
          team2: Array(5).fill(null).map((_, i) => ({
            gameDay: i + 1,
            date: '',
            location: 'Home',
            opponent: '',
            players: []
          }))
        }
      };
    }
  };

  const initialData = loadData();
  const [players, setPlayers] = useState(initialData.players);
  const [config, setConfig] = useState(initialData.config);
  const [teams, setTeams] = useState(initialData.teams);
  const [showConfig, setShowConfig] = useState(false);
  const [showPlayers, setShowPlayers] = useState(true);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Apply theme to body element
  useEffect(() => {
    document.body.setAttribute('data-theme', theme.isDarkMode ? 'dark' : 'light');
  }, [theme.isDarkMode]);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('player-tracker-players', JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    localStorage.setItem('player-tracker-config', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem('player-tracker-teams', JSON.stringify(teams));
  }, [teams]);

  const addPlayer = () => {
    setPlayers([...players, { id: Date.now(), firstName: '', lastName: '' }]);
  };

  const updatePlayer = (id, field, value) => {
    setPlayers(prevPlayers => prevPlayers.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const deletePlayer = (id) => {
    setPlayers(players.filter(p => p.id !== id));
    const updatedTeams = {};
    Object.keys(teams).forEach(teamKey => {
      updatedTeams[teamKey] = teams[teamKey].map(gd => ({ 
        ...gd, 
        players: gd.players.filter(pid => pid !== id) 
      }));
    });
    setTeams(updatedTeams);
  };

  const updateGameday = (teamKey, index, field, value) => {
    const updatedTeams = { ...teams };
    updatedTeams[teamKey] = [...teams[teamKey]];
    updatedTeams[teamKey][index] = { ...teams[teamKey][index], [field]: value };
    setTeams(updatedTeams);
  };

  const togglePlayerInGameday = (teamKey, gamedayIndex, playerId) => {
    const updatedTeams = { ...teams };
    updatedTeams[teamKey] = [...teams[teamKey]];
    const playerList = updatedTeams[teamKey][gamedayIndex].players;
    if (playerList.includes(playerId)) {
      updatedTeams[teamKey][gamedayIndex].players = playerList.filter(id => id !== playerId);
    } else {
      updatedTeams[teamKey][gamedayIndex].players = [...playerList, playerId];
    }
    setTeams(updatedTeams);
  };

  const calculateParticipation = (playerId) => {
    let totalCount = 0;
    Object.values(teams).forEach(teamGamedays => {
      totalCount += teamGamedays.filter(gd => gd.players.includes(playerId)).length;
    });
    return totalCount;
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      localStorage.removeItem('player-tracker-players');
      localStorage.removeItem('player-tracker-config');
      localStorage.removeItem('player-tracker-teams');
      
      setPlayers([{ id: 1, firstName: '', lastName: '' }]);
      setConfig({ numberOfTeams: 2, gameDaysPerTeam: [5, 5] });
      setTeams({
        team1: Array(5).fill(null).map((_, i) => ({
          gameDay: i + 1,
          date: '',
          location: 'Home',
          opponent: '',
          players: []
        })),
        team2: Array(5).fill(null).map((_, i) => ({
          gameDay: i + 1,
          date: '',
          location: 'Home',
          opponent: '',
          players: []
        }))
      });
    }
  };

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();

    const playersData = [
      ['First Name', 'Last Name', 'Total Game Days'],
      ...players.map(p => [p.firstName, p.lastName, calculateParticipation(p.id)])
    ];
    const wsPlayers = XLSX.utils.aoa_to_sheet(playersData);
    XLSX.utils.book_append_sheet(wb, wsPlayers, 'Players');

    // Export each team's game days in preview format
    Object.keys(teams).forEach((teamKey, index) => {
      const teamNumber = index + 1;
      const gamedays = teams[teamKey];
      
      // Create preview-style table with matchdays as columns
      const headerRow = [''].concat(gamedays.map(gd => `Game Day ${gd.gameDay}`));
      const opponentRow = ['Opponent'].concat(gamedays.map(gd => gd.opponent || 'TBD'));
      const dateRow = ['Date'].concat(gamedays.map(gd => gd.date || 'TBD'));
      const locationRow = ['Location'].concat(gamedays.map(gd => gd.location));
      // Create multiple rows for players - one player per row
      const playersRows = [];
      const maxPlayers = Math.max(...gamedays.map(gd => gd.players.length));
      
      for (let i = 0; i < maxPlayers; i++) {
        const row = [i === 0 ? 'Players' : '']; // Only show "Players" label on first row
        gamedays.forEach(gd => {
          if (i < gd.players.length) {
            const player = players.find(p => p.id === gd.players[i]);
            row.push(player ? `${player.firstName || 'First'} ${player.lastName || 'Last'}` : '');
          } else {
            row.push(''); // Empty cell if no player for this position
          }
        });
        playersRows.push(row);
      }

      const teamData = [
        headerRow,
        opponentRow,
        dateRow,
        locationRow,
        ...playersRows,
      ];
      const wsTeam = XLSX.utils.aoa_to_sheet(teamData);
      XLSX.utils.book_append_sheet(wb, wsTeam, `Team ${teamNumber} Preview`);
    });

    XLSX.writeFile(wb, 'player_gameday_tracker.xlsx');
  };

  const updateConfig = (newConfig) => {
    setConfig(newConfig);
    // Regenerate teams based on new config
    const newTeams = {};
    for (let i = 1; i <= newConfig.numberOfTeams; i++) {
      const teamKey = `team${i}`;
      const existingTeam = teams[teamKey];
      const gameDaysCount = newConfig.gameDaysPerTeam[i-1] || 5;
      
      if (existingTeam && existingTeam.length === gameDaysCount) {
        newTeams[teamKey] = existingTeam;
      } else {
        newTeams[teamKey] = Array(gameDaysCount).fill(null).map((_, j) => ({
          gameDay: j + 1,
          date: '',
          location: 'Home',
          opponent: '',
          players: existingTeam ? existingTeam[j]?.players || [] : []
        }));
      }
    }
    setTeams(newTeams);
  };

  const updateGameDaysForTeam = (teamIndex, newGameDays) => {
    const newConfig = { ...config };
    newConfig.gameDaysPerTeam[teamIndex] = newGameDays;
    updateConfig(newConfig);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setPlayers((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };


  return (
    <div className="app-container">
      <div className="content-wrapper">
        <header className="app-header">
          <div>
            <h1 className="app-title">Player Game Day Tracker</h1>
            <p className="app-subtitle">Manage your team and schedule with ease</p>
          </div>
          <div className="header-actions">
            <button 
              onClick={theme.toggleTheme} 
              className="btn-theme" 
              title={theme.isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme.isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              <span>{theme.isDarkMode ? "Light" : "Dark"}</span>
            </button>
            <button 
              onClick={() => setShowConfig(!showConfig)} 
              className="btn-config" 
              title="Configuration"
            >
              <Settings size={20} />
              <span>Config</span>
            </button>
            <button onClick={clearAllData} className="btn-clear" title="Clear all data">
              <RotateCcw size={20} />
              <span>Clear Data</span>
            </button>
            <button onClick={exportToExcel} className="btn-export">
              <Download size={20} />
              <span>Download Excel</span>
            </button>
          </div>
        </header>

        {/* Configuration Section */}
        {showConfig && (
          <section className="section config-section">
            <div className="section-header">
              <h2 className="section-title">Configuration</h2>
            </div>
            <div className="config-content">
              <div className="config-group">
                <label className="config-label">
                  <Users size={20} />
                  <span>Number of Teams</span>
                </label>
                <select
                  value={config.numberOfTeams}
                  onChange={(e) => {
                    const newNumberOfTeams = parseInt(e.target.value);
                    const newConfig = {
                      numberOfTeams: newNumberOfTeams,
                      gameDaysPerTeam: Array(newNumberOfTeams).fill(5)
                    };
                    updateConfig(newConfig);
                  }}
                  className="config-select"
                >
                  <option value={1}>1 Team</option>
                  <option value={2}>2 Teams</option>
                  <option value={3}>3 Teams</option>
                  <option value={4}>4 Teams</option>
                </select>
              </div>
              
              <div className="config-group">
                <label className="config-label">Game Days per Team</label>
                <div className="game-days-config">
                  {Array.from({ length: config.numberOfTeams }, (_, i) => (
                    <div key={i} className="team-config">
                      <label className="team-label">Team {i + 1}:</label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={config.gameDaysPerTeam[i] || 5}
                        onChange={(e) => updateGameDaysForTeam(i, parseInt(e.target.value))}
                        className="config-input"
                      />
                      <span className="config-unit">days</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Players Section */}
        <section className="section">
          <div className="section-header">
            <div className="section-title-container">
              <button 
                onClick={() => setShowPlayers(!showPlayers)} 
                className="collapse-toggle"
                title={showPlayers ? "Collapse players list" : "Expand players list"}
              >
                {showPlayers ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
              </button>
              <h2 className="section-title">Players Roster</h2>
              <span className="player-count-badge">{players.length} players</span>
            </div>
            <button onClick={addPlayer} className="btn-add">
              <Plus size={18} />
              <span>Add Player</span>
            </button>
          </div>
          
          {showPlayers && (
            <div className="table-container">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <table className="players-table">
                  <thead>
                    <tr>
                      <th className="drag-handle-header"></th>
                      <th>Player Name</th>
                      <th className="text-center">Games</th>
                      <th className="text-center"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <SortableContext items={players.map(p => p.id)} strategy={verticalListSortingStrategy}>
                      {players.map((player, index) => (
                        <SortablePlayerRow 
                          key={player.id} 
                          player={player} 
                          updatePlayer={updatePlayer}
                          deletePlayer={deletePlayer}
                          calculateParticipation={calculateParticipation}
                        />
                      ))}
                    </SortableContext>
                  </tbody>
                </table>
              </DndContext>
            </div>
          )}
        </section>

        {/* Dynamic Team Sections */}
        {Object.keys(teams).map((teamKey, index) => (
          <GameDaysSection
            key={teamKey}
            title={`Team ${index + 1}`}
            gamedays={teams[teamKey]}
            players={players}
            updateGameday={(gamedayIndex, field, value) => updateGameday(teamKey, gamedayIndex, field, value)}
            togglePlayer={(gamedayIndex, playerId) => togglePlayerInGameday(teamKey, gamedayIndex, playerId)}
          />
        ))}
      </div>
    </div>
  );
};

const GameDaysSection = ({ title, gamedays, players, updateGameday, togglePlayer }) => {
  const previewRef = useRef(null);

  const exportTeamPreviewToExcel = () => {
    const headerRow = [''].concat(gamedays.map(gd => `Game Day ${gd.gameDay}`));
    const opponentRow = ['Opponent'].concat(gamedays.map(gd => gd.opponent || 'TBD'));
    const dateRow = ['Date'].concat(gamedays.map(gd => gd.date || 'TBD'));
    const locationRow = ['Location'].concat(gamedays.map(gd => gd.location));
    
    // Create multiple rows for players - one player per row
    const playersRows = [];
    const maxPlayers = Math.max(...gamedays.map(gd => gd.players.length));
    
    for (let i = 0; i < maxPlayers; i++) {
      const row = [i === 0 ? 'Players' : '']; // Only show "Players" label on first row
      gamedays.forEach(gd => {
        if (i < gd.players.length) {
          const player = players.find(p => p.id === gd.players[i]);
          row.push(player ? `${player.firstName || 'First'} ${player.lastName || 'Last'}` : '');
        } else {
          row.push(''); // Empty cell if no player for this position
        }
      });
      playersRows.push(row);
    }

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([
      headerRow,
      opponentRow,
      dateRow,
      locationRow,
      ...playersRows,
    ]);
    XLSX.utils.book_append_sheet(wb, ws, title);
    XLSX.writeFile(wb, `${title.replace(/\s+/g, '_').toLowerCase()}_preview.xlsx`);
  };

  const exportTeamPreviewToPDF = async () => {
    const element = previewRef.current;
    if (!element) return;
    
    // Find the table element inside the preview container
    const tableElement = element.querySelector('.preview-table');
    if (!tableElement) return;
    
    // Temporarily remove scroll constraints to capture full width
    const originalOverflow = element.style.overflow;
    const originalWidth = element.style.width;
    element.style.overflow = 'visible';
    element.style.width = 'auto';
    
    // Capture the full table width
    const canvas = await html2canvas(tableElement, { 
      scale: 2,
      useCORS: true,
      allowTaint: true,
      width: tableElement.scrollWidth,
      height: tableElement.scrollHeight
    });
    
    // Restore original styles
    element.style.overflow = originalOverflow;
    element.style.width = originalWidth;
    
    const imgData = canvas.toDataURL('image/png');

    // Use landscape orientation for wide tables
    const pdf = new jsPDF('l', 'pt', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Calculate dimensions to fit the page
    const margin = 20;
    const availableWidth = pageWidth - (margin * 2);
    const availableHeight = pageHeight - (margin * 2);
    
    const imgWidth = availableWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let y = margin;
    if (imgHeight > availableHeight) {
      // If image is too tall, scale it down to fit
      const ratio = availableHeight / imgHeight;
      pdf.addImage(imgData, 'PNG', margin, y, imgWidth * ratio, availableHeight);
    } else {
      // If image fits, use full width
      pdf.addImage(imgData, 'PNG', margin, y, imgWidth, imgHeight);
    }
    
    pdf.save(`${title.replace(/\s+/g, '_').toLowerCase()}_preview.pdf`);
  };

  return (
    <section className="section">
      <h2 className="section-title">{title}</h2>
      
      {/* Preview Section */}
      <div className="preview-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', gap: '0.75rem', flexWrap: 'wrap' }}>
          <h3 className="preview-title" style={{ margin: 0 }}>Matchday Preview</h3>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button onClick={exportTeamPreviewToExcel} className="btn-export" title="Export preview as Excel">
              <Download size={20} />
              <span>Export Excel</span>
            </button>
            <button onClick={exportTeamPreviewToPDF} className="btn-theme" title="Export preview as PDF">
              <Download size={20} />
              <span>Export PDF</span>
            </button>
          </div>
        </div>
        <div className="preview-capture" ref={previewRef}>
          <div className="preview-container">
            <table className="preview-table">
            <thead>
              <tr>
                <th className="preview-header">Matchday</th>
                {gamedays.map((gd, index) => (
                  <th key={index} className={`preview-header ${gd.location === 'Home' ? 'home-game' : ''}`}>
                    {gd.gameDay}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="preview-label">Opponent</td>
                {gamedays.map((gd, index) => (
                  <td key={index} className={`preview-cell ${gd.location === 'Home' ? 'home-game' : ''}`}>
                    {gd.opponent || 'TBD'}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="preview-label">Date</td>
                {gamedays.map((gd, index) => (
                  <td key={index} className={`preview-cell ${gd.location === 'Home' ? 'home-game' : ''}`}>
                    {gd.date || 'TBD'}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="preview-label">Location</td>
                {gamedays.map((gd, index) => (
                  <td key={index} className={`preview-cell ${gd.location === 'Home' ? 'home-game' : ''}`}>
                    <div className="location-info">
                      {gd.location === 'Home' ? <Home size={16} /> : <MapPin size={16} />}
                      <span>{gd.location}</span>
                    </div>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="preview-label">Players</td>
                {gamedays.map((gd, index) => (
                  <td key={index} className={`preview-cell ${gd.location === 'Home' ? 'home-game' : ''}`}>
                    <div className="players-preview">
                      {gd.players.length > 0 ? (
                        players
                          .filter(player => gd.players.includes(player.id))
                          .map(player => (
                            <div key={player.id} className="player-preview-item">
                              {player.firstName || 'First'} {player.lastName || 'Last'}
                            </div>
                          ))
                      ) : (
                        <span className="no-players">No players selected</span>
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <div className="gamedays-grid">
        {gamedays.map((gd, index) => (
          <div key={index} className="gameday-card">
            <div className="gameday-header">
              <h3 className="gameday-title">Game Day {gd.gameDay}</h3>
              <span className="player-count">{gd.players.length} players</span>
            </div>
            
            <div className="gameday-info">
              <div className="info-group">
                <label className="label">
                  <span>📅</span>
                  <span>Date</span>
                </label>
                <input
                  type="date"
                  value={gd.date}
                  onChange={(e) => updateGameday(index, 'date', e.target.value)}
                  className="input-field"
                />
              </div>
              
              <div className="info-group">
                <label className="label">
                  {gd.location === 'Home' ? <Home size={16} /> : <MapPin size={16} />}
                  <span>Location</span>
                </label>
                <select
                  value={gd.location}
                  onChange={(e) => updateGameday(index, 'location', e.target.value)}
                  className="select-field"
                >
                  <option value="Home">Home</option>
                  <option value="Away">Away</option>
                </select>
              </div>
              
              <div className="info-group full-width">
                <label className="label">
                  <MapPin size={16} />
                  <span>Opponent</span>
                </label>
                <input
                  type="text"
                  value={gd.opponent}
                  onChange={(e) => updateGameday(index, 'opponent', e.target.value)}
                  className="input-field"
                  placeholder="Enter Opponent"
                  required
                />
              </div>
            </div>
            
            <div className="players-selection">
              <label className="label">Select Players</label>
              <div className="checkbox-grid">
                {players.map(player => (
                  <label key={player.id} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={gd.players.includes(player.id)}
                      onChange={() => togglePlayer(index, player.id)}
                      className="checkbox"
                    />
                    <span className="checkbox-text">
                      {player.firstName || 'First'} {player.lastName || 'Last'}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <PlayerGameDayTracker />
    </ThemeProvider>
  );
};

export default App;