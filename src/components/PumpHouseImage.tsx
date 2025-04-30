import React, { useEffect, useState } from "react";
// Import your images (update these paths if needed)
import pumpStart from "../assets/indicators/Pump/Pump-start.png";
import pumpStop from "../assets/indicators/Pump/Pump-stop.png";
import pumpTrip from "../assets/indicators/Pump/Pump-Trip.png";
import valveOpen from "../assets/indicators/Valve/Valve-Open.png";
import valveClosed from "../assets/indicators/Valve/Valve-close.png";
import tank10 from "../assets/indicators/Tank/Tank-10.gif";
import tank50 from "../assets/indicators/Tank/Tank-50.gif";
import tank100 from "../assets/indicators/Tank/Tank-100.gif";

const TOTAL_TIME = 600; // 10 minutes in seconds

const PumpHouseImage: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [pumpStatus, setPumpStatus] = useState<"START" | "STOP" | "TRIP">("START");
  const [valveStatus, setValveStatus] = useState<"OPEN" | "CLOSED">("OPEN");
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
 // const [windowHeight,setWindowHeight] = useState(window.innerHeight);

  // Handle window resize for responsiveness
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
     // setWindowHeight(window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && pumpStatus === "START" && valveStatus === "OPEN") {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, pumpStatus, valveStatus]);

  // Calculate tank fill percent (from 10 to 100)
  const fillPercent = 10 + ((TOTAL_TIME - timeLeft) / TOTAL_TIME) * 90;
  const tankLevel = Math.round(fillPercent);

  // Select tank image based on level
  const getTankImage = () => {
    if (tankLevel >= 90) return tank100;
    if (tankLevel >= 40) return tank50;
    return tank10;
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

  // Determine layout based on screen size
  // More precise breakpoints for common device sizes
  const isMobile = windowWidth < 480;
  const isTablet = windowWidth >= 480 && windowWidth < 768;
  const isLaptop = windowWidth >= 768 && windowWidth < 1024;
  // const isDesktop = windowWidth >= 1024;
  
  // Component sizing based on device type
  const getComponentSize = () => {
    if (isMobile) return { width: '100%', height: '100vw', maxHeight: '90vh' }; 
    if (isTablet) return { width: '85%', height: '70vw', maxHeight: '600px' };
    if (isLaptop) return { width: '75%', height: '50vw', maxHeight: '500px' };
    return { width: '55%', height: '40vw', maxHeight: '450px' }; // Desktop
  };
  
  const componentSize = getComponentSize();
  
  // Layout for different screen sizes
  const getLayout = () => {
    if (isMobile) return { 
      grid: 'auto auto / 1fr', 
      visualSection: '270px',
      padding: '10px'
    };
    if (isTablet) return { 
      grid: 'auto / 3fr 2fr', 
      visualSection: '100%',
      padding: '15px'
    };
    return { 
      grid: 'auto / 3fr 2fr', 
      visualSection: '100%',
      padding: '20px'
    };
  };
  
  const layout = getLayout();
  
  // Pipe dimensions that scale with container
  const getPipeDimensions = () => {
    if (isMobile) {
      // For mobile, create a pipe that fits in the constrained space
      return {
        tankX: '25%',
        tankY: '15%',
        tankWidth: '30%',
        pipeWidth: '5%', // Reduced from 8% to make it thinner
        pipeStartXOffset: '15%', // Changed to position at top center of tank
        pipeCornerXOffset: '40%', // Moved the corner to create more horizontal space
        valveWidth: '12%',
        pumpWidth: '15%',
        pumpYOffset: '80%'
      };
    }
    
    if (isTablet) {
      return {
        tankX: '20%',
        tankY: '12%',
        tankWidth: '28%',
        pipeWidth: '4%', // Reduced from 6% to make it thinner
        pipeStartXOffset: '14%', // Changed to position at top center of tank
        pipeCornerXOffset: '45%', // Moved the corner to create more horizontal space
        valveWidth: '10%',
        pumpWidth: '13%',
        pumpYOffset: '82%'
      };
    }
    
    // Default for larger screens
    return {
      tankX: '15%',
      tankY: '10%',
      tankWidth: '25%',
      pipeWidth: '3%', // Reduced from 5% to make it thinner
      pipeStartXOffset: '12.5%', // Changed to position at top center of tank
      pipeCornerXOffset: '50%', // Moved the corner to create more horizontal space
      valveWidth: '8%',
      pumpWidth: '12%',
      pumpYOffset: '85%'
    };
  };
  
  const pipeDim = getPipeDimensions();
  
  // Convert percentage to view box coordinates (0-100 range)
  // const vbX = (percent: string) => `${parseFloat(percent)}`;
  // const vbY = (percent: string) => `${parseFloat(percent)}`;
  // const vbWidth = (percent: string) => `${parseFloat(percent)}`;
  
  // Define the animation area (viewBox)
  const svgViewBox = "0 0 100 100";
  
  // Calculate pipe path using percentages for positioning
  const tankX = parseFloat(pipeDim.tankX);
  const tankY = parseFloat(pipeDim.tankY);
  const tankWidth = parseFloat(pipeDim.tankWidth);
  const pipeWidth = parseFloat(pipeDim.pipeWidth);
  
  // Changed pipe start coordinates to be at the top center of the tank
  const pipeStartX = tankX + parseFloat(pipeDim.pipeStartXOffset); // Center of tank
  const pipeStartY = tankY; // Top of tank
  const pipeCornerX = tankX + parseFloat(pipeDim.pipeCornerXOffset);
  const pipeEndY = 85; // Bottom position as percentage
  
  // Create an L-shaped pipe with rounded corners that starts from the top of the tank
  const cornerRadius = pipeWidth * 1.5;
  const pipePath = `M${pipeStartX} ${pipeStartY} 
                    V${pipeStartY - pipeWidth * 2} 
                    H${pipeCornerX - cornerRadius} 
                    Q${pipeCornerX} ${pipeStartY - pipeWidth * 2} ${pipeCornerX} ${pipeStartY - pipeWidth * 2 + cornerRadius} 
                    V${pipeEndY}`;
  
  // Valve and pump positions based on pipe
  const valveX = pipeCornerX;
  const valveY = (pipeStartY - pipeWidth * 2 + cornerRadius + pipeEndY) / 2; // Middle of vertical pipe
  const pumpX = pipeCornerX;
  const pumpY = parseFloat(pipeDim.pumpYOffset);
  
  // Button styles with responsive sizes
  const getButtonStyle = () => {
    const baseFontSize = isMobile ? '0.85rem' : isTablet ? '0.9rem' : '0.95rem';
    
    return {
      padding: isMobile ? '0.7em 1.2em' : '0.8em 1.5em',
      margin: isMobile ? '0.6em 0' : '0.8em 0',
      fontSize: baseFontSize,
      fontWeight: 600,
      borderRadius: '0.5em',
      border: 'none',
      background: 'linear-gradient(90deg, #2196f3, #21cbf3)',
      color: '#fff',
      boxShadow: '0 2px 8px rgba(33,150,243,0.15)',
      cursor: 'pointer',
      transition: 'background 0.3s, transform 0.1s',
      width: '100%',
      textAlign: 'center' as 'center',
    };
  };
  
  const buttonStyle = getButtonStyle();
  
  const buttonHoverStyle: React.CSSProperties = {
    background: 'linear-gradient(90deg, #1976d2, #21cbf3)',
    transform: 'scale(1.04)',
  };

  return (
    <div
      style={{
        position: 'relative',
        width: componentSize.width,
        height: componentSize.height,
        maxHeight: componentSize.maxHeight,
        margin: '2vh auto',
        background: '#f5f5f5',
        borderRadius: 10,
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        display: 'grid',
        gridTemplateColumns: layout.grid.split(' / ')[1],
        gridTemplateRows: layout.grid.split(' / ')[0],
        overflow: 'hidden',
        padding: layout.padding,
      }}
    >
      {/* Visual section with tank, pipe, pump and valve */}
      <div style={{ 
        position: 'relative', 
        height: layout.visualSection,
        width: '100%',
      }}>
        {/* Single L-shaped pipe */}
        <svg 
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            zIndex: 2,
          }}
          viewBox={svgViewBox}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="pipeGradient" gradientUnits="userSpaceOnUse" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={pipeColor} />
              <stop offset="100%" stopColor={`${pipeColor}dd`} />
            </linearGradient>
          </defs>
          
          {/* L-shaped pipe path */}
          <path
            d={pipePath} 
            stroke="url(#pipeGradient)"
            strokeWidth={pipeWidth}
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
            strokeWidth={pipeWidth * 1.2}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              filter: "drop-shadow(0px 2px 3px rgba(0,0,0,0.2))",
            }}
            opacity="0.2"
          />
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
              zIndex: 3,
              overflow: 'visible',
            }}
            viewBox={svgViewBox}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="waterFlow" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.7)">
                  <animate 
                    attributeName="offset" 
                    values="0;1" 
                    dur="2s" 
                    repeatCount="indefinite"
                  />
                </stop>
                <stop offset="20%" stopColor="rgba(33,150,243,0.4)">
                  <animate 
                    attributeName="offset" 
                    values="0.2;1.2" 
                    dur="2s" 
                    repeatCount="indefinite"
                  />
                </stop>
              </linearGradient>
              
              <mask id="pipeMask">
                <path
                  d={pipePath} 
                  stroke="white"
                  strokeWidth={pipeWidth}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </mask>
            </defs>
            
            {/* Masked water flow */}
            <rect 
              x="0" 
              y="0" 
              width="100" 
              height="100" 
              fill="url(#waterFlow)" 
              mask="url(#pipeMask)"
            >
              <animate 
                attributeName="y" 
                from="100" 
                to="-100" 
                dur="3s" 
                repeatCount="indefinite"
              />
            </rect>
          </svg>
        )}

        {/* Tank */}
        <div
          style={{
            position: 'absolute',
            left: `${tankX}%`,
            top: `${tankY}%`,
            width: `${tankWidth}%`,
            height: 'auto',
            aspectRatio: '1/1',
            zIndex: 4,
          }}
        >
          <img
            src={getTankImage()}
            alt="Tank"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '-15%',
              right: '-40%',
              transform: 'translateY(-50%)',
              fontSize: isMobile ? '0.9rem' : isTablet ? '1.1rem' : '1.3rem',
              fontWeight: 'bold',
              color: '#1976d2',
              background: 'rgba(255,255,255,0.9)',
              padding: isMobile ? '4px 6px' : '6px 12px',
              borderRadius: 8,
              zIndex: 10,
              whiteSpace: 'nowrap',
            }}
          >
            {tankLevel}%
          </div>
        </div>

        {/* Valve */}
        <div
          style={{
            position: 'absolute',
            left: `${valveX-1.0}%`,
            top: `${valveY}%`,
            width: pipeDim.valveWidth,
            transform: 'translate(-50%, -50%)',
            zIndex: 6,
          }}
        >
          <img
            src={getValveImage()}
            alt="Valve"
            style={{
              width: '100%',
              height: 'auto',
            }}
          />
        </div>

        {/* Pump */}
        <div
          style={{
            position: 'absolute',
            left: `${pumpX}%`,
            top: `${pumpY}%`,
            width: pipeDim.pumpWidth,
            transform: 'translate(-50%, -50%)',
            zIndex: 5,
          }}
        >
          <img
            src={getPumpImage()}
            alt="Pump"
            style={{
              width: '100%',
              height: 'auto',
            }}
            
          />
        </div>
      </div>

      {/* Control section */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: isMobile ? '10px 15px' : isTablet ? '12px 18px' : '20px',
          justifyContent: 'center',
          height: '100%',
        }}
      >
        {/* Timer Display */}
        <div
          style={{
            fontSize: isMobile ? '1.3rem' : isTablet ? '1.5rem' : '1.8rem',
            fontWeight: 'bold',
            background: '#fff',
            padding: '0.5em 1em',
            borderRadius: 8,
            marginBottom: isMobile ? '12px' : '20px',
            textAlign: 'center',
            border: '1px solid #ddd',
          }}
        >
          {minutes}:{seconds}
        </div>

        {/* Control Buttons */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: isMobile ? '8px' : '10px',
          width: '100%'
        }}>
          <button
            style={{
              ...buttonStyle,
              ...(hoveredBtn === "Start" ? buttonHoverStyle : {}),
              ...(pumpStatus === "START" ? { background: '#4caf50', fontWeight: 'bold' } : {})
            }}
            onMouseEnter={() => setHoveredBtn("Start")}
            onMouseLeave={() => setHoveredBtn(null)}
            onClick={() => setPumpStatus("START")}
          >
            Start
          </button>

          <button
            style={{
              ...buttonStyle,
              ...(hoveredBtn === "Stop" ? buttonHoverStyle : {}),
              ...(pumpStatus === "STOP" ? { background: '#f44336', fontWeight: 'bold' } : {})
            }}
            onMouseEnter={() => setHoveredBtn("Stop")}
            onMouseLeave={() => setHoveredBtn(null)}
            onClick={() => setPumpStatus("STOP")}
          >
            Stop
          </button>

          <button
            style={{
              ...buttonStyle,
              ...(hoveredBtn === "Trip" ? buttonHoverStyle : {}),
              ...(pumpStatus === "TRIP" ? { background: '#ff9800', fontWeight: 'bold' } : {})
            }}
            onMouseEnter={() => setHoveredBtn("Trip")}
            onMouseLeave={() => setHoveredBtn(null)}
            onClick={() => setPumpStatus("TRIP")}
          >
            Trip
          </button>

          <button
            style={{
              ...buttonStyle,
              ...(hoveredBtn === "Valve" ? buttonHoverStyle : {})
            }}
            onMouseEnter={() => setHoveredBtn("Valve")}
            onMouseLeave={() => setHoveredBtn(null)}
            onClick={() => setValveStatus(valveStatus === "OPEN" ? "CLOSED" : "OPEN")}
          >
            {valveStatus === "OPEN" ? "Close Valve" : "Open Valve"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PumpHouseImage;