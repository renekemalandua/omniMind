export abstract class IMailService {
  abstract send(
    email: string,
    name: string,
    token: string,
    body?: string,
  ): Promise<void>;
}
