import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class ApiKeyGuard implements CanActivate {
  private readonly apiKeyService = process.env.API_KEY;
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];

    if (!apiKey || apiKey !== this.apiKeyService) {
      throw new UnauthorizedException('API Key no válida');
    }

    return true;
  }
}
