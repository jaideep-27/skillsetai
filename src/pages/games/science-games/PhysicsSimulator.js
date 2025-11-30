import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiPlay, FiPause, FiRefreshCw } from 'react-icons/fi';
import './PhysicsSimulator.css';

const PhysicsSimulator = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [isRunning, setIsRunning] = useState(false);
  const [simulation, setSimulation] = useState('projectile');
  const [params, setParams] = useState({
    velocity: 50,
    angle: 45,
    gravity: 9.8,
    mass: 1,
    pendulumLength: 200,
    initialAngle: 30,
    springConstant: 0.1,
    springDamping: 0.01
  });
  const [projectile, setProjectile] = useState({ x: 50, y: 0, vx: 0, vy: 0, trail: [] });
  const [pendulum, setPendulum] = useState({ angle: 0, angularVelocity: 0 });
  const [spring, setSpring] = useState({ position: 0, velocity: 0 });
  const [stats, setStats] = useState({ maxHeight: 0, distance: 0, time: 0 });

  const resetSimulation = useCallback(() => {
    setIsRunning(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    switch (simulation) {
      case 'projectile':
        const radians = (params.angle * Math.PI) / 180;
        setProjectile({
          x: 50,
          y: 0,
          vx: params.velocity * Math.cos(radians),
          vy: params.velocity * Math.sin(radians),
          trail: []
        });
        setStats({ maxHeight: 0, distance: 0, time: 0 });
        break;
      case 'pendulum':
        setPendulum({
          angle: (params.initialAngle * Math.PI) / 180,
          angularVelocity: 0
        });
        break;
      case 'spring':
        setSpring({ position: 100, velocity: 0 });
        break;
      default:
        break;
    }
  }, [simulation, params]);

  useEffect(() => {
    resetSimulation();
  }, [simulation, resetSimulation]);

  const runProjectileSimulation = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dt = 0.1;
    const scale = 4;

    let currentProjectile = { ...projectile };
    let currentStats = { ...stats };
    let time = currentStats.time;

    const animate = () => {
      // Clear canvas
      ctx.fillStyle = 'rgba(10, 15, 31, 1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw ground
      ctx.fillStyle = 'rgba(34, 197, 94, 0.3)';
      ctx.fillRect(0, canvas.height - 20, canvas.width, 20);

      // Update physics
      currentProjectile.vy -= params.gravity * dt;
      currentProjectile.x += currentProjectile.vx * dt * scale;
      currentProjectile.y += currentProjectile.vy * dt * scale;
      time += dt;

      // Track max height and distance
      const currentHeight = currentProjectile.y / scale;
      if (currentHeight > currentStats.maxHeight) {
        currentStats.maxHeight = currentHeight;
      }
      currentStats.distance = (currentProjectile.x - 50) / scale;
      currentStats.time = time;

      // Draw trail
      currentProjectile.trail.push({ x: currentProjectile.x, y: currentProjectile.y });
      if (currentProjectile.trail.length > 100) {
        currentProjectile.trail.shift();
      }
      ctx.strokeStyle = 'rgba(0, 212, 255, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      currentProjectile.trail.forEach((point, i) => {
        const screenY = canvas.height - 20 - point.y;
        if (i === 0) {
          ctx.moveTo(point.x, screenY);
        } else {
          ctx.lineTo(point.x, screenY);
        }
      });
      ctx.stroke();

      // Draw projectile
      const screenX = currentProjectile.x;
      const screenY = canvas.height - 20 - currentProjectile.y;
      
      ctx.beginPath();
      ctx.arc(screenX, screenY, 10, 0, Math.PI * 2);
      const gradient = ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, 10);
      gradient.addColorStop(0, '#00D4FF');
      gradient.addColorStop(1, '#4D61FC');
      ctx.fillStyle = gradient;
      ctx.fill();

      // Update state
      setProjectile({ ...currentProjectile });
      setStats({ ...currentStats });

      // Check if hit ground
      if (currentProjectile.y <= 0 && time > 0.5) {
        setIsRunning(false);
        return;
      }

      // Check if out of bounds
      if (currentProjectile.x > canvas.width) {
        setIsRunning(false);
        return;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
  }, [projectile, stats, params.gravity]);

  const runPendulumSimulation = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dt = 0.02;

    let currentPendulum = { ...pendulum };
    const pivotX = canvas.width / 2;
    const pivotY = 100;
    const length = params.pendulumLength;

    const animate = () => {
      // Clear canvas
      ctx.fillStyle = 'rgba(10, 15, 31, 1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Physics: angular acceleration = -g/L * sin(theta)
      const angularAcceleration = (-params.gravity / (length / 50)) * Math.sin(currentPendulum.angle);
      currentPendulum.angularVelocity += angularAcceleration * dt;
      currentPendulum.angularVelocity *= 0.999; // Small damping
      currentPendulum.angle += currentPendulum.angularVelocity * dt;

      // Calculate bob position
      const bobX = pivotX + length * Math.sin(currentPendulum.angle);
      const bobY = pivotY + length * Math.cos(currentPendulum.angle);

      // Draw pivot point
      ctx.beginPath();
      ctx.arc(pivotX, pivotY, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#FF6B9C';
      ctx.fill();

      // Draw string
      ctx.beginPath();
      ctx.moveTo(pivotX, pivotY);
      ctx.lineTo(bobX, bobY);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw bob
      ctx.beginPath();
      ctx.arc(bobX, bobY, 25, 0, Math.PI * 2);
      const gradient = ctx.createRadialGradient(bobX, bobY, 0, bobX, bobY, 25);
      gradient.addColorStop(0, '#22C55E');
      gradient.addColorStop(1, '#4D61FC');
      ctx.fillStyle = gradient;
      ctx.fill();

      // Draw energy indicators
      const kineticEnergy = 0.5 * params.mass * Math.pow(currentPendulum.angularVelocity * length, 2);
      const potentialEnergy = params.mass * params.gravity * (length - length * Math.cos(currentPendulum.angle));
      const maxEnergy = params.mass * params.gravity * length * 2;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = '14px monospace';
      ctx.fillText(`KE: ${kineticEnergy.toFixed(1)} J`, 20, canvas.height - 60);
      ctx.fillText(`PE: ${potentialEnergy.toFixed(1)} J`, 20, canvas.height - 40);
      ctx.fillText(`Angle: ${((currentPendulum.angle * 180) / Math.PI).toFixed(1)}°`, 20, canvas.height - 20);

      // Energy bars
      const barWidth = 100;
      ctx.fillStyle = '#00D4FF';
      ctx.fillRect(canvas.width - 130, canvas.height - 60, (kineticEnergy / maxEnergy) * barWidth, 15);
      ctx.fillStyle = '#22C55E';
      ctx.fillRect(canvas.width - 130, canvas.height - 35, (potentialEnergy / maxEnergy) * barWidth, 15);

      setPendulum({ ...currentPendulum });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
  }, [pendulum, params]);

  const runSpringSimulation = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dt = 0.5;

    let currentSpring = { ...spring };
    const equilibrium = canvas.height / 2;
    const anchorX = canvas.width / 2;

    const animate = () => {
      // Clear canvas
      ctx.fillStyle = 'rgba(10, 15, 31, 1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Physics: F = -kx - bv (spring force + damping)
      const displacement = currentSpring.position;
      const force = -params.springConstant * displacement - params.springDamping * currentSpring.velocity;
      const acceleration = force / params.mass;
      currentSpring.velocity += acceleration * dt;
      currentSpring.position += currentSpring.velocity * dt;

      const massY = equilibrium + currentSpring.position;

      // Draw ceiling
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fillRect(anchorX - 100, 50, 200, 10);

      // Draw spring (zigzag pattern)
      const springTop = 60;
      const coils = 15;
      const coilWidth = 30;
      const springLength = massY - 30 - springTop;
      const coilHeight = springLength / coils;

      ctx.beginPath();
      ctx.moveTo(anchorX, springTop);
      for (let i = 0; i < coils; i++) {
        const y1 = springTop + (i + 0.25) * coilHeight;
        const y2 = springTop + (i + 0.75) * coilHeight;
        const x1 = anchorX + (i % 2 === 0 ? coilWidth : -coilWidth);
        ctx.lineTo(x1, y1);
        ctx.lineTo(anchorX + (i % 2 === 0 ? -coilWidth : coilWidth), y2);
      }
      ctx.lineTo(anchorX, massY - 30);
      ctx.strokeStyle = '#FFA500';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw mass
      ctx.fillStyle = '#4D61FC';
      ctx.fillRect(anchorX - 30, massY - 30, 60, 60);
      ctx.strokeStyle = '#00D4FF';
      ctx.lineWidth = 2;
      ctx.strokeRect(anchorX - 30, massY - 30, 60, 60);

      // Draw equilibrium line
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(100, equilibrium);
      ctx.lineTo(canvas.width - 100, equilibrium);
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.5)';
      ctx.stroke();
      ctx.setLineDash([]);

      // Display info
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = '14px monospace';
      ctx.fillText(`Displacement: ${currentSpring.position.toFixed(1)} px`, 20, canvas.height - 60);
      ctx.fillText(`Velocity: ${currentSpring.velocity.toFixed(2)} px/s`, 20, canvas.height - 40);
      ctx.fillText(`Force: ${force.toFixed(2)} N`, 20, canvas.height - 20);

      setSpring({ ...currentSpring });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
  }, [spring, params]);

  useEffect(() => {
    if (isRunning) {
      switch (simulation) {
        case 'projectile':
          runProjectileSimulation();
          break;
        case 'pendulum':
          runPendulumSimulation();
          break;
        case 'spring':
          runSpringSimulation();
          break;
        default:
          break;
      }
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning, simulation, runProjectileSimulation, runPendulumSimulation, runSpringSimulation]);

  // Initial draw
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = 'rgba(10, 15, 31, 1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    if (simulation === 'projectile') {
      ctx.fillStyle = 'rgba(34, 197, 94, 0.3)';
      ctx.fillRect(0, canvas.height - 20, canvas.width, 20);
      
      ctx.beginPath();
      ctx.arc(50, canvas.height - 30, 10, 0, Math.PI * 2);
      const gradient = ctx.createRadialGradient(50, canvas.height - 30, 0, 50, canvas.height - 30, 10);
      gradient.addColorStop(0, '#00D4FF');
      gradient.addColorStop(1, '#4D61FC');
      ctx.fillStyle = gradient;
      ctx.fill();
    }
  }, [simulation]);

  return (
    <div className="physics-simulator">
      <div className="game-header">
        <Link to="/games/categories/science" className="back-button">
          <FiArrowLeft size={20} />
          Back
        </Link>
        <h1>Physics Simulator</h1>
      </div>

      <div className="game-layout">
        <div className="game-sidebar">
          <div className="simulation-select">
            <label>Simulation Type</label>
            <select 
              value={simulation} 
              onChange={(e) => setSimulation(e.target.value)}
              disabled={isRunning}
            >
              <option value="projectile">Projectile Motion</option>
              <option value="pendulum">Pendulum</option>
              <option value="spring">Spring Oscillation</option>
            </select>
          </div>

          {simulation === 'projectile' && (
            <div className="params-section">
              <div className="param-item">
                <label>Initial Velocity: {params.velocity} m/s</label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={params.velocity}
                  onChange={(e) => setParams({ ...params, velocity: parseInt(e.target.value) })}
                  disabled={isRunning}
                />
              </div>
              <div className="param-item">
                <label>Launch Angle: {params.angle}°</label>
                <input
                  type="range"
                  min="5"
                  max="85"
                  value={params.angle}
                  onChange={(e) => setParams({ ...params, angle: parseInt(e.target.value) })}
                  disabled={isRunning}
                />
              </div>
              <div className="param-item">
                <label>Gravity: {params.gravity} m/s²</label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  step="0.1"
                  value={params.gravity}
                  onChange={(e) => setParams({ ...params, gravity: parseFloat(e.target.value) })}
                  disabled={isRunning}
                />
              </div>

              <div className="stats-display">
                <div className="stat-row">
                  <span>Max Height:</span>
                  <span>{stats.maxHeight.toFixed(1)} m</span>
                </div>
                <div className="stat-row">
                  <span>Distance:</span>
                  <span>{stats.distance.toFixed(1)} m</span>
                </div>
                <div className="stat-row">
                  <span>Time:</span>
                  <span>{stats.time.toFixed(1)} s</span>
                </div>
              </div>
            </div>
          )}

          {simulation === 'pendulum' && (
            <div className="params-section">
              <div className="param-item">
                <label>Length: {params.pendulumLength} px</label>
                <input
                  type="range"
                  min="100"
                  max="300"
                  value={params.pendulumLength}
                  onChange={(e) => setParams({ ...params, pendulumLength: parseInt(e.target.value) })}
                  disabled={isRunning}
                />
              </div>
              <div className="param-item">
                <label>Initial Angle: {params.initialAngle}°</label>
                <input
                  type="range"
                  min="5"
                  max="89"
                  value={params.initialAngle}
                  onChange={(e) => setParams({ ...params, initialAngle: parseInt(e.target.value) })}
                  disabled={isRunning}
                />
              </div>
              <div className="param-item">
                <label>Gravity: {params.gravity} m/s²</label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  step="0.1"
                  value={params.gravity}
                  onChange={(e) => setParams({ ...params, gravity: parseFloat(e.target.value) })}
                  disabled={isRunning}
                />
              </div>
            </div>
          )}

          {simulation === 'spring' && (
            <div className="params-section">
              <div className="param-item">
                <label>Spring Constant: {params.springConstant}</label>
                <input
                  type="range"
                  min="0.01"
                  max="0.5"
                  step="0.01"
                  value={params.springConstant}
                  onChange={(e) => setParams({ ...params, springConstant: parseFloat(e.target.value) })}
                  disabled={isRunning}
                />
              </div>
              <div className="param-item">
                <label>Damping: {params.springDamping}</label>
                <input
                  type="range"
                  min="0"
                  max="0.1"
                  step="0.005"
                  value={params.springDamping}
                  onChange={(e) => setParams({ ...params, springDamping: parseFloat(e.target.value) })}
                  disabled={isRunning}
                />
              </div>
              <div className="param-item">
                <label>Mass: {params.mass} kg</label>
                <input
                  type="range"
                  min="0.5"
                  max="5"
                  step="0.5"
                  value={params.mass}
                  onChange={(e) => setParams({ ...params, mass: parseFloat(e.target.value) })}
                  disabled={isRunning}
                />
              </div>
            </div>
          )}

          <div className="control-buttons">
            <button
              className="action-button primary"
              onClick={() => setIsRunning(!isRunning)}
            >
              {isRunning ? <FiPause size={18} /> : <FiPlay size={18} />}
              {isRunning ? 'Pause' : 'Start'}
            </button>
            <button
              className="action-button secondary"
              onClick={resetSimulation}
            >
              <FiRefreshCw size={18} />
              Reset
            </button>
          </div>
        </div>

        <div className="game-main">
          <canvas
            ref={canvasRef}
            width={700}
            height={500}
            className="simulation-canvas"
          />
        </div>
      </div>
    </div>
  );
};

export default PhysicsSimulator;
