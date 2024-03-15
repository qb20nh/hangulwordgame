/* Copyright yut951121@gmail.com 2024 */
/* eslint-disable no-undef */
const noop = () => { throw new Error('This function should not be called') }
function isNative (fn) {
  const name = fn.name
  if ((typeof name) !== 'string') return false
  const iter = name[Symbol.iterator]
  if (noop.toString.call(iter) !== 'function [Symbol.iterator]() { [native code] }') return false
  for (const c of name) {
    if (c === '\t') return false
    if (c === '\r') return false
    if (c === '\n') return false
    if (c === ' ') return false
    if (c === '!') return false
    if (c === '"') return false
    if (c === '#') return false
    if (c === '%') return false
    if (c === '&') return false
    if (c === '\'') return false
    if (c === '(') return false
    if (c === ')') return false
    if (c === '*') return false
    if (c === '+') return false
    if (c === ',') return false
    if (c === '-') return false
    if (c === '.') return false
    if (c === '/') return false
    if (c === ':') return false
    if (c === ';') return false
    if (c === '<') return false
    if (c === '=') return false
    if (c === '>') return false
    if (c === '?') return false
    if (c === '@') return false
    if (c === '[') return false
    if (c === '\\') return false
    if (c === ']') return false
    if (c === '^') return false
    if (c === '_') return false
    if (c === '`') return false
    if (c === '{') return false
    if (c === '|') return false
    if (c === '}') return false
    if (c === '~') return false
  }
  return noop.toString.call(fn).match(new RegExp(`function\\s*${fn.name}()\\s*{\\s*[native code]\\s*}`))
}

function isPropertyFrozen (descriptor) {
  if (descriptor.configurable === true) return false
  if (descriptor.writable === true) return false
  if (typeof descriptor.set === 'function') return false
  return true
}

function throwIfNotNative (fn) {
  if (!isNative(fn)) throw new Error(`Function ${fn.name} is user-defined and cannot be trusted`)
}

function validate () {
  throwIfNotNative(Object)
  throwIfNotNative(Object.getOwnPropertyDescriptors)
  const descriptors = []
  descriptors.push(Object.getOwnPropertyDescriptors(Object))
  let visitedIndex = 0

  while (visitedIndex < descriptors.length) {
    const descriptor = descriptors[visitedIndex++]
    const value = descriptor.value
    if (typeof value === 'function') {
      throwIfNotNative(value)
    } else if (typeof value === 'object') {
      descriptors.push(Object.getOwnPropertyDescriptors(value ?? {}))
    } else if (!isPropertyFrozen(descriptor)) {
      console.error('Property is not frozen', descriptor)
    }
  }
}
window.validate = validate
