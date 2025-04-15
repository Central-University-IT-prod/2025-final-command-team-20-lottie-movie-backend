import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

export function validate(scheme: any) {
  return (config: Record<string, unknown>) => {
    const validatedConfig = plainToInstance(scheme, config, {
      enableImplicitConversion: true,
    }) as any;
    if (process.env.NODE_ENV === 'development') {
      console.debug(validatedConfig);
    }
    const errors = validateSync(validatedConfig, {
      skipMissingProperties: false,
    });
    if (errors.length > 0) {
      throw new Error(errors.toString());
    }
    return validatedConfig;
  };
}
