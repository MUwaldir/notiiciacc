import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from './constants';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret, // usa tu secreto real aquí
    });
  }

  async validate(payload: any) {
    console.log('PAYLOAD JWT:', payload); // 👈 este log nos dirá si el token fue aceptado
    return { _id: payload.sub, email: payload.email,rol: payload.rol }; // Asegúrate de que esta estructura tenga el campo `_id`
  }
}
