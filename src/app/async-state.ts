type State<Tag extends string, Payload extends object = {}> = {
  tag: Tag
} & Payload

type Loading = State<'Loading'>
type Loaded<T> = State<'Loaded', { value: T }>
type Failed = State<'Failed', { reason: 'NetworkError' }>

export type AsyncState<T> = Loading | Loaded<T> | Failed

export const loading: AsyncState<never> = { tag: 'Loading' }

export const loaded = <T = never>(value: T): AsyncState<T> => ({
  tag: 'Loaded',
  value: value,
})

export const failed: AsyncState<never> = {
  tag: 'Failed',
  reason: 'NetworkError',
}

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
