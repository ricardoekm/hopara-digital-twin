/* eslint-disable camelcase */
import {httpGet, httpPost} from '@hopara/http-client'
import {Config} from '@hopara/config'
import {i18n} from '@hopara/i18n'
import {Authorization} from '@hopara/authorization'

export type UserStatus = {
  status: 'DOES_NOT_EXIST' | 'CONFIRMED' | 'UNCONFIRMED' | 'SAML' | 'USER_IS_NOT_CORPORATE'
  data?: {
    signInUrl: string
    signOutUrl: string
  }
}

export class AuthService {
  constructor(private onSignedIn?: (accessToken: string, refreshToken: string) => void) {
  }

  async signUp(email: string, password: string): Promise<void> {
    try {
      await httpPost(Config.getValue('AUTH_API_ADDRESS'), '/signup', {email, password})
    } catch (err: any) {
      throw new Error(err?.message ?? i18n('UNKNOWN_ERROR'))
    }
  }

  async signIn(email: string, password: string): Promise<void> {
    try {
      const res = await httpPost(Config.getValue('AUTH_API_ADDRESS'), '/signin', {email, password})
      const {access_token, refresh_token} = await res.data
      if (this.onSignedIn) {
        await this.onSignedIn(access_token, refresh_token)
      }
    } catch (err: any) {
      throw new Error(err?.message ?? i18n('UNKNOWN_ERROR'))
    }
  }

  async setToken(token: string): Promise<void> {
    if (this.onSignedIn) {
      await this.onSignedIn(token, '')
    }
  }

  async getUserStatus(email: string): Promise<UserStatus> {
    try {
      const res = await httpGet(Config.getValue('AUTH_API_ADDRESS'), '/user-status', {email})
      return res.data
    } catch (err: any) {
      throw new Error(err?.message ?? i18n('UNKNOWN_ERROR'))
    }
  }

  async confirmRegistration(email: string, code: string): Promise<void> {
    try {
      await httpPost(Config.getValue('AUTH_API_ADDRESS'), '/confirm-registration', {email, code})
    } catch (err: any) {
      throw new Error(err?.message ?? i18n('UNKNOWN_ERROR'))
    }
  }

  async resendConfirmationEmail(email: string): Promise<void> {
    try {
      await httpPost(Config.getValue('AUTH_API_ADDRESS'), '/resend-confirmation', {email})
    } catch (err: any) {
      throw new Error(err?.message ?? i18n('UNKNOWN_ERROR'))
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      await httpPost(Config.getValue('AUTH_API_ADDRESS'), '/forgot-password', {email})
    } catch (err: any) {
      throw new Error(err?.message ?? i18n('UNKNOWN_ERROR'))
    }
  }

  async resetPasswordFromForgot(email: string, code: string, newPassword: string): Promise<void> {
    try {
      await httpPost(Config.getValue('AUTH_API_ADDRESS'), '/reset-password-from-forgot', {
        email,
        code,
        newPassword,
      })
    } catch (err: any) {
      throw new Error(err?.message ?? i18n('UNKNOWN_ERROR'))
    }
  }

  async changePassword(authorization: Authorization, oldPassword: string, newPassword: string): Promise<void> {
    try {
      await httpPost(
        Config.getValue('AUTH_API_ADDRESS'),
        '/change-password',
        {oldPassword, newPassword},
        undefined,
        authorization,
      )
    } catch (err: any) {
      throw new Error(err?.message ?? i18n('UNKNOWN_ERROR'))
    }
  }

  async resetPasswordFromInvite(email: string, temporaryPassword: string, newPassword: string): Promise<void> {
    try {
      await httpPost(Config.getValue('AUTH_API_ADDRESS'), '/reset-password-from-invite', {
        email,
        temporaryPassword,
        newPassword,
      })
    } catch (err: any) {
      throw new Error(err?.message ?? i18n('UNKNOWN_ERROR'))
    }
  }

  async callback({access_token, id_token}: { access_token: string, id_token: string }): Promise<{
    access_token: string
  }> {
    try {
      const res = await httpPost(Config.getValue('AUTH_API_ADDRESS'), '/callback', {
        access_token,
        id_token,
      })
      return res.data
    } catch (err: any) {
      throw new Error(err?.message ?? i18n('UNKNOWN_ERROR'))
    }
  }
}
