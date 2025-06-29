import React, { useRef, useEffect, useState } from 'react';
import Globe from 'globe.gl';
import './GlobeAnimation.css';

const GlobeAnimation = ({ size = 400 }) => {
  const globeEl = useRef();
  const containerRef = useRef();
  const [countries, setCountries] = useState({ features: [] });
  const [arcsData, setArcsData] = useState([]);

  useEffect(() => {
    // Load country data
    fetch('/datasets/ne_110m_admin_0_countries.geojson')
      .catch(() => {
        // If no local file, fetch from a CDN
        return fetch('https://raw.githubusercontent.com/vasturiano/globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson');
      })
      .then(res => res.json())
      .then(data => {
        setCountries(data);
        
        // Generate random arcs data (connections between countries)
        const features = data.features;
        if (!features || features.length === 0) return;
        
        const arcs = [];
        const NUM_ARCS = 20; // Number of arcs to generate
        
        for (let i = 0; i < NUM_ARCS; i++) {
          const sourceIdx = Math.floor(Math.random() * features.length);
          const targetIdx = Math.floor(Math.random() * features.length);
          
          if (sourceIdx !== targetIdx) {
            const sourceCoords = features[sourceIdx].geometry.coordinates[0][0];
            const targetCoords = features[targetIdx].geometry.coordinates[0][0];
            
            // Skip if coordinates aren't valid arrays
            if (!Array.isArray(sourceCoords) || !Array.isArray(targetCoords)) continue;
            
            arcs.push({
              startLat: Array.isArray(sourceCoords[1]) ? sourceCoords[0][1] : sourceCoords[1],
              startLng: Array.isArray(sourceCoords[0]) ? sourceCoords[0][0] : sourceCoords[0],
              endLat: Array.isArray(targetCoords[1]) ? targetCoords[0][1] : targetCoords[1],
              endLng: Array.isArray(targetCoords[0]) ? targetCoords[0][0] : targetCoords[0],
              color: ['#1976d2', '#4fc3f7', '#2196f3'][Math.round(Math.random() * 2)]
            });
          }
        }
        
        setArcsData(arcs);
      });
  }, []);

  useEffect(() => {
    if (!globeEl.current || !containerRef.current) return;
    
    const globe = Globe()
      .backgroundColor('rgba(0,0,0,0)')
      .globeImageUrl('https://raw.githubusercontent.com/vasturiano/globe.gl/master/example/img/earth-blue-marble.jpg')
      .bumpImageUrl('https://raw.githubusercontent.com/vasturiano/globe.gl/master/example/img/earth-topology.png')
      .width(size)
      .height(size)
      .atmosphereColor('#1976d2')
      .atmosphereAltitude(0.15)
      .arcColor('color')
      .arcDashLength(0.4)
      .arcDashGap(0.2)
      .arcStroke(0.5)
      .arcDashAnimateTime(1500)
      .arcsData(arcsData)
      .arcDashInitialGap(() => Math.random())
      .hexPolygonsData(countries.features)
      .hexPolygonResolution(3) // Lower resolution for better performance
      .hexPolygonMargin(0.7)
      .hexPolygonColor(() => '#1976d280')
      .showAtmosphere(true)
      .pointOfView({ lat: 30, lng: 0, altitude: 2.5 })
      (containerRef.current);

    // Auto-rotate the globe
    const rotate = () => {
      globe.pointOfView({
        lng: (globe.pointOfView().lng + 0.15) % 360,
        lat: globe.pointOfView().lat,
        altitude: globe.pointOfView().altitude
      });
      requestAnimationFrame(rotate);
    };
    
    const rotationId = requestAnimationFrame(rotate);

    // Save the reference
    globeEl.current = globe;
    
    // Handle resize
    const handleResize = () => {
      if (globeEl.current) {
        globeEl.current.width(size);
        globeEl.current.height(size);
      }
    };
    
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (globeEl.current) {
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(rotationId);
      }
    };
  }, [size, arcsData, countries.features]);

  return (
    <div 
      className="globe-container"
      ref={containerRef} 
      style={{ 
        width: size,
        height: size
      }}
    >
      <div className="globe-glow"></div>
    </div>
  );
};

export default GlobeAnimation; 