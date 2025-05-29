// src/auth/jwt-auth.guard.ts
// jwt-auth.guard.ts
import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest();
        console.log('Authorization header:', req.headers['authorization']); // 👈 este sí o sí debería imprimir
        return super.canActivate(context);
      }
}
