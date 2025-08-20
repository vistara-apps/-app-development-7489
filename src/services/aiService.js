// Mock AI service - replace with actual OpenAI integration
export class AIService {
  constructor() {
    // In production, this would use the OpenAI API
    this.mockMaterials = [
      { name: 'Drywall Sheets (4x8)', unitCost: 12.50, category: 'drywall' },
      { name: 'Joint Compound', unitCost: 8.75, category: 'drywall' },
      { name: 'Drywall Screws', unitCost: 15.00, category: 'hardware' },
      { name: 'Metal Studs', unitCost: 3.25, category: 'framing' },
      { name: 'Paint (Gallon)', unitCost: 32.00, category: 'paint' },
      { name: 'Primer (Gallon)', unitCost: 28.00, category: 'paint' },
      { name: 'Electrical Wire (100ft)', unitCost: 45.00, category: 'electrical' },
      { name: 'Outlets', unitCost: 8.50, category: 'electrical' },
      { name: 'Light Fixtures', unitCost: 65.00, category: 'electrical' },
      { name: 'Insulation (Roll)', unitCost: 22.00, category: 'insulation' }
    ]
  }

  async analyzeImages(images) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Mock analysis based on image count and random selection
    const roomSize = Math.random() * 400 + 200 // 200-600 sq ft
    const complexity = Math.random() > 0.5 ? 'standard' : 'complex'
    
    const materials = this.generateMockMaterials(roomSize, complexity)
    const laborHours = this.calculateLaborHours(materials, complexity)
    const totalMaterialCost = materials.reduce((sum, m) => sum + m.totalCost, 0)
    const laborCost = laborHours * 65 // $65/hour labor rate
    const totalCost = totalMaterialCost + laborCost

    return {
      materials,
      laborHours,
      totalCost,
      analysis: {
        roomSize: Math.round(roomSize),
        complexity,
        confidence: Math.random() * 0.3 + 0.7 // 70-100% confidence
      }
    }
  }

  generateMockMaterials(roomSize, complexity) {
    const materials = []
    
    // Base materials needed for most projects
    const baseMaterials = [
      { name: 'Drywall Sheets (4x8)', quantity: Math.ceil(roomSize / 32), unitCost: 12.50 },
      { name: 'Joint Compound', quantity: Math.ceil(roomSize / 100), unitCost: 8.75 },
      { name: 'Drywall Screws', quantity: Math.ceil(roomSize / 50), unitCost: 15.00 },
      { name: 'Paint (Gallon)', quantity: Math.ceil(roomSize / 150), unitCost: 32.00 }
    ]

    // Add complexity-based materials
    if (complexity === 'complex') {
      baseMaterials.push(
        { name: 'Metal Studs', quantity: Math.ceil(roomSize / 25), unitCost: 3.25 },
        { name: 'Electrical Wire (100ft)', quantity: Math.ceil(roomSize / 200), unitCost: 45.00 },
        { name: 'Outlets', quantity: Math.ceil(roomSize / 100), unitCost: 8.50 }
      )
    }

    return baseMaterials.map(material => ({
      materialId: `mat_${Date.now()}_${Math.random()}`,
      name: material.name,
      quantity: material.quantity,
      unitCost: material.unitCost,
      totalCost: material.quantity * material.unitCost
    }))
  }

  calculateLaborHours(materials, complexity) {
    const baseMaterialsTotal = materials.reduce((sum, m) => sum + m.totalCost, 0)
    const baseHours = baseMaterialsTotal / 100 // Rough estimate: $100 materials = 1 hour
    const complexityMultiplier = complexity === 'complex' ? 1.5 : 1.2
    
    return Math.round(baseHours * complexityMultiplier)
  }
}

export const aiService = new AIService()