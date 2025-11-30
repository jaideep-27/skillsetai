import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiPlay, FiTrash2, FiRefreshCw } from 'react-icons/fi';
import './BridgeBuilder.css';

const BridgeBuilder = () => {
  const canvasRef = useRef(null);
  const [nodes, setNodes] = useState([]);
  const [beams, setBeams] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [mode, setMode] = useState('node'); // 'node' or 'beam'
  const [budget, setBudget] = useState(1000);
  const [score, setScore] = useState(0);
  const animationRef = useRef(null);

  const BEAM_COST = 50;
  const NODE_COST = 30;
  const FIXED_NODES = [
    { x: 50, y: 350, fixed: true, id: 'anchor-left' },
    { x: 550, y: 350, fixed: true, id: 'anchor-right' }
  ];

  useEffect(() => {
    setNodes(FIXED_NODES);
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'rgba(10, 15, 31, 1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw ground
    ctx.fillStyle = 'rgba(101, 67, 33, 0.8)';
    ctx.fillRect(0, 370, 100, 80);
    ctx.fillRect(500, 370, 100, 80);

    // Draw water
    ctx.fillStyle = 'rgba(0, 150, 255, 0.3)';
    ctx.fillRect(100, 370, 400, 80);

    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
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

    // Draw beams
    beams.forEach(beam => {
      const startNode = nodes.find(n => n.id === beam.start);
      const endNode = nodes.find(n => n.id === beam.end);
      if (startNode && endNode) {
        const stress = beam.stress || 0;
        let color = '#4D61FC';
        if (stress > 0.7) color = '#EF4444';
        else if (stress > 0.4) color = '#FFA500';
        else if (stress > 0) color = '#22C55E';

        ctx.beginPath();
        ctx.moveTo(startNode.x, startNode.y);
        ctx.lineTo(endNode.x, endNode.y);
        ctx.strokeStyle = color;
        ctx.lineWidth = 6;
        ctx.stroke();
        
        // Beam outline
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    });

    // Draw nodes
    nodes.forEach(node => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.fixed ? 15 : 10, 0, Math.PI * 2);
      
      if (node.fixed) {
        ctx.fillStyle = '#22C55E';
      } else if (selectedNode === node.id) {
        ctx.fillStyle = '#00D4FF';
      } else {
        ctx.fillStyle = '#FF6B9C';
      }
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Draw road line
    if (beams.length > 0) {
      const roadNodes = nodes.filter(n => n.y === 350).sort((a, b) => a.x - b.x);
      if (roadNodes.length >= 2) {
        ctx.beginPath();
        ctx.setLineDash([10, 5]);
        ctx.moveTo(roadNodes[0].x, roadNodes[0].y - 5);
        roadNodes.forEach(node => {
          ctx.lineTo(node.x, node.y - 5);
        });
        ctx.strokeStyle = 'rgba(255, 255, 0, 0.5)';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }
  }, [nodes, beams, selectedNode]);

  useEffect(() => {
    draw();
  }, [draw]);

  const handleCanvasClick = (e) => {
    if (isSimulating) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicking on existing node
    const clickedNode = nodes.find(node => {
      const dx = node.x - x;
      const dy = node.y - y;
      return Math.sqrt(dx * dx + dy * dy) < 20;
    });

    if (mode === 'node') {
      if (clickedNode) {
        setSelectedNode(clickedNode.id);
      } else if (budget >= NODE_COST) {
        // Add new node
        const newNode = {
          id: `node-${Date.now()}`,
          x: Math.round(x / 25) * 25,
          y: Math.round(y / 25) * 25,
          fixed: false
        };
        setNodes([...nodes, newNode]);
        setBudget(prev => prev - NODE_COST);
      }
    } else if (mode === 'beam') {
      if (clickedNode) {
        if (selectedNode === null) {
          setSelectedNode(clickedNode.id);
        } else if (selectedNode !== clickedNode.id && budget >= BEAM_COST) {
          // Check if beam already exists
          const beamExists = beams.some(b => 
            (b.start === selectedNode && b.end === clickedNode.id) ||
            (b.start === clickedNode.id && b.end === selectedNode)
          );
          
          if (!beamExists) {
            setBeams([...beams, {
              id: `beam-${Date.now()}`,
              start: selectedNode,
              end: clickedNode.id,
              stress: 0
            }]);
            setBudget(prev => prev - BEAM_COST);
          }
          setSelectedNode(null);
        }
      }
    }
  };

  const simulate = useCallback(() => {
    setIsSimulating(true);
    let frame = 0;
    const maxFrames = 100;

    const runSimulation = () => {
      // Simple physics simulation
      const newNodes = nodes.map(node => {
        if (node.fixed) return node;
        
        let forceY = 0.5; // Gravity
        
        // Calculate forces from connected beams
        beams.forEach(beam => {
          if (beam.start === node.id || beam.end === node.id) {
            const otherNode = nodes.find(n => 
              n.id === (beam.start === node.id ? beam.end : beam.start)
            );
            if (otherNode) {
              const dx = otherNode.x - node.x;
              const dy = otherNode.y - node.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              const restLength = 100;
              const stretch = (distance - restLength) / restLength;
              
              forceY += (dy / distance) * stretch * 0.5;
            }
          }
        });

        return {
          ...node,
          y: Math.min(400, node.y + forceY)
        };
      });

      // Update beam stress
      const newBeams = beams.map(beam => {
        const startNode = newNodes.find(n => n.id === beam.start);
        const endNode = newNodes.find(n => n.id === beam.end);
        if (startNode && endNode) {
          const dx = endNode.x - startNode.x;
          const dy = endNode.y - startNode.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const stress = Math.min(1, Math.abs(distance - 100) / 100);
          return { ...beam, stress };
        }
        return beam;
      });

      setNodes(newNodes);
      setBeams(newBeams);

      frame++;
      if (frame < maxFrames) {
        animationRef.current = requestAnimationFrame(runSimulation);
      } else {
        // Calculate score
        const bridgeComplete = checkBridgeComplete(newNodes, newBeams);
        const avgStress = newBeams.reduce((sum, b) => sum + (b.stress || 0), 0) / newBeams.length;
        const budgetRemaining = budget;
        
        let calculatedScore = 0;
        if (bridgeComplete) {
          calculatedScore = Math.round((1 - avgStress) * 500 + budgetRemaining);
        }
        setScore(calculatedScore);
        setIsSimulating(false);
      }
    };

    runSimulation();
  }, [nodes, beams, budget]);

  const checkBridgeComplete = (nodeList, beamList) => {
    // Check if there's a path from left anchor to right anchor
    const leftAnchor = nodeList.find(n => n.id === 'anchor-left');
    const rightAnchor = nodeList.find(n => n.id === 'anchor-right');
    
    if (!leftAnchor || !rightAnchor) return false;

    const visited = new Set();
    const queue = [leftAnchor.id];

    while (queue.length > 0) {
      const current = queue.shift();
      if (current === rightAnchor.id) return true;
      if (visited.has(current)) continue;
      visited.add(current);

      beamList.forEach(beam => {
        if (beam.start === current && !visited.has(beam.end)) {
          queue.push(beam.end);
        }
        if (beam.end === current && !visited.has(beam.start)) {
          queue.push(beam.start);
        }
      });
    }

    return false;
  };

  const reset = () => {
    setNodes(FIXED_NODES);
    setBeams([]);
    setSelectedNode(null);
    setIsSimulating(false);
    setBudget(1000);
    setScore(0);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  return (
    <div className="bridge-builder">
      <div className="game-header">
        <Link to="/games/categories/civil" className="back-button">
          <FiArrowLeft size={20} />
          Back
        </Link>
        <h1>Bridge Builder</h1>
      </div>

      <div className="game-layout">
        <div className="game-sidebar">
          <div className="info-section">
            <h3>Budget</h3>
            <div className="budget-display">${budget}</div>
            <div className="cost-info">
              <span>Node: ${NODE_COST}</span>
              <span>Beam: ${BEAM_COST}</span>
            </div>
          </div>

          <div className="mode-section">
            <h3>Build Mode</h3>
            <div className="mode-buttons">
              <button
                className={`mode-btn ${mode === 'node' ? 'active' : ''}`}
                onClick={() => setMode('node')}
                disabled={isSimulating}
              >
                Add Nodes
              </button>
              <button
                className={`mode-btn ${mode === 'beam' ? 'active' : ''}`}
                onClick={() => setMode('beam')}
                disabled={isSimulating}
              >
                Add Beams
              </button>
            </div>
          </div>

          <div className="instructions">
            <h4>Instructions:</h4>
            <ol>
              <li>Add nodes by clicking in Node mode</li>
              <li>Connect nodes with beams in Beam mode</li>
              <li>Build a bridge across the gap</li>
              <li>Test with simulation</li>
            </ol>
          </div>

          {score > 0 && (
            <div className="score-display">
              <h3>Score</h3>
              <span>{score}</span>
            </div>
          )}

          <div className="control-buttons">
            <button
              className="action-button primary"
              onClick={simulate}
              disabled={isSimulating || beams.length === 0}
            >
              <FiPlay size={18} />
              Test Bridge
            </button>
            <button
              className="action-button secondary"
              onClick={reset}
            >
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
            className="bridge-canvas"
            onClick={handleCanvasClick}
          />
          
          <div className="legend">
            <div className="legend-item">
              <span className="color-dot" style={{ background: '#22C55E' }}></span>
              <span>Low Stress</span>
            </div>
            <div className="legend-item">
              <span className="color-dot" style={{ background: '#FFA500' }}></span>
              <span>Medium Stress</span>
            </div>
            <div className="legend-item">
              <span className="color-dot" style={{ background: '#EF4444' }}></span>
              <span>High Stress</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BridgeBuilder;
