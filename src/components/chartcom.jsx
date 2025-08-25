import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto"; // ✅ Import from npm

export default function ChartComponent({ type = "bar", data, options }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    // Destroy old chart if it exists
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // Create new chart instance
    chartRef.current = new Chart(canvasRef.current, {
      type,
      data,
      options,
    });

    // Cleanup on unmount
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [type, data, options]);

  return <canvas ref={canvasRef} />;
}
