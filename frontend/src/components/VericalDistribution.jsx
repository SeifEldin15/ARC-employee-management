import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { useEffect, useState, useRef } from 'react';

const VerticalDistribution = () => {
  const [isClient, setIsClient] = useState(false);
  const [animatedData, setAnimatedData] = useState([]);
  const [dimensions, setDimensions] = useState({ width: 600, height: 300 });
  const containerRef = useRef(null);
  
  const data = [
    { name: 'Jan', value: 85, color: '#FF4D8F' },
    { name: 'Feb', value: 82, color: '#4D79FF' },
    { name: 'Mar', value: 88, color: '#FFB84D' },
    { name: 'Apr', value: 87, color: '#4DFFED' },
    { name: 'May', value: 90, color: '#FF8A4D' },
    { name: 'Jun', value: 93, color: '#4DFF5C' },
  ];

  useEffect(() => {
    setIsClient(true);
    
    const handleResize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setDimensions({
          width: Math.max(width - 40, 200),
          height: Math.min(width * 0.4, 200)
        });
      }
    };

    handleResize();
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

  if (!isClient) {
    return <div className="w-full p-6 bg-white rounded-lg shadow-md border">Loading...</div>;
  }

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-md border" ref={containerRef}>
      <h2 className="text-xl font-medium text-gray-700 mb-4 text-center">
        Utilization Trend
      </h2>
      
      <div className="w-full overflow-x-auto">
        <BarChart
          width={dimensions.width}
          height={dimensions.height}
          data={animatedData}
          margin={{ top: 5, right: 15, left: 15, bottom: 20 }}
        >
          <XAxis 
            dataKey="name" 
            axisLine={false}
            tickLine={false}
            stroke="#94a3b8"
            fontSize={12}
          />
          <YAxis 
            type="number"
            unit="%" 
            axisLine={false}
            tickLine={false}
            stroke="#94a3b8"
            fontSize={12}
            domain={[0, 100]}
          />
          <Tooltip />
          <Bar
            dataKey="value"
            animationDuration={0}
            radius={[3, 3, 0, 0]}
            barSize={20}
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

export default VerticalDistribution;
