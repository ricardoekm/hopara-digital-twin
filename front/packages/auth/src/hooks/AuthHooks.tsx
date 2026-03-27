import {useState, useEffect} from 'react'
import {useLocation} from 'react-router-dom'

import * as yup from 'yup'
import {i18n} from '@hopara/i18n'

export const useValidEmail = (initialValue: string) => {
  const [email, setEmail] = useState(initialValue)
  const [emailValid, setEmailValid] = useState(true)

  useEffect(() => {
    const emailSchema = yup.object().shape({
      email: yup.string().email().required(),
    })

    if (email.length === 0) {
      setEmailValid(true)
      return
    }

    const valid = emailSchema.isValidSync({email})

    setEmailValid(valid)
  }, [email])

  return {email, setEmail, emailValid}
}

export const useValidPassword = (initialValue: string) => {
  const [password, setPassword] = useState(initialValue)
  const [passwordValid, setPasswordValid] = useState(true)
  const [passwordError, setPasswordError] = useState('')

  useEffect(() => {
    const passwordSchema = yup.object().shape({
      password: yup.string().required().min(10, i18n('PASSWORD_MUST_BE_AT_LEAST_10_CHARACTERS')),
    })

    if (password.length === 0) {
      setPasswordValid(true)
      setPasswordError('')
      return
    }

    try {
      passwordSchema.validateSync({password})
    } catch (e: any) {
      setPasswordValid(false)
      setPasswordError(e.errors[0])
      return
    }
    setPasswordValid(true)
    setPasswordError('')
  }, [password])

  return {password, setPassword, passwordValid, passwordError}
}

export const useValidConfirmationPassword = (password: string, confirmation: string) => {
  const [passwordConfirm, setPasswordConfirm] = useState(confirmation)
  const [passwordConfirmValid, setPasswordValid] = useState(true)
  const [passwordConfirmationError, setPasswordError] = useState('')

  useEffect(() => {
    if (!passwordConfirm || password === passwordConfirm) {
      setPasswordValid(true)
      setPasswordError('')
    } else {
      setPasswordValid(false)
      setPasswordError(i18n('PASSWORDS_DO_NOT_MATCH'))
    }
  }, [password, passwordConfirm])

  return {passwordConfirmValid, passwordConfirmationError, passwordConfirm, setPasswordConfirm}
}

export const useQuery = () => {
  const {search} = useLocation()
  return new URLSearchParams(search)
}

