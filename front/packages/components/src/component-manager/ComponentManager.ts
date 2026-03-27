export type ComponentCtor<T, A extends any[] = any[]> = new (...args: A) => T;

export class ComponentManager<T, A extends any[] = any[]> {
  components: Record<string, ComponentCtor<T, A>>

  constructor(components?: Record<string, ComponentCtor<T, A>>) {
    this.components = components || {}
  }

  register(name: string, component: ComponentCtor<T, A>) {
    this.components[name] = component
  }

  get(name: string): ComponentCtor<T, A> {
    return this.components[name]
  }
}

export function makeComponentManager<Ctor extends new(...args: any[]) => any>() {
  type Instance = InstanceType<Ctor>
  type Args = ConstructorParameters<Ctor>
  return new ComponentManager<Instance, Args>()
}
