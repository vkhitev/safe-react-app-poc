import * as t from 'io-ts'
import * as Either from 'fp-ts/lib/Either'
import * as TaskEither from 'fp-ts/lib/TaskEither'
import { flow } from 'fp-ts/lib/function'
import { request, readDecodeJson } from './shared'
import { memoizeDeep } from './memoize-deep'

type Input = {
  userId: number
}

const UserCodec = t.type({
  id: t.number,
  name: t.string,
  username: t.string,
  email: t.string,
  address: t.type({
    street: t.string,
    suite: t.string,
    city: t.string,
    zipcode: t.string,
    geo: t.type({
      lat: t.string,
      lng: t.string,
    }),
  }),
  phone: t.string,
  website: t.string,
  company: t.type({
    name: t.string,
    catchPhrase: t.string,
    bs: t.string,
  }),
})

export const getUser = memoizeDeep(
  flow(
    ({ userId }: Input) =>
      request(`https://jsonplaceholder.typicode.com/users/${userId}`),

    TaskEither.map(res => {
      if (res.status === 404) {
        return Either.left('error_user_not_found' as const)
      }
      return Either.right(res)
    }),

    readDecodeJson(UserCodec),
  ),
)
