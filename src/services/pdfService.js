import jsPDF from 'jspdf'

export class PDFService {
  generateEstimatePDF(estimate, project, user) {
    // Create PDF with slightly larger page size for better margins
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })
    
    const pageWidth = pdf.internal.pageSize.width
    const pageHeight = pdf.internal.pageSize.height
    const margin = 20
    let yPosition = margin
    
    // Add a subtle background color to the header
    pdf.setFillColor(245, 247, 250) // Light blue-gray
    pdf.rect(0, 0, pageWidth, 40, 'F')
    
    // Add a subtle accent line at the top
    pdf.setDrawColor(255, 153, 51) // Accent color
    pdf.setLineWidth(2)
    pdf.line(0, 0, pageWidth, 0)
    
    // Header with company logo placeholder
    yPosition = 15
    
    // If company has a logo, we would add it here
    // For now, we'll use a placeholder circle
    pdf.setFillColor(255, 153, 51) // Accent color
    pdf.circle(margin + 5, yPosition, 5, 'F')
    
    // Company name
    pdf.setFontSize(20)
    pdf.setFont(undefined, 'bold')
    pdf.setTextColor(44, 62, 80) // Dark blue-gray
    pdf.text(user.companyName || 'PhotoQuote AI', margin + 15, yPosition)
    
    // Estimate title
    yPosition += 15
    pdf.setFontSize(14)
    pdf.setFont(undefined, 'normal')
    pdf.setTextColor(52, 73, 94) // Slightly lighter blue-gray
    pdf.text('PROFESSIONAL ESTIMATE', margin, yPosition)
    
    // Estimate number and date in the right corner
    pdf.setFontSize(10)
    pdf.setTextColor(100, 116, 139) // Slate gray
    const estimateNumber = `EST-${Date.now().toString().slice(-6)}`
    const dateText = `Date: ${new Date(estimate.generatedOn).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })}`
    
    const estimateNumberWidth = pdf.getStringUnitWidth(estimateNumber) * 10 / pdf.internal.scaleFactor
    const dateTextWidth = pdf.getStringUnitWidth(dateText) * 10 / pdf.internal.scaleFactor
    
    pdf.text(estimateNumber, pageWidth - margin - estimateNumberWidth, yPosition - 10)
    pdf.text(dateText, pageWidth - margin - dateTextWidth, yPosition)
    
    // Add a divider
    yPosition += 10
    pdf.setDrawColor(220, 220, 220) // Light gray
    pdf.setLineWidth(0.5)
    pdf.line(margin, yPosition, pageWidth - margin, yPosition)
    
    // Project and Client Information in a box
    yPosition += 15
    pdf.setFillColor(250, 250, 250) // Very light gray
    pdf.roundedRect(margin, yPosition, pageWidth - (margin * 2), 35, 3, 3, 'F')
    
    yPosition += 10
    
    // Left column - Project Details
    pdf.setFontSize(12)
    pdf.setFont(undefined, 'bold')
    pdf.setTextColor(44, 62, 80) // Dark blue-gray
    pdf.text('PROJECT DETAILS', margin + 5, yPosition)
    
    pdf.setFontSize(10)
    pdf.setFont(undefined, 'normal')
    pdf.setTextColor(100, 116, 139) // Slate gray
    yPosition += 7
    pdf.text(`Job Site: ${project.jobSiteAddress}`, margin + 5, yPosition)
    
    // Right column - Client Details
    pdf.setFontSize(12)
    pdf.setFont(undefined, 'bold')
    pdf.setTextColor(44, 62, 80) // Dark blue-gray
    pdf.text('CLIENT INFORMATION', pageWidth / 2 + 5, yPosition - 7)
    
    pdf.setFontSize(10)
    pdf.setFont(undefined, 'normal')
    pdf.setTextColor(100, 116, 139) // Slate gray
    pdf.text(`Name: ${project.clientName}`, pageWidth / 2 + 5, yPosition)
    
    if (project.clientEmail) {
      yPosition += 7
      pdf.text(`Email: ${project.clientEmail}`, pageWidth / 2 + 5, yPosition)
    }
    
    // Materials & Labor Section
    yPosition += 20
    pdf.setFontSize(14)
    pdf.setFont(undefined, 'bold')
    pdf.setTextColor(44, 62, 80) // Dark blue-gray
    pdf.text('MATERIALS & LABOR BREAKDOWN', margin, yPosition)
    
    // Table header with background
    yPosition += 10
    pdf.setFillColor(52, 73, 94) // Dark blue-gray
    pdf.rect(margin, yPosition, pageWidth - (margin * 2), 8, 'F')
    
    // Table header text
    pdf.setFontSize(10)
    pdf.setFont(undefined, 'bold')
    pdf.setTextColor(255, 255, 255) // White
    
    const colWidths = [(pageWidth - margin * 2) * 0.5, (pageWidth - margin * 2) * 0.15, (pageWidth - margin * 2) * 0.15, (pageWidth - margin * 2) * 0.2]
    const cols = ['Description', 'Quantity', 'Unit Price', 'Total']
    
    yPosition += 5.5 // Center text vertically in the header
    
    let xPosition = margin + 3 // Small padding
    cols.forEach((col, index) => {
      // Align right for numeric columns
      if (index > 0) {
        const textWidth = pdf.getStringUnitWidth(col) * 10 / pdf.internal.scaleFactor
        pdf.text(col, xPosition + colWidths[index] - textWidth - 3, yPosition)
      } else {
        pdf.text(col, xPosition, yPosition)
      }
      xPosition += colWidths[index]
    })
    
    // Table rows
    yPosition += 8
    pdf.setFont(undefined, 'normal')
    pdf.setTextColor(52, 73, 94) // Dark blue-gray
    
    // Add zebra striping to rows
    let rowCount = 0
    
    // Materials
    estimate.materials?.forEach(material => {
      if (yPosition > pageHeight - 50) {
        pdf.addPage()
        yPosition = margin
        
        // Add header to new page
        pdf.setFillColor(245, 247, 250) // Light blue-gray
        pdf.rect(0, 0, pageWidth, 20, 'F')
        
        pdf.setDrawColor(255, 153, 51) // Accent color
        pdf.setLineWidth(2)
        pdf.line(0, 0, pageWidth, 0)
        
        pdf.setFontSize(10)
        pdf.setFont(undefined, 'normal')
        pdf.setTextColor(100, 116, 139) // Slate gray
        pdf.text(`Estimate ${estimateNumber} - Continued`, margin, 15)
        
        // Re-add table header
        yPosition = 30
        pdf.setFillColor(52, 73, 94) // Dark blue-gray
        pdf.rect(margin, yPosition, pageWidth - (margin * 2), 8, 'F')
        
        pdf.setFontSize(10)
        pdf.setFont(undefined, 'bold')
        pdf.setTextColor(255, 255, 255) // White
        
        yPosition += 5.5
        
        xPosition = margin + 3
        cols.forEach((col, index) => {
          if (index > 0) {
            const textWidth = pdf.getStringUnitWidth(col) * 10 / pdf.internal.scaleFactor
            pdf.text(col, xPosition + colWidths[index] - textWidth - 3, yPosition)
          } else {
            pdf.text(col, xPosition, yPosition)
          }
          xPosition += colWidths[index]
        })
        
        yPosition += 8
        pdf.setFont(undefined, 'normal')
        pdf.setTextColor(52, 73, 94) // Dark blue-gray
        rowCount = 0
      }
      
      // Zebra striping
      if (rowCount % 2 === 0) {
        pdf.setFillColor(245, 247, 250) // Light blue-gray
        pdf.rect(margin, yPosition - 5, pageWidth - (margin * 2), 8, 'F')
      }
      
      xPosition = margin + 3
      
      // Description
      pdf.setFontSize(10)
      pdf.text(material.name || 'Material', xPosition, yPosition)
      
      // Quantity
      xPosition += colWidths[0]
      const qtyText = String(material.quantity || 1)
      const qtyWidth = pdf.getStringUnitWidth(qtyText) * 10 / pdf.internal.scaleFactor
      pdf.text(qtyText, xPosition + colWidths[1] - qtyWidth - 3, yPosition)
      
      // Unit Price
      xPosition += colWidths[1]
      const unitText = `$${(material.unitCost || 0).toFixed(2)}`
      const unitWidth = pdf.getStringUnitWidth(unitText) * 10 / pdf.internal.scaleFactor
      pdf.text(unitText, xPosition + colWidths[2] - unitWidth - 3, yPosition)
      
      // Total
      xPosition += colWidths[2]
      const totalText = `$${(material.totalCost || 0).toFixed(2)}`
      const totalWidth = pdf.getStringUnitWidth(totalText) * 10 / pdf.internal.scaleFactor
      pdf.text(totalText, xPosition + colWidths[3] - totalWidth - 3, yPosition)
      
      yPosition += 8
      rowCount++
    })
    
    // Labor
    // Zebra striping
    if (rowCount % 2 === 0) {
      pdf.setFillColor(245, 247, 250) // Light blue-gray
      pdf.rect(margin, yPosition - 5, pageWidth - (margin * 2), 8, 'F')
    }
    
    xPosition = margin + 3
    
    // Description
    pdf.setFontSize(10)
    pdf.setFont(undefined, 'bold')
    pdf.text('Labor', xPosition, yPosition)
    pdf.setFont(undefined, 'normal')
    
    // Quantity
    xPosition += colWidths[0]
    const laborQtyText = String(estimate.laborHours || 0)
    const laborQtyWidth = pdf.getStringUnitWidth(laborQtyText) * 10 / pdf.internal.scaleFactor
    pdf.text(laborQtyText, xPosition + colWidths[1] - laborQtyWidth - 3, yPosition)
    
    // Unit Price
    xPosition += colWidths[1]
    const laborRate = 65
    const laborUnitText = `$${laborRate.toFixed(2)}/hr`
    const laborUnitWidth = pdf.getStringUnitWidth(laborUnitText) * 10 / pdf.internal.scaleFactor
    pdf.text(laborUnitText, xPosition + colWidths[2] - laborUnitWidth - 3, yPosition)
    
    // Total
    xPosition += colWidths[2]
    const laborTotal = (estimate.laborHours || 0) * laborRate
    const laborTotalText = `$${laborTotal.toFixed(2)}`
    const laborTotalWidth = pdf.getStringUnitWidth(laborTotalText) * 10 / pdf.internal.scaleFactor
    pdf.text(laborTotalText, xPosition + colWidths[3] - laborTotalWidth - 3, yPosition)
    
    // Subtotal, Tax, and Total
    yPosition += 15
    
    // Subtotal line
    pdf.setDrawColor(220, 220, 220) // Light gray
    pdf.setLineWidth(0.5)
    pdf.line(margin, yPosition - 5, pageWidth - margin, yPosition - 5)
    
    // Subtotal
    pdf.setFontSize(10)
    pdf.setFont(undefined, 'bold')
    pdf.text('Subtotal:', pageWidth - margin - 60, yPosition)
    
    const subtotalText = `$${(estimate.totalCost || 0).toFixed(2)}`
    const subtotalWidth = pdf.getStringUnitWidth(subtotalText) * 10 / pdf.internal.scaleFactor
    pdf.text(subtotalText, pageWidth - margin - subtotalWidth, yPosition)
    
    // Tax (example - not in original data)
    yPosition += 8
    pdf.setFont(undefined, 'normal')
    pdf.text('Tax (0%):', pageWidth - margin - 60, yPosition)
    
    const taxText = '$0.00'
    const taxWidth = pdf.getStringUnitWidth(taxText) * 10 / pdf.internal.scaleFactor
    pdf.text(taxText, pageWidth - margin - taxWidth, yPosition)
    
    // Total with background highlight
    yPosition += 10
    pdf.setFillColor(255, 153, 51, 0.1) // Accent color with transparency
    pdf.roundedRect(pageWidth - margin - 100, yPosition - 5, 100, 10, 2, 2, 'F')
    
    pdf.setFontSize(12)
    pdf.setFont(undefined, 'bold')
    pdf.setTextColor(44, 62, 80) // Dark blue-gray
    pdf.text('TOTAL:', pageWidth - margin - 60, yPosition + 2)
    
    const totalText = `$${(estimate.totalCost || 0).toLocaleString()}`
    const totalWidth = pdf.getStringUnitWidth(totalText) * 12 / pdf.internal.scaleFactor
    pdf.text(totalText, pageWidth - margin - totalWidth, yPosition + 2)
    
    // Terms and Conditions
    yPosition += 25
    pdf.setFontSize(12)
    pdf.setFont(undefined, 'bold')
    pdf.text('TERMS & CONDITIONS', margin, yPosition)
    
    yPosition += 8
    pdf.setFontSize(9)
    pdf.setFont(undefined, 'normal')
    pdf.setTextColor(100, 116, 139) // Slate gray
    
    const terms = [
      '1. This estimate is valid for 30 days from the date of issue.',
      '2. Payment terms: 50% deposit required to begin work, balance due upon completion.',
      '3. Any changes to the scope of work may result in additional charges.',
      '4. All materials remain the property of the contractor until paid in full.',
      '5. Warranty: All work is guaranteed for 1 year from completion date.'
    ]
    
    terms.forEach(term => {
      pdf.text(term, margin, yPosition)
      yPosition += 5
    })
    
    // Thank you note
    yPosition += 5
    pdf.setFontSize(10)
    pdf.setFont(undefined, 'bold')
    pdf.setTextColor(44, 62, 80) // Dark blue-gray
    pdf.text('Thank you for your business!', margin, yPosition)
    
    // Footer
    pdf.setFontSize(8)
    pdf.setFont(undefined, 'normal')
    pdf.setTextColor(100, 116, 139) // Slate gray
    pdf.text('Generated by PhotoQuote AI - Professional estimates from photos.', margin, pageHeight - 10)
    
    // Add page numbers
    pdf.text(`Page 1 of ${pdf.getNumberOfPages()}`, pageWidth - margin - 25, pageHeight - 10)
    
    // Add page numbers to all pages
    for (let i = 2; i <= pdf.getNumberOfPages(); i++) {
      pdf.setPage(i)
      pdf.text(`Page ${i} of ${pdf.getNumberOfPages()}`, pageWidth - margin - 25, pageHeight - 10)
    }
    
    return pdf
  }

  downloadPDF(pdf, filename = 'estimate.pdf') {
    pdf.save(filename)
  }
}

export const pdfService = new PDFService()
