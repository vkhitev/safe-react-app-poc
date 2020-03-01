import * as t from 'io-ts'
import * as Either from 'fp-ts/lib/Either'
import { FailureReason } from 'app/async-state'

type Input = {
  userId: string
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

export type UserModel = t.TypeOf<typeof UserCodec>

export type ResponseError = 'error_user_not_found'

export type Output = Either.Either<
  FailureReason,
  Either.Either<ResponseError, UserModel>
>

export const getUser = async ({ userId }: Input): Promise<Output> => {
  try {
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/users/${userId}`,
    )

    if (res.status === 404) {
      return Either.right(Either.left('error_user_not_found'))
    }

    const body: unknown = await res.json()

    console.log(body)

    const validatedBody = UserCodec.decode(body)

    if (Either.isLeft(validatedBody)) {
      return Either.left('ValidationError')
    }

    const value = validatedBody.right

    return Either.right(Either.right(value))
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      return Either.left('NetworkError')
    }
    if (error instanceof SyntaxError) {
      return Either.left('ValidationError')
    }
    throw error
  }
}
