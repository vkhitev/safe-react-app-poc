import { absurd } from 'fp-ts/lib/function'

type State<Tag extends string, Payload extends object = {}> = {
  tag: Tag
} & Payload

export type FailureReason = 'NetworkError' | 'ValidationError'

export type Loading = State<'Loading'>
export type Loaded<T> = State<'Loaded', { value: T }>
export type Failed = State<'Failed', { reason: FailureReason }>

export type AsyncState<T> = Loading | Loaded<T> | Failed

export const loading: AsyncState<never> = { tag: 'Loading' }

export const loaded = <T = never>(value: T): AsyncState<T> => ({
  tag: 'Loaded',
  value,
})

export const failed = <T = never, E extends FailureReason = never>(
  reason: E,
): AsyncState<T> => ({
  tag: 'Failed',
  reason,
})

export const isLoading = <T = never>(
  state: AsyncState<T>,
): state is Loading => {
  return state.tag === 'Loading'
}

export const isLoaded = <T = never>(
  state: AsyncState<T>,
): state is Loaded<T> => {
  return state.tag === 'Loaded'
}

export const isFailed = <T = never>(state: AsyncState<T>): state is Failed => {
  return state.tag === 'Failed'
}

export type Matchers<T, B> = {
  loading?: () => B
  failed?: (reason: FailureReason) => B
  loaded?: (data: T) => B
}

export const foldState = <T, B>(
  state: AsyncState<T>,
  matchers: Matchers<T, B>,
): B | null => {
  switch (state.tag) {
    case 'Loading':
      return matchers.loading !== undefined ? matchers.loading() : null
    case 'Failed':
      return matchers.failed !== undefined
        ? matchers.failed(state.reason)
        : null
    case 'Loaded':
      return matchers.loaded !== undefined ? matchers.loaded(state.value) : null
    default:
      return absurd(state)
  }
}
