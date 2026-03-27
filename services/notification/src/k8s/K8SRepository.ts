import {CoreV1Api} from '@kubernetes/client-node'

export class K8SRepository {
  k8sApi: CoreV1Api

  constructor(k8sApi: CoreV1Api) {
    this.k8sApi = k8sApi
  }

  async getPodIps(filterIp:string) : Promise<string[]> {
    const res = await this.k8sApi.listNamespacedPod({namespace: 'default'})
    const pods = res.items.filter((pod) => pod.metadata?.labels?.app === 'notification')

    return pods.map((pod) => pod.status?.podIP).filter((ip) => !!ip && ip !== filterIp) as string[]
  }
}
