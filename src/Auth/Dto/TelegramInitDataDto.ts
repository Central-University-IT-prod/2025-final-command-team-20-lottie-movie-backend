export class TelegramInitDataDto {
  queryId: string;
  hash?: string;
  authDate: number;
  canSendAfter?: number;
  user?: {
    id: number;
    is_bot?: boolean;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
    is_premium?: boolean;
    allows_write_to_pm?: boolean;
  };
}
