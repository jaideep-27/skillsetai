import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiPlay, FiPause, FiPlus, FiMinus } from 'react-icons/fi';
import './GearSimulator.css';

const GearSimulator = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [isRunning, setIsRunning] = useState(false);
  const [gears, setGears] = useState([
    { x: 200, y: 250, radius: 80, teeth: 16, angle: 0, rpm: 60, isDriver: true },
    { x: 360, y: 250, radius: 60, teeth: 12, angle: 0, rpm: 0, isDriver: false }
  ]);
  const [selectedGear, setSelectedGear] = useState(null);
  const [showInfo, setShowInfo] = useState(true);

  const calculateGearRatio = useCallback(() => {
    if (gears.length < 2) return 1;
    const driver = gears.find(g => g.isDriver);
    const driven = gears.find(g => !g.isDriver);
    if (!driver || !driven) return 1;
    return driven.teeth / driver.teeth;
  }, [gears]);

  const calculateOutputRPM = useCallback(() => {
    const driver = gears.find(g => g.isDriver);
    if (!driver) return 0;
    const ratio = calculateGearRatio();
    return Math.round(driver.rpm / ratio);
  }, [gears, calculateGearRatio]);

  const drawGear = useCallback((ctx, gear, color) => {
    const { x, y, radius, teeth, angle } = gear;
    
    // Draw gear body
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    
    // Outer circle with teeth
    ctx.beginPath();
    const toothDepth = radius * 0.15;
    const toothWidth = (2 * Math.PI) / (teeth * 2);
    
    for (let i = 0; i < teeth; i++) {
      const a1 = i * (2 * Math.PI) / teeth;
      const a2 = a1 + toothWidth * 0.4;
      const a3 = a1 + toothWidth;
      const a4 = a1 + toothWidth * 1.4;
      
      ctx.lineTo(
        Math.cos(a1) * radius,
        Math.sin(a1) * radius
      );
      ctx.lineTo(
        Math.cos(a2) * (radius + toothDepth),
        Math.sin(a2) * (radius + toothDepth)
      );
      ctx.lineTo(
        Math.cos(a3) * (radius + toothDepth),
        Math.sin(a3) * (radius + toothDepth)
      );
      ctx.lineTo(
        Math.cos(a4) * radius,
        Math.sin(a4) * radius
      );
    }
    ctx.closePath();
    
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius + toothDepth);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, adjustColor(color, -30));
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.strokeStyle = adjustColor(color, 30);
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Inner circle (hub)
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(10, 15, 31, 0.8)';
    ctx.fill();
    ctx.stroke();
    
    // Center hole
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.15, 0, Math.PI * 2);
    ctx.fillStyle = '#0A0F1F';
    ctx.fill();
    
    // Spokes
    for (let i = 0; i < 4; i++) {
      const spokeAngle = (i * Math.PI) / 2;
      ctx.beginPath();
      ctx.moveTo(
        Math.cos(spokeAngle) * radius * 0.3,
        Math.sin(spokeAngle) * radius * 0.3
      );
      ctx.lineTo(
        Math.cos(spokeAngle) * radius * 0.85,
        Math.sin(spokeAngle) * radius * 0.85
      );
      ctx.strokeStyle = adjustColor(color, -20);
      ctx.lineWidth = radius * 0.1;
      ctx.stroke();
    }
    
    ctx.restore();
    
    // Driver indicator
    if (gear.isDriver) {
      ctx.beginPath();
      ctx.arc(x, y - radius - 25, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#22C55E';
      ctx.fill();
      ctx.fillStyle = 'white';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('D', x, y - radius - 22);
    }
  }, []);

  const adjustColor = (color, amount) => {
    const hex = color.replace('#', '');
    const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + amount));
    const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + amount));
    const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + amount));
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.fillStyle = 'rgba(10, 15, 31, 1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Update gear angles
    const driver = gears.find(g => g.isDriver);
    if (driver && isRunning) {
      const newGears = gears.map((gear, index) => {
        if (gear.isDriver) {
          return {
            ...gear,
            angle: gear.angle + (gear.rpm / 60) * (Math.PI / 30)
          };
        } else {
          // Calculate angle based on gear ratio (opposite direction)
          const ratio = driver.teeth / gear.teeth;
          return {
            ...gear,
            angle: -driver.angle * ratio
          };
        }
      });
      setGears(newGears);
    }
    
    // Draw gears
    const colors = ['#4D61FC', '#FF6B9C', '#22C55E', '#FFA500'];
    gears.forEach((gear, index) => {
      drawGear(ctx, gear, colors[index % colors.length]);
    });
    
    animationRef.current = requestAnimationFrame(animate);
  }, [gears, isRunning, drawGear]);

  useEffect(() => {
    animate();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

  const adjustGearSize = (index, delta) => {
    setGears(prev => {
      const newGears = [...prev];
      const newTeeth = Math.max(8, Math.min(24, newGears[index].teeth + delta));
      const newRadius = newTeeth * 5; // 5 pixels per tooth
      newGears[index] = {
        ...newGears[index],
        teeth: newTeeth,
        radius: newRadius
      };
      return newGears;
    });
  };

  const adjustRPM = (delta) => {
    setGears(prev => {
      return prev.map(gear => {
        if (gear.isDriver) {
          return {
            ...gear,
            rpm: Math.max(10, Math.min(200, gear.rpm + delta))
          };
        }
        return gear;
      });
    });
  };

  return (
    <div className="gear-simulator">
      <div className="game-header">
        <Link to="/games/categories/mechanical" className="back-button">
          <FiArrowLeft size={20} />
          Back
        </Link>
        <h1>Gear Train Simulator</h1>
      </div>

      <div className="game-layout">
        <div className="game-sidebar">
          <div className="control-section">
            <h3>Driver Gear</h3>
            <div className="control-row">
              <span>Teeth: {gears[0]?.teeth || 0}</span>
              <div className="control-buttons">
                <button onClick={() => adjustGearSize(0, -2)} disabled={isRunning}>
                  <FiMinus size={16} />
                </button>
                <button onClick={() => adjustGearSize(0, 2)} disabled={isRunning}>
                  <FiPlus size={16} />
                </button>
              </div>
            </div>
            <div className="control-row">
              <span>RPM: {gears[0]?.rpm || 0}</span>
              <div className="control-buttons">
                <button onClick={() => adjustRPM(-10)} disabled={isRunning}>
                  <FiMinus size={16} />
                </button>
                <button onClick={() => adjustRPM(10)} disabled={isRunning}>
                  <FiPlus size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="control-section">
            <h3>Driven Gear</h3>
            <div className="control-row">
              <span>Teeth: {gears[1]?.teeth || 0}</span>
              <div className="control-buttons">
                <button onClick={() => adjustGearSize(1, -2)} disabled={isRunning}>
                  <FiMinus size={16} />
                </button>
                <button onClick={() => adjustGearSize(1, 2)} disabled={isRunning}>
                  <FiPlus size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="stats-section">
            <h3>Calculations</h3>
            <div className="stat-row">
              <span>Gear Ratio:</span>
              <span>{calculateGearRatio().toFixed(2)}:1</span>
            </div>
            <div className="stat-row">
              <span>Output RPM:</span>
              <span>{calculateOutputRPM()}</span>
            </div>
            <div className="stat-row">
              <span>Torque Multiplier:</span>
              <span>{calculateGearRatio().toFixed(2)}x</span>
            </div>
          </div>

          <button
            className="action-button primary"
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? <FiPause size={18} /> : <FiPlay size={18} />}
            {isRunning ? 'Stop' : 'Start'}
          </button>

          <button
            className="action-button secondary"
            onClick={() => setShowInfo(!showInfo)}
          >
            {showInfo ? 'Hide Info' : 'Show Info'}
          </button>
        </div>

        <div className="game-main">
          <canvas
            ref={canvasRef}
            width={600}
            height={500}
            className="gear-canvas"
          />
          
          {showInfo && (
            <div className="info-panel">
              <h4>How Gears Work</h4>
              <p>
                <strong>Gear Ratio</strong> = Driven Teeth ÷ Driver Teeth
              </p>
              <p>
                <strong>Output RPM</strong> = Input RPM ÷ Gear Ratio
              </p>
              <p>
                When the driven gear has more teeth, it rotates slower but with more torque.
                When it has fewer teeth, it rotates faster but with less torque.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GearSimulator;
