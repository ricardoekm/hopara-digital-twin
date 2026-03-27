export enum TemplateColors {
  blue = '#2d9cf0',
  green = '#3B9932',
  yellow = '#ffc107',
  red = '#E41A0C',
  black = '#333333',
  white = '#ffffff',
}

export enum TemplateSizes {
  iconSize = 21,
  textSize = 21,
  rippleSize = 35,
  circleSize = 35,
}

export class TemplateSchemas {
  static blueBlackWhite = [TemplateColors.blue, TemplateColors.black, TemplateColors.white]
  static whiteBlackWhite = [TemplateColors.white, TemplateColors.black, TemplateColors.white]
}

export class TemplateAnimations {
  static rippleColor = {
    type: 'ripple',
    channel: {
      duration: 1500,
    },
    keyFrames: {
      '0%': {
        opacity: 0.7,
      },
      '70%': {
        opacity: 0,
      },
      '100%': {
        opacity: 0,
      },
    },
  }

  static rippleSize = {
    type: 'ripple',
    channel: {
      duration: 1500,
    },
    keyFrames: {
      '0%': {
        scale: 1,
      },
      '70%': {
        scale: 2,
      },
      '100%': {
        scale: 2,
      },
    },
  }

  static pulse = {
    channel: {
      duration: 1500,
    },
    keyFrames: {
      '0%': {
        scale: 1,
      },
      '60%': {
        scale: 1.2,
      },
      '90%': {
        scale: 1,
      },
    },
    type: 'pulse',
  }
}


export const alertValues = [0, 1, 2]
