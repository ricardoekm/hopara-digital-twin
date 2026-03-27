function isMacOS() {
  const anyNavigator = navigator as any
  if (anyNavigator && anyNavigator.platform) {
    return anyNavigator.platform.toUpperCase().indexOf('MAC') >= 0
  }
  if (anyNavigator.userAgentData && anyNavigator.userAgentData.platform) {
    return anyNavigator.userAgentData.platform.toUpperCase().indexOf('MAC') >= 0
  }
}

export const acceleratorForPlatform = (accelerator: string) => {
  if (isMacOS()) {
    return accelerator
      .replace(/CmdOrCtrl\+/g, '⌘')
      .replace(/Delete/g, '⌫')
      .replace(/Shift\+/g, '⇧')
      .replace(/Alt\+/g, '⌥')
  }
  return accelerator
    .replace(/CmdOrCtrl\+/g, 'Ctrl+')
    .replace(/Delete/g, '⌫')
    .replace(/Shift\+/g, 'Shift+')
    .replace(/Alt\+/g, 'Alt+')
}
