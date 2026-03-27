import React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Case from 'case'
import { Config } from '@hopara/config'
import { Icon } from '@hopara/design-system/src/icons/Icon'
import { Typography } from '@mui/material'
import { httpGet } from '@hopara/http-client'
import { PureComponent } from '@hopara/design-system'
import { Link } from 'react-router-dom'
import { Box } from '@mui/system'
import { Authorization } from '@hopara/authorization'

const services = [
  {
    name: 'auth',
    url: Config.getValue('AUTH_API_ADDRESS'),
  },
  {
    name: 'visualization',
    url: Config.getValue('VISUALIZATION_API_ADDRESS'),
    authenticated: true,
  },
  {
    name: 'bff',
    url: Config.getValue('BFF_API_ADDRESS'),
    authenticated: true,
  },
  {
    name: 'dataset',
    url: Config.getValue('DATASET_API_ADDRESS'),
    authenticated: true,
  },
  {
    name: 'notification',
    url: Config.getValue('NOTIFICATION_API_ADDRESS'),
    authenticated: true,
  },
  {
    name: 'resource',
    url: Config.getValue('RESOURCE_API_ADDRESS'),
    authenticated: true,
  },
]

interface State {
  status: {[serviveName: string]: {status?: 'ok' | 'nok', cors?: 'ok' | 'nok'}}
}

class StatusCheckPage extends PureComponent<any, State> {
  constructor(props) {
    super(props)
    this.state = {
      status: {},
    }
  }

  getStatusColor(status) {
    if (status === 'ok') {
      return '#0f7e11'
    } else if (status === 'nok') {
      return '#b9080f'
    }
    return '#888'
  }

  getStatusIcon(status) {
    if (status === 'ok') {
      return <Icon icon='ok' />
    } else if (status === 'nok') {
      return <Icon icon='nok' />
    }
    return <Icon icon='not-defined' />
  }

  async getServiceStatus(url: string, authenticated = false) {
    try {
      const authorization = new Authorization({accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InN0YXR1cy1jaGVja0Bob3BhcmEuaW8iLCJ0ZW5hbnRzIjpbXSwic2NvcGUiOiJzdGF0dXM6cmVhZCIsImlhdCI6MTY2NTAxMTIzNn0.71muznZkYxCfbNVzZVJWonnaQBeFJU4I3KzUEG3Jtvo'})
      const response = await httpGet(url, '/health', {}, authenticated ? authorization : undefined)
      return response.status === 200 ? 'ok' : 'nok'
    } catch {
      return 'nok'
    }
  }

  async checkStatus() {
    services.forEach(async (service) => {
      const status = await this.getServiceStatus(service.url)
      const corsStatus = service.authenticated ? await this.getServiceStatus(service.url, true) : undefined
      this.setState((state) => ({
        status: {
          ...state.status,
          [service.name]: {
            ...state.status[service.name],
            status,
            cors: corsStatus,
          },
        },
      })) 
    })
  }
  
  componentDidMount(): void {
    this.checkStatus()
  }

  public render(): React.ReactNode {
    return (
      <div style={{
        margin: '0 auto',
        maxWidth: 800,
        padding: '0 20px',
      }}>
        <Typography
          variant='h1'
          sx={{
            fontSize: '36px',
            display: 'flex',
            alignItems: 'center',
            padding: '36px 0',
            textDecoration: 'none',
           }}>
          <Box component={Link}
               to={`/`}
               sx={{
                color: 'text.primary',
                display: 'flex',
                textDecoration: 'none',
                marginRight: '24px',
               }}>
            <span style={{display: 'flex'}}>
              <Icon icon='hopara' size={32} />
            </span>
          </Box>
            Status Check
        </Typography>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 300 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Service</TableCell>
                <TableCell align="right">Status</TableCell>
                <TableCell align="right">Cors</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {services.map((service) => (
                <TableRow
                  key={service.name}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {Case.sentence(service.name)}
                  </TableCell>
                  <TableCell align="right" style={{color: this.getStatusColor(this.state.status[service.name]?.status)}}>
                    {this.getStatusIcon(this.state.status[service.name]?.status)}
                  </TableCell>
                  <TableCell align="right" style={{color: this.getStatusColor(this.state.status[service.name]?.cors)}}>
                    {service.authenticated && this.getStatusIcon(this.state.status[service.name]?.cors)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    )
  }
}

export default StatusCheckPage
