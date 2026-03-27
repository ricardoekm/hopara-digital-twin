/* eslint-disable camelcase */
import React from 'react'
import { PureComponent } from '@hopara/design-system'
import {AuthContext} from '../../contexts/AuthContext'
import {ErrorPanel} from '@hopara/design-system/src/error/ErrorPanel'

class Callback extends PureComponent<{}, { error: string }> {
  static contextType = AuthContext

  constructor(props) {
    super(props)
    this.state = {
      error: '',
    }
  }

  componentDidMount() {
    // const navigation = usePageNavigation() // Observe que hooks não podem ser usados diretamente em componentes de classe
    const hashValue = window.location.hash
    const decodedHash = decodeURIComponent(hashValue.substring(1))
    const hash = new URLSearchParams(decodedHash)
    const access_token = hash.get('access_token')
    const id_token = hash.get('id_token')

    const authenticate = async () => {
      if (!access_token) {
        this.setState({error: window.location.href})
        return
      }
      try {
        const res = await (this.context as any).authService.callback({access_token, id_token})
        await (this.context as any).authService.setToken(res.access_token)
        const callbackUrl = localStorage.getItem('callback_url') ?? '/'
        localStorage.removeItem('callback_url')
        window.location.href = callbackUrl
      } catch (err: any) {
        this.setState({error: err.message})
      }
    }
    authenticate()
  }

  render() {
    return <>{this.state.error && <ErrorPanel error={this.state.error}/>}</>
  }
}

export default Callback
