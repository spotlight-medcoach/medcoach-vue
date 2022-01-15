import { extend } from 'vee-validate'
import {
  required as ruleRequired,
  required_if as ruleRequiredIf,
  email as ruleEmail,
  min as ruleMin,
  max as ruleMax,
  confirmed as ruleConfirmed,
  regex as ruleRegex,
  between as ruleBetween,
  alpha as ruleAlpha,
  integer as ruleInteger,
  digits as ruleDigits,
  alpha_dash as ruleAlphaDash,
  alpha_num as ruleAlphaNum,
  length as ruleLength,
  size as ruleSize,
  mimes as ruleMimes
} from 'vee-validate/dist/rules'

export const required = extend('required', ruleRequired)

export const requiredIf = extend('required_if', ruleRequiredIf)

export const size = extend('size', ruleSize)

export const mimes = extend('mimes', ruleMimes)

export const email = extend('email', ruleEmail)

export const min = extend('min', ruleMin)

export const max = extend('max', ruleMax)

export const confirmed = extend('confirmed', ruleConfirmed)

export const regex = extend('regex', ruleRegex)

export const between = extend('between', ruleBetween)

export const alpha = extend('alpha', ruleAlpha)

export const integer = extend('integer', ruleInteger)

export const digits = extend('digits', ruleDigits)

export const alphaDash = extend('alpha-dash', ruleAlphaDash)

export const alphaNum = extend('alpha-num', ruleAlphaNum)

export const length = extend('length', ruleLength)
