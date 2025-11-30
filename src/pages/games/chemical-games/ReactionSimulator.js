import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiPlay, FiRefreshCw } from 'react-icons/fi';
import './ReactionSimulator.css';

const reactions = [
  {
    name: 'Combustion of Methane',
    reactants: ['CH₄', 'O₂'],
    products: ['CO₂', 'H₂O'],
    equation: 'CH₄ + 2O₂ → CO₂ + 2H₂O',
    type: 'Combustion',
    color: '#FF6B9C',
    description: 'Methane burns in oxygen to produce carbon dioxide and water. This is the main reaction in natural gas burning.'
  },
  {
    name: 'Neutralization',
    reactants: ['HCl', 'NaOH'],
    products: ['NaCl', 'H₂O'],
    equation: 'HCl + NaOH → NaCl + H₂O',
    type: 'Acid-Base',
    color: '#4D61FC',
    description: 'Hydrochloric acid reacts with sodium hydroxide to form table salt and water.'
  },
  {
    name: 'Rust Formation',
    reactants: ['Fe', 'O₂', 'H₂O'],
    products: ['Fe₂O₃·H₂O'],
    equation: '4Fe + 3O₂ + 6H₂O → 4Fe(OH)₃',
    type: 'Oxidation',
    color: '#FFA500',
    description: 'Iron reacts with oxygen and water to form rust (iron hydroxide).'
  },
  {
    name: 'Photosynthesis',
    reactants: ['CO₂', 'H₂O'],
    products: ['C₆H₁₂O₆', 'O₂'],
    equation: '6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂',
    type: 'Synthesis',
    color: '#22C55E',
    description: 'Plants use sunlight to convert carbon dioxide and water into glucose and oxygen.'
  },
  {
    name: 'Baking Soda & Vinegar',
    reactants: ['NaHCO₃', 'CH₃COOH'],
    products: ['CO₂', 'H₂O', 'CH₃COONa'],
    equation: 'NaHCO₃ + CH₃COOH → CO₂ + H₂O + CH₃COONa',
    type: 'Acid-Base',
    color: '#00D4FF',
    description: 'The classic volcano experiment - baking soda reacts with vinegar to produce carbon dioxide gas.'
  }
];

const ReactionSimulator = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [selectedReaction, setSelectedReaction] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  const particlesRef = useRef([]);

  const reaction = reactions[selectedReaction];

  const initParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    particlesRef.current = [];
    const reactantCount = reaction.reactants.length;
    
    reaction.reactants.forEach((reactant, idx) => {
      const count = 5;
      for (let i = 0; i < count; i++) {
        particlesRef.current.push({
          x: 100 + (idx * 150) + Math.random() * 80 - 40,
          y: 200 + Math.random() * 100 - 50,
          vx: 0,
          vy: 0,
          radius: 20 + Math.random() * 10,
          label: reactant,
          type: 'reactant',
          color: reaction.color,
          targetX: null,
          targetY: null,
          merged: false
        });
      }
    });
  }, [reaction]);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = 'rgba(10, 15, 31, 1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw beaker outline
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, 50);
    ctx.lineTo(50, 350);
    ctx.lineTo(550, 350);
    ctx.lineTo(550, 50);
    ctx.stroke();

    // Draw arrow
    if (isAnimating && animationProgress > 0.5) {
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.moveTo(280, 200);
      ctx.lineTo(320, 200);
      ctx.lineTo(320, 190);
      ctx.lineTo(340, 210);
      ctx.lineTo(320, 230);
      ctx.lineTo(320, 220);
      ctx.lineTo(280, 220);
      ctx.closePath();
      ctx.fill();
    }

    // Update and draw particles
    particlesRef.current.forEach((particle, index) => {
      if (isAnimating) {
        if (animationProgress < 0.5) {
          // Move towards center
          particle.x += (300 - particle.x) * 0.02;
          particle.y += (200 - particle.y) * 0.02;
        } else if (!particle.merged) {
          // Transform to products
          particle.merged = true;
          if (index < reaction.products.length) {
            particle.label = reaction.products[index % reaction.products.length];
            particle.x = 400 + (index * 80);
            particle.y = 200;
            particle.color = '#22C55E';
          } else {
            particle.radius = 0; // Hide extra particles
          }
        } else if (animationProgress > 0.5) {
          // Spread out products
          particle.x += (particle.x - 450) * 0.01;
          particle.y += Math.sin(Date.now() / 500 + index) * 0.5;
        }
      }

      // Draw particle
      if (particle.radius > 0) {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.radius
        );
        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(1, adjustColor(particle.color, -50));
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Draw label
        ctx.fillStyle = 'white';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(particle.label, particle.x, particle.y);
      }
    });

    // Draw equation
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = '18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(reaction.equation, 300, 400);

    if (isAnimating && animationProgress < 1) {
      setAnimationProgress(prev => Math.min(prev + 0.005, 1));
      animationRef.current = requestAnimationFrame(animate);
    } else {
      animationRef.current = requestAnimationFrame(animate);
    }
  }, [isAnimating, animationProgress, reaction]);

  const adjustColor = (color, amount) => {
    const hex = color.replace('#', '');
    const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + amount));
    const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + amount));
    const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + amount));
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  useEffect(() => {
    initParticles();
  }, [selectedReaction, initParticles]);

  useEffect(() => {
    animate();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

  const startAnimation = () => {
    setAnimationProgress(0);
    initParticles();
    setIsAnimating(true);
  };

  const resetAnimation = () => {
    setIsAnimating(false);
    setAnimationProgress(0);
    initParticles();
  };

  return (
    <div className="reaction-simulator">
      <div className="game-header">
        <Link to="/games/categories/chemical" className="back-button">
          <FiArrowLeft size={20} />
          Back
        </Link>
        <h1>Chemical Reaction Simulator</h1>
      </div>

      <div className="game-layout">
        <div className="game-sidebar">
          <div className="reaction-list">
            <h3>Select Reaction</h3>
            {reactions.map((r, index) => (
              <button
                key={index}
                className={`reaction-item ${selectedReaction === index ? 'active' : ''}`}
                onClick={() => {
                  setSelectedReaction(index);
                  resetAnimation();
                }}
                style={{ '--reaction-color': r.color }}
              >
                <span className="reaction-type">{r.type}</span>
                <span className="reaction-name">{r.name}</span>
              </button>
            ))}
          </div>

          <div className="control-buttons">
            <button className="action-button primary" onClick={startAnimation} disabled={isAnimating}>
              <FiPlay size={18} />
              Start Reaction
            </button>
            <button className="action-button secondary" onClick={resetAnimation}>
              <FiRefreshCw size={18} />
              Reset
            </button>
          </div>
        </div>

        <div className="game-main">
          <canvas
            ref={canvasRef}
            width={600}
            height={450}
            className="reaction-canvas"
          />
          
          <div className="reaction-info">
            <h3>{reaction.name}</h3>
            <p className="equation-display">{reaction.equation}</p>
            <p className="description">{reaction.description}</p>
            <div className="reaction-details">
              <span className="detail-tag" style={{ background: `${reaction.color}33`, color: reaction.color }}>
                {reaction.type}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReactionSimulator;
