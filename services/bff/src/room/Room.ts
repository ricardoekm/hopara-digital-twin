export class Room {
  id: string
  name: string

  constructor(props: Partial<Room>) {
    Object.assign(this, props)
    this.id = String(props.id)
  }
}
