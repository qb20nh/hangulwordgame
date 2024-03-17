/* Copyright yut951121@gmail.com 2024 */
/* eslint-disable no-undef */
/* eslint-disable no-throw-literal */
;(function () {
  'use strict'
  const noop = () => { throw 'This function should not be called' }
  function isNative (fn) {
    const matches = (parts, str) => {
      let partsMatched = 0
      let matched = 0
      while (partsMatched < parts.length) {
        const part = parts[partsMatched]
        let i = 0
        while (i < part.length && matched < str.length) {
          const p = part[i]
          const c = str[matched]
          if (p === c) {
            i++
            matched++
          } else if ((i === 0 || i === part.length) && (c === ' ' || c === '\t' || c === '\n' || c === '\r')) {
            matched++
          } else {
            return false
          }
        }
        if (i === part.length) {
          partsMatched++
        } else {
          return false
        }
      }
      return true
    }
    const name = fn.name
    if (typeof name !== 'string') return false
    const s = '\t\r\n !"#%&\'()*+,-./:;<=>?@[\\]^`{|}~'
    for (let i = 0; i < name.length; i++) {
      const c = name[i]
      for (let j = 0; j < s.length; j++) {
        if (c === s[j]) return false
      }
    }
    return matches(['function ', fn.name, '()', '{', '[native code]', '}'], noop.toString.call(fn))
  }

  function isPropertyFrozen (descriptor) {
    if (descriptor.configurable === true) return false
    if (descriptor.writable === true) return false
    if (typeof descriptor.set === 'function') return false
    return true
  }

  function throwIfNotNative (fn, expectedName = fn.name) {
    if (typeof expectedName !== 'string') throw 'Expected name must be a string'
    if (!isNative(fn)) throw `Function ${fn.name} is user-defined and cannot be trusted`
    if (fn.name !== expectedName) throw `Function ${expectedName} has been tampered with and cannot be trusted`
  }

  function validate () {
    throwIfNotNative(Object, 'Object')
    throwIfNotNative(Object.getOwnPropertyDescriptors, 'getOwnPropertyDescriptors')
    throwIfNotNative(Object.values, 'values')
    const descriptors = []
    throwIfNotNative(descriptors.push, 'push')
    descriptors.push(Object.getOwnPropertyDescriptors(globalThis))

    for (let visitedIndex = 0; visitedIndex < descriptors.length; visitedIndex++) {
      const descriptor = descriptors[visitedIndex]
      const value = descriptor.value ?? {}
      const isFunction = typeof value === 'function'
      const isObject = typeof value === 'object'
      if (isFunction || isObject) {
        const candidates = Object.getOwnPropertyDescriptors(value)
        // filter already visited objects
        for (const candidate of Object.values(candidates)) {
          if (candidate && !isPropertyFrozen(candidate)) {
            console.error('Property is not frozen', candidate)
          }
        }
        if (isFunction) {
          throwIfNotNative(value)
        }
      } else if (!isPropertyFrozen(descriptor)) {
        console.error('Property is not frozen', descriptor)
      }
    }
  }
  validate()
})()
