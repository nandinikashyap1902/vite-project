import React, { useState, useEffect } from "react";
// Import your images (update these paths if needed)
import pumpStart from "../assets/indicators/Pump/Pump-start.png";
import pumpStop from "../assets/indicators/Pump/Pump-stop.png";
import pumpTrip from "../assets/indicators/Pump/Pump-Trip.png";
import valveOpen from "../assets/indicators/Valve/Valve-Open.png";
import valveClosed from "../assets/indicators/Valve/Valve-close.png";
import tank10 from "../assets/indicators/Tank/Tank-10.gif";
import tank50 from "../assets/indicators/Tank/Tank-50.gif";
import tank100 from "../assets/indicators/Tank/Tank-100.gif";
// Import static tank images
import tank10Static from "../assets/indicators/Tank/Tank-10.png";
import tank50Static from "../assets/indicators/Tank/Tank-50.png";
import tank100Static from "../assets/indicators/Tank/Tank-100.png";

const TOTAL_TIME = 600; // 10 minutes in seconds

// Define standard SVG viewBox dimensions - this keeps proportions consistent
const SVG_VIEWBOX_WIDTH = 800;
const SVG_VIEWBOX_HEIGHT = 600;

const PumpHouseImage: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [pumpStatus, setPumpStatus] = useState<"START" | "STOP" | "TRIP">("START");
  const [valveStatus, setValveStatus] = useState<"OPEN" | "CLOSED">("OPEN");
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // Track window width for responsive adjustments
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Timer logic
  useEffect(() => {
    if (timeLeft > 0 && pumpStatus === "START" && valveStatus === "OPEN") {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, pumpStatus, valveStatus]);

  // Calculate tank fill percent (from 10 to 100)
  const fillPercent = 10 + ((TOTAL_TIME - timeLeft) / TOTAL_TIME) * 90;
  const tankLevel = Math.round(fillPercent);

  // Select tank image based on level and flow status
  const getTankImage = () => {
    // Determine if flow is active
    const isFlowActive = pumpStatus === "START" && valveStatus === "OPEN";
    
    // Return appropriate tank image based on level and flow status
    if (tankLevel >= 90) {
      return isFlowActive ? tank100 : tank100Static;
    }
    if (tankLevel >= 40) {
      return isFlowActive ? tank50 : tank50Static;
    }
    return isFlowActive ? tank10 : tank10Static;
  };

  // Select pump image
  const getPumpImage = () => {
    switch (pumpStatus) {
      case "START": return pumpStart;
      case "TRIP": return pumpTrip;
      default: return pumpStop;
    }
  };

  // Select valve image
  const getValveImage = () => (valveStatus === "OPEN" ? valveOpen : valveClosed);

  // Timer display in mm:ss
  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, "0");
  const seconds = (timeLeft % 60).toString().padStart(2, "0");

  // Define pipe color
  const pipeColor = valveStatus === "OPEN" && pumpStatus === "START" 
    ? "#2196f3" // Bright blue when active
    : "#90a4ae"; // Grey when inactive
  
  // Debug mode - set to false in production
  const debugPipe = false;

  // FIXED POSITIONS - these never change regardless of screen size
  // Using coordinates within the SVG viewBox (800x600)
  const fixedPositions = {
    // Tank position (top-left corner)
    tankX: 200,
    tankY: 100,
    tankWidth: 200,
    tankHeight: 200,
    
    // Pipe dimensions
    pipeWidth: 20,
    
    // Valve and pump dimensions
    valveSize: 50,
    pumpSize: 60,
    
    // Pipe path
    pipeStartX: 300, // Center of tank (tankX + tankWidth/2)
    pipeStartY: 100, // Top of tank
    pipeCornerY: 70, // Vertical rise above tank
    pipeCornerX: 500, // Horizontal extension
    pipeEndY: 480, // Bottom position of pipe
    
    // Valve and pump positions
    valveX: 500,
    valveY: 275, // Middle of vertical pipe
    pumpX: 500,
    pumpY: 480,
  };
  
  // Pipe corner radius
  const cornerRadius = fixedPositions.pipeWidth * 1.5;
  
  // Define the fixed pipe path
  const pipePath = `M${fixedPositions.pipeStartX},${fixedPositions.pipeStartY} 
                   V${fixedPositions.pipeCornerY} 
                   H${fixedPositions.pipeCornerX - cornerRadius} 
                   Q${fixedPositions.pipeCornerX},${fixedPositions.pipeCornerY} ${fixedPositions.pipeCornerX},${fixedPositions.pipeCornerY + cornerRadius} 
                   V${fixedPositions.pipeEndY}`;
  
  // Calculate pipe length for animation duration
  const calculatePipeLength = () => {
    // Vertical rise from tank to corner
    const verticalRise = fixedPositions.pipeStartY - fixedPositions.pipeCornerY;
    // Horizontal distance to corner
    const horizontalDistance = fixedPositions.pipeCornerX - fixedPositions.pipeStartX;
    // Vertical drop from corner to end
    const verticalDrop = fixedPositions.pipeEndY - fixedPositions.pipeCornerY;
    
    // Account for corner curve (approximate as 1/4 of circumference of a circle with radius = cornerRadius)
    const cornerCurveLength = (Math.PI * cornerRadius) / 2;
    
    // Total pipe length
    return verticalRise + horizontalDistance + verticalDrop + cornerCurveLength;
  };
  
  // Visual speed factor - adjust this to change water flow speed
  const visualSpeedFactor = 0.6; // Lower = faster, Higher = slower
  
  // Total pipe length in SVG units
  const pipeLength = calculatePipeLength();
  
  // Animation durations based on pipe length and speed factor
  const gradientAnimDuration = pipeLength * visualSpeedFactor / 200; // For gradient effect
  const flowAnimDuration = pipeLength * visualSpeedFactor / 100; // For rectangle movement

  // Responsive breakpoints
  const isSmallScreen = windowWidth < 768;
  const isMobileScreen = windowWidth < 576;
  
  // Fixed button styles with responsive adjustments
  const buttonStyle: React.CSSProperties = {
    padding: isMobileScreen ? '0.7em 1em' : '0.8em 1.5em',
    margin: isMobileScreen ? '0.6em 0' : '0.8em 0',
    fontSize: isMobileScreen ? '13px' : '14px',
    fontWeight: 600,
    borderRadius: '0.5em',
    border: 'none',
    background: 'linear-gradient(90deg, #2196f3, #21cbf3)',
    color: '#fff',
    boxShadow: '0 2px 8px rgba(33,150,243,0.15)',
    cursor: 'pointer',
    transition: 'background 0.3s, transform 0.1s',
    width: '100%',
    maxWidth: isMobileScreen ? '300px' : '100%', // Limit button width on mobile
    textAlign: 'center',
  };
  
  const buttonHoverStyle: React.CSSProperties = {
    background: 'linear-gradient(90deg, #1976d2, #21cbf3)',
    transform: 'scale(1.04)',
  };

  return (
    <div 
      style={{
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        background: '#f5f5f5',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: isSmallScreen ? 'column' : 'row',
        alignItems: 'center',
        padding: isMobileScreen ? '10px' : '20px',
      }}
    >
      {/* Visual section with tank, pipe, pump and valve */}
      <div style={{ 
        flex: isSmallScreen ? 'none' : '1 1 600px',
        width: isSmallScreen ? '100%' : 'auto',
        position: 'relative',
        height: isMobileScreen ? '400px' : '500px',
        minWidth: isSmallScreen ? '100%' : '500px',
        maxWidth: '100%',
        marginBottom: isSmallScreen ? '20px' : '0',
      }}>
        {/* SVG container for all fluid system elements */}
        <svg 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
          viewBox={`0 0 ${SVG_VIEWBOX_WIDTH} ${SVG_VIEWBOX_HEIGHT}`}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="pipeGradient" gradientUnits="userSpaceOnUse" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={pipeColor} />
              <stop offset="100%" stopColor={`${pipeColor}dd`} />
            </linearGradient>
            
            {/* Define patterns for valve and pump images */}
            <pattern id="valvePattern" patternUnits="userSpaceOnUse" width={fixedPositions.valveSize} height={fixedPositions.valveSize} x={fixedPositions.valveX-fixedPositions.valveSize/2} y={fixedPositions.valveY-fixedPositions.valveSize/2}>
              <image 
                href={getValveImage()} 
                width={fixedPositions.valveSize} 
                height={fixedPositions.valveSize} 
                preserveAspectRatio="xMidYMid meet"
              />
            </pattern>
            
            <pattern id="pumpPattern" patternUnits="userSpaceOnUse" width={fixedPositions.pumpSize} height={fixedPositions.pumpSize} x={fixedPositions.pumpX-fixedPositions.pumpSize/2} y={fixedPositions.pumpY-fixedPositions.pumpSize/2}>
              <image 
                href={getPumpImage()} 
                width={fixedPositions.pumpSize} 
                height={fixedPositions.pumpSize} 
                preserveAspectRatio="xMidYMid meet"
              />
            </pattern>
          </defs>
          
          {/* Debug connection point */}
          {debugPipe && (
            <circle 
              cx={fixedPositions.pipeStartX}
              cy={fixedPositions.pipeStartY}
              r="5"
              fill="red"
              stroke="white"
              strokeWidth="2"
            />
          )}
          
          {/* L-shaped pipe */}
          <path
            d={pipePath} 
            stroke="url(#pipeGradient)"
            strokeWidth={fixedPositions.pipeWidth}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              filter: "drop-shadow(0px 2px 3px rgba(0,0,0,0.2))",
            }}
          />
          
          {/* Pipe border */}
          <path
            d={pipePath} 
            stroke="#0d47a1"
            strokeWidth={fixedPositions.pipeWidth * 1.2}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              filter: "drop-shadow(0px 2px 3px rgba(0,0,0,0.2))",
            }}
            opacity="0.2"
          />
          
          {/* Valve */}
          <rect 
            x={fixedPositions.valveX-fixedPositions.valveSize/2} 
            y={fixedPositions.valveY-fixedPositions.valveSize/2} 
            width={fixedPositions.valveSize} 
            height={fixedPositions.valveSize} 
            fill="url(#valvePattern)"
          />
          
          {/* Pump */}
          <rect 
            x={fixedPositions.pumpX-fixedPositions.pumpSize/2} 
            y={fixedPositions.pumpY-fixedPositions.pumpSize/2} 
            width={fixedPositions.pumpSize} 
            height={fixedPositions.pumpSize} 
            fill="url(#pumpPattern)"
          />
          
          {/* Tank */}
          <image
            x={fixedPositions.tankX}
            y={fixedPositions.tankY}
            width={fixedPositions.tankWidth}
            height={fixedPositions.tankHeight}
            href={getTankImage()}
            preserveAspectRatio="xMidYMid meet"
          />
          
          {/* Tank percentage */}
          <g transform={`translate(${fixedPositions.tankX + fixedPositions.tankWidth + 20}, ${fixedPositions.tankY + 20})`}>
            <rect
              x="0"
              y="0"
              width="60"
              height="30"
              rx="5"
              ry="5"
              fill="rgba(255,255,255,0.9)"
            />
            <text
              x="30"
              y="20"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="16"
              fontWeight="bold"
              fill="#1976d2"
            >
              {tankLevel}%
            </text>
          </g>
        </svg>
        
        {/* Water flow animation */}
        {valveStatus === "OPEN" && pumpStatus === "START" && (
          <svg 
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none'
            }}
            viewBox={`0 0 ${SVG_VIEWBOX_WIDTH} ${SVG_VIEWBOX_HEIGHT}`}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="waterFlow" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.7)">
                  <animate 
                    attributeName="offset" 
                    values="0;1" 
                    dur={`${gradientAnimDuration}s`}
                    repeatCount="indefinite"
                  />
                </stop>
                <stop offset="20%" stopColor="rgba(33,150,243,0.4)">
                  <animate 
                    attributeName="offset" 
                    values="0.2;1.2" 
                    dur={`${gradientAnimDuration}s`}
                    repeatCount="indefinite"
                  />
                </stop>
              </linearGradient>
              
              <mask id="pipeMask">
                <path
                  d={pipePath} 
                  stroke="white"
                  strokeWidth={fixedPositions.pipeWidth}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Add a rectangle mask to exclude the pump area */}
                <rect
                  x={fixedPositions.pumpX - fixedPositions.pumpSize/2 - fixedPositions.pipeWidth}
                  y={fixedPositions.pumpY - fixedPositions.pumpSize/2}
                  width={fixedPositions.pumpSize + fixedPositions.pipeWidth*2}
                  height={fixedPositions.pumpSize}
                  fill="black"
                />
              </mask>
            </defs>
            
            {/* Masked water flow */}
            <rect 
              x="0" 
              y="0" 
              width={SVG_VIEWBOX_WIDTH} 
              height={SVG_VIEWBOX_HEIGHT} 
              fill="url(#waterFlow)" 
              mask="url(#pipeMask)"
            >
              <animate 
                attributeName="y" 
                from={fixedPositions.pumpY - fixedPositions.pumpSize/2} 
                to={-SVG_VIEWBOX_HEIGHT} 
                dur={`${flowAnimDuration}s`}
                repeatCount="indefinite"
              />
            </rect>
          </svg>
        )}
      </div>

      {/* Control section - center aligned on small screens */}
      <div
        style={{
          flex: isSmallScreen ? 'none' : '0 0 300px',
          width: isSmallScreen ? '100%' : 'auto',
          display: 'flex',
          flexDirection: 'column',
          padding: isMobileScreen ? '10px' : '20px',
          justifyContent: 'center',
          alignItems: 'center', // Always center align contents
          maxWidth: isSmallScreen ? '100%' : '350px',
        }}
      >
        {/* Timer Display */}
        <div
          style={{
            fontSize: isMobileScreen ? '1.5rem' : '1.8rem',
            fontWeight: 'bold',
            background: '#fff',
            padding: '0.5em 1em',
            borderRadius: 8,
            marginBottom: '20px',
            textAlign: 'center',
            border: '1px solid #ddd',
            width: '100%',
            maxWidth: '250px', // Limit width for better appearance
          }}
        >
          {minutes}:{seconds}
        </div>

        {/* Control Buttons - center aligned container */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: isMobileScreen ? '8px' : '10px',
          width: '100%',
          maxWidth: '300px', // Ensure buttons don't get too wide
          alignItems: 'center', // Center-align buttons
        }}>
          <button
            style={{
              ...buttonStyle,
              ...(hoveredBtn === 'pump-start' ? buttonHoverStyle : {}),
              background: pumpStatus === "START" ? "linear-gradient(90deg, #388e3c, #4caf50)" : buttonStyle.background,
            }}
            onClick={() => setPumpStatus("START")}
            onMouseEnter={() => setHoveredBtn('pump-start')}
            onMouseLeave={() => setHoveredBtn(null)}
          >
            Start Pump
          </button>
          <button
            style={{
              ...buttonStyle,
              ...(hoveredBtn === 'pump-stop' ? buttonHoverStyle : {}),
              background: pumpStatus === "STOP" ? "linear-gradient(90deg, #d32f2f, #f44336)" : buttonStyle.background,
            }}
            onClick={() => setPumpStatus("STOP")}
            onMouseEnter={() => setHoveredBtn('pump-stop')}
            onMouseLeave={() => setHoveredBtn(null)}
          >
            Stop Pump
          </button>
          <button
            style={{
              ...buttonStyle,
              ...(hoveredBtn === 'pump-trip' ? buttonHoverStyle : {}),
              background: pumpStatus === "TRIP" ? "linear-gradient(90deg, #ff9800, #ffc107)" : buttonStyle.background,
            }}
            onClick={() => setPumpStatus("TRIP")}
            onMouseEnter={() => setHoveredBtn('pump-trip')}
            onMouseLeave={() => setHoveredBtn(null)}
          >
            Trip Pump
          </button>
          <button
            style={{
              ...buttonStyle,
              ...(hoveredBtn === 'valve-toggle' ? buttonHoverStyle : {}),
              background: valveStatus === "OPEN" ? "linear-gradient(90deg, #1565c0, #1e88e5)" : "linear-gradient(90deg, #c62828, #ef5350)",
              marginTop: isMobileScreen ? '15px' : '20px',
            }}
            onClick={() => setValveStatus(valveStatus === "OPEN" ? "CLOSED" : "OPEN")}
            onMouseEnter={() => setHoveredBtn('valve-toggle')}
            onMouseLeave={() => setHoveredBtn(null)}
          >
            {valveStatus === "OPEN" ? "Close Valve" : "Open Valve"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PumpHouseImage;