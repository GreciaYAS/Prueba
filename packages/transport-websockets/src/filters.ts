import * as mafmt from '@multiformats/mafmt'
import {
  CODE_CIRCUIT,
  CODE_P2P,
  CODE_TCP,
  CODE_WS,
  CODE_WSS
} from './constants.js'
import type { Multiaddr } from '@multiformats/multiaddr'

export function all (multiaddrs: Multiaddr[]): Multiaddr[] {
  return multiaddrs.filter((ma) => {
    if (ma.protoCodes().includes(CODE_CIRCUIT)) {
      return false
    }

    const testMa = ma.decapsulateCode(CODE_P2P)

    return mafmt.WebSockets.matches(testMa) ||
      mafmt.WebSocketsSecure.matches(testMa)
  })
}

export function wss (multiaddrs: Multiaddr[]): Multiaddr[] {
  return multiaddrs.filter((ma) => {
    if (ma.protoCodes().includes(CODE_CIRCUIT)) {
      return false
    }

    const testMa = ma.decapsulateCode(CODE_P2P)

    return mafmt.WebSocketsSecure.matches(testMa)
  })
}

export function dnsWss (multiaddrs: Multiaddr[]): Multiaddr[] {
  return multiaddrs.filter((ma) => {
    if (ma.protoCodes().includes(CODE_CIRCUIT)) {
      return false
    }

    const testMa = ma.decapsulateCode(CODE_P2P)

    return mafmt.WebSocketsSecure.matches(testMa) &&
      mafmt.DNS.matches(testMa.decapsulateCode(CODE_TCP).decapsulateCode(CODE_WSS))
  })
}

export function dnsWsOrWss (multiaddrs: Multiaddr[]): Multiaddr[] {
  return multiaddrs.filter((ma) => {
    if (ma.protoCodes().includes(CODE_CIRCUIT)) {
      return false
    }

    const testMa = ma.decapsulateCode(CODE_P2P)

    // WS
    if (mafmt.WebSockets.matches(testMa)) {
      return mafmt.DNS.matches(testMa.decapsulateCode(CODE_TCP).decapsulateCode(CODE_WS))
    }

    // WSS
    return mafmt.WebSocketsSecure.matches(testMa) &&
      mafmt.DNS.matches(testMa.decapsulateCode(CODE_TCP).decapsulateCode(CODE_WSS))
  })
}
