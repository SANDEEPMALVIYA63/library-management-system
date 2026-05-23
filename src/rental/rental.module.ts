import { Module } from '@nestjs/common';
import { RentalService } from './rental.service';
import { RentalController } from './rental.controller';
import { PrismaModule } from 'src/prisma';

@Module({
  imports: [PrismaModule],
  providers: [RentalService],
  controllers: [RentalController],
})
export class RentalModule {}
