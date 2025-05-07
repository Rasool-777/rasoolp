"use client"

import { useEffect, useRef, useState } from "react"
import Chart from "chart.js/auto"
import { saveAs } from "file-saver"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import toast from "react-hot-toast"

const ChartRenderer = ({ data, xAxis, yAxis, chartType, title }) => {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)
  const [isRendering, setIsRendering] = useState(false)

  useEffect(() => {
    if (chartRef.current && data && data.length > 0) {
      // Destroy previous chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }

      try {
        // Extract data for the selected axes
        const labels = data.map((item) => item[xAxis])
        const values = data.map((item) => {
          const val = Number.parseFloat(item[yAxis])
          return isNaN(val) ? 0 : val // Handle non-numeric values
        })

        // Create chart configuration
        const config = {
          type: chartType,
          data: {
            labels: labels,
            datasets: [
              {
                label: yAxis,
                data: values,
                backgroundColor:
                  chartType === "pie"
                    ? values.map(
                        () =>
                          `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`,
                      )
                    : "rgba(75, 192, 192, 0.2)",
                borderColor:
                  chartType === "pie"
                    ? values.map(
                        () =>
                          `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`,
                      )
                    : "rgba(75, 192, 192, 1)",
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
                display: chartType !== "pie",
              },
              x: {
                display: chartType !== "pie",
              },
            },
          },
        }

        // Create new chart
        const ctx = chartRef.current.getContext("2d")
        chartInstance.current = new Chart(ctx, config)
      } catch (error) {
        console.error("Error rendering chart:", error)
        toast.error("Error rendering chart. Please check your data.")
      }
    }

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data, xAxis, yAxis, chartType, title])

  const downloadAsPNG = async () => {
    if (chartRef.current) {
      setIsRendering(true)
      try {
        const canvas = await html2canvas(chartRef.current)
        canvas.toBlob((blob) => {
          saveAs(blob, `${title || "chart"}.png`)
          setIsRendering(false)
          toast.success("Chart downloaded as PNG")
        })
      } catch (error) {
        console.error("Error downloading chart:", error)
        toast.error("Error downloading chart")
        setIsRendering(false)
      }
    }
  }

  const downloadAsPDF = async () => {
    if (chartRef.current) {
      setIsRendering(true)
      try {
        const canvas = await html2canvas(chartRef.current)
        const imgData = canvas.toDataURL("image/png")
        const pdf = new jsPDF("landscape")
        const imgProps = pdf.getImageProperties(imgData)
        const pdfWidth = pdf.internal.pageSize.getWidth()
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight)
        pdf.save(`${title || "chart"}.pdf`)
        setIsRendering(false)
        toast.success("Chart downloaded as PDF")
      } catch (error) {
        console.error("Error downloading chart:", error)
        toast.error("Error downloading chart")
        setIsRendering(false)
      }
    }
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="chart-container">
        <canvas ref={chartRef}></canvas>
      </div>
      <div className="flex justify-end mt-4 space-x-2">
        <button
          onClick={downloadAsPNG}
          disabled={isRendering}
          className={`px-4 py-2 ${isRendering ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"} text-white rounded`}
        >
          {isRendering ? "Processing..." : "Download PNG"}
        </button>
        <button
          onClick={downloadAsPDF}
          disabled={isRendering}
          className={`px-4 py-2 ${isRendering ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"} text-white rounded`}
        >
          {isRendering ? "Processing..." : "Download PDF"}
        </button>
      </div>
    </div>
  )
}

export default ChartRenderer
