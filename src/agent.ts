import { HttpAgent, Cbor, Certificate, bufFromBufLike, lookupResultToBuffer } from '@dfinity/agent'
import invariant from 'invariant'
import { Principal } from '@dfinity/principal'

export const getAgent = async (host: string) => {
  return await HttpAgent.create({ host, shouldFetchRootKey: true })
}

const broadcastTxn = async (host: string, payload: Buffer, canisterId: string, type: 'call' | 'read_state') => {
  const res = await fetch(`${host}/api/v2/canister/${canisterId}/${type}`, {
    body: payload,
    method: 'POST',
    headers: {
      'Content-Type': 'application/cbor',
    },
  })

  // If the status is not 2XX, throw an error
  if (res.status >= 400) {
    throw new Error(`Failed to broadcast transaction: ${res.text()}`)
  }

  return await res.arrayBuffer()
}

export const pollForReadState = async (host: string, payload: Buffer, canisterId: string, requestId: string) => {
  let reply: ArrayBuffer | undefined = undefined
  for (let i = 0; i < 15; i++) {
    const readStateResponse = await broadcastTxn(host, payload, canisterId, 'read_state')
    const readStateData: any = Cbor.decode(readStateResponse)
    const agent = await getAgent(host)
    invariant(agent.rootKey, '[ICP](pollForReadState) Root key not found')

    const encodedCertificate = readStateData.certificate
    const cert = Uint8Array.from(Buffer.from(encodedCertificate, 'hex'))
    const certificate = await Certificate.create({
      certificate: bufFromBufLike(cert),
      rootKey: agent.rootKey,
      maxAgeInMinutes: 100,
      canisterId: Principal.from(canisterId),
    })

    const path = [new TextEncoder().encode('request_status'), Uint8Array.from(Buffer.from(requestId, 'hex'))]
    const status = new TextDecoder().decode(lookupResultToBuffer(certificate.lookup([...(path as any), 'status'])))

    switch (status) {
      case 'rejected':
        {
          const rejectCode = new Uint8Array(lookupResultToBuffer(certificate.lookup([...(path as any), 'reject_code']))!)[0]
          const rejectMessage = new TextDecoder().decode(lookupResultToBuffer(certificate.lookup([...(path as any), 'reject_message']))!)
          const error_code_buf = lookupResultToBuffer(certificate.lookup([...(path as any), 'error_code']))
          const error_code = error_code_buf ? new TextDecoder().decode(error_code_buf) : undefined

          throw new Error(
            `[ICP](pollForReadState) Rejected: rejectCode: ${rejectCode}, rejectMessage: ${rejectMessage}, error_code: ${error_code}`,
          )
        }
        break
      case 'replied':
        reply = lookupResultToBuffer(certificate.lookup([...(path as any), 'reply']))
        break
    }

    if (!reply) {
      // wait 1 second
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }

  if (!reply) {
    throw new Error(`[ICP](pollForReadState) Reply not found`)
  }
  return reply
}

// Explicitly export commonly used items from @dfinity/agent
export { Cbor, HttpAgent, Certificate, bufFromBufLike, lookupResultToBuffer } from '@dfinity/agent'
export * from '@dfinity/agent'
