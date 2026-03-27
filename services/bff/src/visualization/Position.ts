function getPointFields(visualizationType: string) {
    if (visualizationType === '3D') {
        return 'point_3d'
    }
  
    return 'point_2d'
  }
  
  export function getDefaultPositionField(layerType: string, visualizationType:string) : string {
    if (layerType === 'circle' || layerType === 'icon' || layerType === 'text' || 
        layerType === 'composite' || layerType === 'model') {
      return getPointFields(visualizationType)
    }
  
    if (layerType === 'line') {
      return 'line'
    }
  
    if (layerType === 'image') {
      return 'rectangle'
    }
  
    if (layerType === 'polygon') {
      return 'polygon'
    }
  
    return getPointFields(visualizationType)
  }
