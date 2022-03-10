import pSettle from 'p-settle'
import rimraf from 'rimraf'
import { promisify } from 'util'

export const rmrf = promisify(rimraf)

export function findObjectProperty<X>(
  x: X[] | Record<string, X> | undefined,
  key: string | number
): X | undefined {
  if (!x) return undefined
  const needle = key.toString()
  return Object.entries(x).find(([k, _]) => k === needle)?.[1]
}

export async function updateObjectPropertiesAsync<X>(
  x: X[] | Record<string, X>,
  f: (x: X, key: string | number) => Promise<X>,
  options?: { concurrency?: number }
) {
  if (Array.isArray(x)) {
    const newValues = await pSettle(
      x.map((v, i) => f(v, i)),
      { concurrency: options?.concurrency || 1 }
    )
    newValues.forEach((v, i) => (x[i] = v.isFulfilled ? v.value : (null as any)))
    for (const v of newValues) {
      if (v.isRejected) throw new Error(`updatePropertiesAsync: ${v.reason}`)
    }
  } else {
    const entries = Object.entries(x)
    const newValues = await pSettle(
      entries.map(
        ([k, v]) =>
          () =>
            f(v, k)
      )
    )
    newValues.forEach((v, i) => (x[entries[i][0]] = v.isFulfilled ? v.value : (null as any)))
    for (const v of newValues) {
      if (v.isRejected) throw new Error(`updatePropertiesAsync: ${v.reason}`)
    }
  }
  return x
}
