import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Marks a route as public so the global JwtAuthGuard skips JWT checks.
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
