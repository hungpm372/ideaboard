import { useMutation } from 'convex/react'
import { useState } from 'react'

export const useApiMutation = (mutationFunction: any) => {
  const [pending, setPending] = useState<boolean>(false)
  const apiMutation = useMutation(mutationFunction)

  const mutate = (args: any) => {
    setPending(true)

    return apiMutation(args)
      .finally(() => setPending(false))
      .then((res) => res)
      .catch((err) => {
        throw err
      })
  }

  return { mutate, pending }
}
