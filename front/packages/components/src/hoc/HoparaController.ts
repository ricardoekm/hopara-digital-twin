export class HoparaController {
  private refreshSignal?: () => void

  setRefreshSignal(refreshSignal: () => void) {
    this.refreshSignal = refreshSignal
  }
  
  refresh() {
    if (this.refreshSignal) this.refreshSignal()
  }
}
