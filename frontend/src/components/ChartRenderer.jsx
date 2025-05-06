"use client"

import { useEffect, useRef } from "react"
import Chart from "chart.js/auto"
import { saveAs } from "file-saver"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

const ChartRenderer = ({ data, xAxis, yAxis, chartType, title }) => {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  useEffect(() => {
    if (chartRef.current && data && data.length > 0) {
      // Destroy previous chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }

      // Extract data for the selected axes
      const labels = data.map((item) => item[xAxis])
      const values = data.map((item) => Number.parseFloat(item[yAxis]))

      // Create chart configuration
      const config = {
        type: chartType,
        data: {
          labels: labels,
          datasets: [
            {
              label: yAxis,
              data: values,
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: title || `${yAxis} vs ${xAxis}`,
            },
            legend: {
              position: "top",
            },
          },
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      }

      // Create new chart
      const ctx = chartRef.current.getContext("2d")
      chartInstance.current = new Chart(ctx, config)
    }

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data, xAxis, yAxis, chartType, title])

  const downloadAsPNG = () => {
    if (chartRef.current) {
      html2canvas(chartRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, `${title || "chart"}.png`)
        })
      })
    }
  }

  const downloadAsPDF = () => {
    if (chartRef.current) {
      html2canvas(chartRef.current).then((canvas) => {
        const imgData = canvas.toDataURL("image/png")
        const pdf = new jsPDF("landscape")
        const imgProps = pdf.getImageProperties(imgData)
        const pdfWidth = pdf.internal.pageSize.getWidth()
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight)
        pdf.save(`${title || "chart"}.pdf`)
      })
    }
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="chart-container">
        <canvas ref={chartRef}></canvas>
      </div>
      <div className="flex justify-end mt-4 space-x-2">
        <button onClick={downloadAsPNG} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Download PNG
        </button>
        <button onClick={downloadAsPDF} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          Download PDF
        </button>
      </div>
    </div>
  )
}

export default ChartRenderer
