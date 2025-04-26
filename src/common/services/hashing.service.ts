import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class HashingService {
  private readonly saltRounds = 10;

  async hash(value: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.saltRounds);
    return bcrypt.hash(value, salt);
  }

  async compare(value: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(value, hashed);
  }
}
