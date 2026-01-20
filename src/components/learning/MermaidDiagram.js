import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import './MermaidDiagram.css';

// Initialize mermaid with configuration
mermaid.initialize({
    startOnLoad: false,
    theme: 'dark',
    themeVariables: {
        primaryColor: '#8b5cf6',
        primaryTextColor: '#fff',
        primaryBorderColor: '#7c3aed',
        lineColor: '#64748b',
        secondaryColor: '#06b6d4',
        tertiaryColor: '#10b981',
        background: '#0f172a',
        mainBkg: '#1e293b',
        secondBkg: '#334155',
        textColor: '#e2e8f0',
        border1: '#475569',
        border2: '#64748b',
        note: '#fbbf24',
        noteBkg: 'rgba(251, 191, 36, 0.1)',
        noteBorder: '#fbbf24',
    },
    fontFamily: 'ui-sans-serif, system-ui, sans-serif',
    fontSize: 14,
    flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'basis',
    },
    sequence: {
        useMaxWidth: true,
        wrap: true,
    },
});

const MermaidDiagram = ({ chart, caption }) => {
    const mermaidRef = useRef(null);
    const [error, setError] = useState(null);
    const [svg, setSvg] = useState('');
    const [isZoomed, setIsZoomed] = useState(false);

    useEffect(() => {
        const renderDiagram = async () => {
            if (!chart || !mermaidRef.current) return;

            try {
                setError(null);

                // Generate unique ID for this diagram
                const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;

                // Render the diagram
                const { svg: renderedSvg } = await mermaid.render(id, chart);
                setSvg(renderedSvg);
            } catch (err) {
                console.error('Mermaid rendering error:', err);
                setError(err.message || 'Failed to render diagram');
            }
        };

        renderDiagram();
    }, [chart]);

    const toggleZoom = () => {
        setIsZoomed(!isZoomed);
    };

    if (error) {
        return (
            <div className="mermaid-error">
                <div className="error-icon">⚠️</div>
                <div className="error-message">
                    <strong>Diagram Error:</strong> {error}
                </div>
                <details className="error-details">
                    <summary>Show diagram code</summary>
                    <pre>{chart}</pre>
                </details>
            </div>
        );
    }

    return (
        <div className="mermaid-container">
            <div
                className={`mermaid-diagram ${isZoomed ? 'zoomed' : ''}`}
                ref={mermaidRef}
                dangerouslySetInnerHTML={{ __html: svg }}
                onClick={toggleZoom}
            />
            {caption && (
                <div className="mermaid-caption">{caption}</div>
            )}
            {svg && (
                <div className="mermaid-hint">
                    💡 Click diagram to {isZoomed ? 'zoom out' : 'zoom in'}
                </div>
            )}
        </div>
    );
};

export default MermaidDiagram;
