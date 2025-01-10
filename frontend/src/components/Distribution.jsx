import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { useEffect, useState, useRef } from 'react';

const Distribution = () => {
  const [isClient, setIsClient] = useState(false);
  const [animatedData, setAnimatedData] = useState([]);
  const [dimensions, setDimensions] = useState({ width: 600, height: 250 });
  const containerRef = useRef(null);
  
  const data = [
    { name: 'Project A', value: 30, color: '#FF4D8F' },
    { name: 'Project B', value: 25, color: '#4D79FF' },
    { name: 'Project C', value: 25, color: '#FFB84D' },
    { name: 'Project D', value: 20, color: '#4DFFED' },
  ];

  useEffect(() => {
    setIsClient(true);
    
    const handleResize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setDimensions({
          width: Math.max(width - 40, 300),
          height: 250
        });
      }
    };

    handleResize(); // Initial size
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Animate bars gradually
    const animateData = () => {
      const steps = 20;
      let currentStep = 0;

      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        
        const currentData = data.map(item => ({
          ...item,
          value: Math.floor(item.value * progress)
        }));
        
        setAnimatedData(currentData);

        if (currentStep === steps) {
          clearInterval(interval);
        }
      }, 50);

      return () => clearInterval(interval);
    };

    animateData();
  }, []);

  // Return null or loading state if not client-side
  if (!isClient) {
    return <div className="w-full p-6 bg-white rounded-lg shadow-xl">Loading...</div>;
  }

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-md border" ref={containerRef}>
      <h2 className="text-xl font-medium text-gray-700 mb-4 text-center">
        Project Distribution
      </h2>
      
      <div className="w-full overflow-x-auto">
        <BarChart
          width={dimensions.width}
          height={dimensions.height}
          data={animatedData}
          layout="vertical"
          margin={{ top: 5, right: 20, left:0, bottom: 5 }}
        >
          <XAxis 
            type="number" 
            unit="%" 
            axisLine={false}
            tickLine={false}
            stroke="#94a3b8"
            fontSize={12}
          />
          <YAxis 
            type="category" 
            dataKey="name" 
            axisLine={false}
            tickLine={false}
            stroke="#94a3b8"
            fontSize={12}
            width={70} 
          />
          <Bar
            dataKey="value"
            animationDuration={0}
            radius={4}
            barSize={12}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </div>
    </div>
  );
};

export default Distribution;
