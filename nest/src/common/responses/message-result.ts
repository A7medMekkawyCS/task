/**
 * Controller/service wrapper before the interceptor formats the final HTTP body.
 */
export class MessageResult<T = unknown> {
  constructor(
    public readonly message: string,
    public readonly data: T,
  ) {}
}
